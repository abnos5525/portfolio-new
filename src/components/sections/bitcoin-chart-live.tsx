"use client"

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react"

import type { Locale } from "@/content"
import { asBtcSeries, btcRanges, stampBtcPrice, type BtcRange, type BtcSeries } from "@/lib/btc"
import { cn } from "@/lib/utils"

type Props = {
  locale: Locale
  initial: BtcSeries | null
  title: string
  unit: string
  unavailable: string
  source: string
  lowLabel: string
  highLabel: string
  rangesLabel: string
  ranges: Record<BtcRange, string>
}

const VB_W = 1000
const VB_H = 280
const PAD_Y = 16

function money(locale: Locale) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function signed(locale: Locale) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    signDisplay: "exceptZero",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function clock(locale: Locale, withDay: boolean) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    timeZone: "Asia/Tehran",
    month: withDay ? "short" : undefined,
    day: withDay ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function BitcoinChartLive({
  locale,
  initial,
  title,
  unit,
  unavailable,
  lowLabel,
  highLabel,
  rangesLabel,
  ranges,
}: Props) {
  const [series, setSeries] = useState(initial)
  const [range, setRange] = useState<BtcRange>("1d")
  const [ratio, setRatio] = useState<number | null>(null)
  const liveRef = useRef<{ price: number; at: number } | null>(null)
  const rangeRequest = useRef(0)
  const formatMoney = useMemo(() => money(locale), [locale])
  const formatChange = useMemo(() => signed(locale), [locale])
  const formatClock = useMemo(() => clock(locale, true), [locale])
  const formatAxis = useMemo(() => clock(locale, range !== "1h"), [locale, range])

  useEffect(() => {
    let alive = true
    let socket: WebSocket | null = null
    let reconnectTimer = 0
    let flushTimer = 0
    let pendingPrice = 0
    let pendingAt = 0

    const connect = () => {
      socket = new WebSocket("wss://ws-feed.exchange.coinbase.com")
      socket.onopen = () => {
        socket?.send(
          JSON.stringify({
            type: "subscribe",
            product_ids: ["BTC-USD"],
            channels: ["ticker"],
          }),
        )
      }
      socket.onmessage = (event) => {
        if (!alive || typeof event.data !== "string") return
        let data: unknown
        try {
          data = JSON.parse(event.data)
        } catch (error) {
          console.error("Bitcoin ticker parse failed", error)
          return
        }
        if (!data || typeof data !== "object") return
        const row = data as Record<string, unknown>
        if (row.type !== "ticker") return
        const price = Number(row.price)
        if (!Number.isFinite(price) || price <= 0) return
        const parsed = typeof row.time === "string" ? Math.floor(Date.parse(row.time) / 1000) : Number.NaN
        pendingPrice = price
        pendingAt = Number.isFinite(parsed) ? parsed : Math.floor(Date.now() / 1000)
        liveRef.current = { price: pendingPrice, at: pendingAt }
        if (flushTimer) return
        flushTimer = window.setTimeout(() => {
          flushTimer = 0
          if (!alive || pendingPrice <= 0) return
          setSeries((current) => (current ? stampBtcPrice(current, pendingPrice, pendingAt) : current))
        }, 400)
      }
      socket.onclose = () => {
        if (!alive || reconnectTimer) return
        reconnectTimer = window.setTimeout(() => {
          reconnectTimer = 0
          connect()
        }, 2000)
      }
    }

    connect()
    return () => {
      alive = false
      window.clearTimeout(reconnectTimer)
      window.clearTimeout(flushTimer)
      socket?.close()
    }
  }, [])

  const selectRange = (next: BtcRange) => {
    if (next === range) return
    const requestId = ++rangeRequest.current
    const previous = range
    setRange(next)
    setRatio(null)
    void (async () => {
      try {
        const response = await fetch(`/api/btc?range=${next}`, { cache: "no-store" })
        if (!response.ok) throw new Error(`Bitcoin history returned ${response.status}`)
        const loaded = asBtcSeries(await response.json())
        if (requestId !== rangeRequest.current) return
        if (!loaded) throw new Error("Bitcoin history was empty")
        const live = liveRef.current
        setSeries(live ? stampBtcPrice(loaded, live.price, live.at) : loaded)
      } catch (error) {
        console.error("Bitcoin history failed", error)
        if (requestId === rangeRequest.current) setRange(previous)
      }
    })()
  }

  const chart = useMemo(() => {
    if (!series) return null
    const prices = series.points.map((point) => point.p)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const span = max - min || 1
    const innerH = VB_H - PAD_Y * 2
    const lastIndex = series.points.length - 1
    const coords = series.points.map((point, index) => {
      const x = lastIndex === 0 ? 0 : (index / lastIndex) * VB_W
      const y = PAD_Y + (1 - (point.p - min) / span) * innerH
      return { x, y, ...point }
    })
    const line = coords
      .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(2)},${coord.y.toFixed(2)}`)
      .join(" ")
    const first = coords[0]
    const middle = coords[Math.floor(lastIndex / 2)]
    const last = coords[lastIndex]
    if (!first || !middle || !last) return null
    const area = `${line} L${last.x.toFixed(2)},${VB_H - PAD_Y} L${first.x.toFixed(2)},${VB_H - PAD_Y} Z`
    return { min, max, coords, line, area, first, middle, last }
  }, [series])

  const inspected = useMemo(() => {
    if (!chart || ratio == null) return null
    const index = Math.round(ratio * (chart.coords.length - 1))
    return chart.coords[index] ?? null
  }, [chart, ratio])

  const readRatio = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width <= 0) return
    const next = (event.clientX - rect.left) / rect.width
    setRatio(Math.min(1, Math.max(0, next)))
  }

  const liveTop = chart ? `${(chart.last.y / VB_H) * 100}%` : "50%"

  return (
    <section className="page-gutter mx-auto mt-16 w-full max-w-6xl sm:mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-primary text-xs font-medium">{title}</p>
        <div
          role="group"
          aria-label={rangesLabel}
          className="border-border flex w-full rounded-lg border p-1 sm:w-auto"
        >
          {btcRanges.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={range === id}
              onClick={() => selectRange(id)}
              className={cn(
                "focus-visible:ring-ring min-h-9 flex-1 rounded-md px-3 text-xs focus-visible:ring-2 focus-visible:outline-none sm:flex-none",
                range === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {ranges[id]}
            </button>
          ))}
        </div>
      </div>
      {series && chart ? (
        <>
          <p className="font-heading mt-3 text-[clamp(2.4rem,8vw,4.5rem)] leading-none font-semibold tabular-nums">
            {formatMoney.format(series.price)}
            <span className="text-muted-foreground ms-3 text-lg font-medium sm:text-2xl">{unit}</span>
          </p>
          <p className="text-muted-foreground mt-3 text-sm tabular-nums">
            {formatChange.format(series.changePercent)}
            {locale === "fa" ? "٪" : "%"} {ranges[range]}
          </p>
          <div className="mt-6" dir="ltr">
            <div className="grid grid-cols-[minmax(0,1fr)_5.75rem] gap-2">
              <div
                className="relative h-56 w-full touch-pan-y sm:h-72"
                onPointerDown={readRatio}
                onPointerMove={readRatio}
                onPointerLeave={() => setRatio(null)}
                onPointerCancel={() => setRatio(null)}
              >
                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  preserveAspectRatio="none"
                  className="h-full w-full overflow-visible"
                  role="img"
                  aria-label={`${title} ${formatMoney.format(series.price)} ${unit}`}
                >
                  <path d={chart.area} fill="var(--primary)" opacity="0.14" />
                  <path
                    d={chart.line}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="bg-primary/50 pointer-events-none absolute inset-x-0 h-px -translate-y-1/2 transition-[top] duration-500 ease-out motion-reduce:transition-none"
                  style={{ top: liveTop }}
                />
                <span
                  className="bg-primary ring-background pointer-events-none absolute end-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full ring-2 transition-[top] duration-500 ease-out motion-reduce:transition-none"
                  style={{ top: liveTop }}
                />
                <span
                  className="bg-background/85 text-muted-foreground pointer-events-none absolute start-0 -translate-y-1/2 px-1 text-[11px] tabular-nums"
                  style={{ top: `${((chart.coords.find((coord) => coord.p === chart.max)?.y ?? PAD_Y) / VB_H) * 100}%` }}
                >
                  {highLabel} {formatMoney.format(chart.max)}
                </span>
                <span
                  className="bg-background/85 text-muted-foreground pointer-events-none absolute start-0 -translate-y-1/2 px-1 text-[11px] tabular-nums"
                  style={{ top: `${((chart.coords.find((coord) => coord.p === chart.min)?.y ?? VB_H - PAD_Y) / VB_H) * 100}%` }}
                >
                  {lowLabel} {formatMoney.format(chart.min)}
                </span>
                {inspected ? (
                  <>
                    <span
                      className="bg-foreground/35 pointer-events-none absolute inset-y-0 w-px"
                      style={{ left: `${(inspected.x / VB_W) * 100}%` }}
                    />
                    <span
                      className="bg-background border-border pointer-events-none absolute z-10 border px-2 py-1 text-xs tabular-nums"
                      style={{
                        left: `${Math.min(68, Math.max(0, (inspected.x / VB_W) * 100))}%`,
                        top: 0,
                      }}
                    >
                      <span className="block font-medium">{formatMoney.format(inspected.p)}</span>
                      <span className="text-muted-foreground block">{formatClock.format(inspected.t * 1000)}</span>
                    </span>
                  </>
                ) : null}
              </div>
              <div className="relative h-56 sm:h-72">
                <span
                  className="bg-primary text-primary-foreground pointer-events-none absolute inset-x-0 -translate-y-1/2 px-1.5 py-0.5 text-end text-[11px] tabular-nums transition-[top] duration-500 ease-out motion-reduce:transition-none"
                  style={{ top: liveTop }}
                >
                  {formatMoney.format(series.price)}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground mt-2 grid grid-cols-3 text-[11px] tabular-nums">
              <span>{formatAxis.format(chart.first.t * 1000)}</span>
              <span className="text-center">{formatAxis.format(chart.middle.t * 1000)}</span>
              <span className="text-end">{formatAxis.format(chart.last.t * 1000)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground mt-3 text-base">{unavailable}</p>
      )}
    </section>
  )
}
