"use client"

import { useEffect, useMemo, useState } from "react"

import type { Locale } from "@/content"
import { weatherLabel, type WeatherSnapshot } from "@/lib/weather"

type Props = {
  locale: Locale
  initial: WeatherSnapshot | null
  title: string
  liveLabel: string
  tempUnit: string
  humidityLabel: string
  windLabel: string
  windUnit: string
  dayLabel: string
  unavailable: string
  lowLabel: string
  highLabel: string
}

const VB_W = 1000
const VB_H = 240
const PAD_Y = 16

function formatTemp(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value)
}

function formatClock(locale: Locale, ts: number) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(ts * 1000)
}

export function TehranWeatherLive({
  locale,
  initial,
  title,
  liveLabel,
  tempUnit,
  humidityLabel,
  windLabel,
  windUnit,
  dayLabel,
  unavailable,
  lowLabel,
  highLabel,
}: Props) {
  const [weather, setWeather] = useState(initial)

  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const response = await fetch("/api/weather", { cache: "no-store" })
        if (!response.ok) return
        const data = (await response.json()) as WeatherSnapshot
        if (alive) setWeather(data)
      } catch (error) {
        console.error("Weather poll failed", error)
      }
    }
    const id = window.setInterval(() => void tick(), 60_000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  const chart = useMemo(() => {
    if (!weather || weather.points.length < 2) return null
    const temps = weather.points.map((point) => point.temp)
    const min = Math.min(...temps)
    const max = Math.max(...temps)
    const span = max - min || 1
    const lastIndex = weather.points.length - 1
    const innerH = VB_H - PAD_Y * 2
    const coords = weather.points.map((point, index) => {
      const x = (index / lastIndex) * VB_W
      const y = PAD_Y + (1 - (point.temp - min) / span) * innerH
      return { x, y, ...point }
    })
    const line = coords
      .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(2)},${coord.y.toFixed(2)}`)
      .join(" ")
    const first = coords[0]
    const mid = coords[Math.floor(lastIndex / 2)]
    const last = coords[lastIndex]
    if (!first || !mid || !last) return null
    const area = `${line} L${last.x.toFixed(2)},${VB_H - PAD_Y} L${first.x.toFixed(2)},${VB_H - PAD_Y} Z`
    return { min, max, line, area, first, mid, last }
  }, [weather])

  return (
    <section
      id="weather"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-medium">{title}</p>
        </div>
        <span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide uppercase">
          <span className="bg-primary size-1.5 animate-pulse rounded-full" aria-hidden />
          {liveLabel}
        </span>
      </div>

      {weather && chart ? (
        <>
          <p className="font-heading mt-5 text-[clamp(2.6rem,9vw,4.8rem)] leading-none font-semibold tabular-nums">
            {formatTemp(locale, weather.temp)}
            <span className="text-muted-foreground ms-3 text-lg font-medium sm:text-2xl">
              {tempUnit}
            </span>
          </p>
          <p className="text-primary mt-3 text-sm font-medium">
            {weatherLabel(weather.symbol, locale)}
          </p>
          <p className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm tabular-nums">
            <span>
              {humidityLabel} {formatTemp(locale, weather.humidity)}٪
            </span>
            <span>
              {windLabel} {formatTemp(locale, weather.wind)} {windUnit}
            </span>
          </p>

          <div className="mt-8" dir="ltr">
            <p className="text-muted-foreground mb-3 text-xs">{dayLabel}</p>
            <div className="relative h-48 w-full sm:h-60">
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
                role="img"
                aria-label={dayLabel}
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
              <span className="bg-background/85 text-muted-foreground pointer-events-none absolute start-0 top-2 px-1 text-[11px] tabular-nums">
                {highLabel} {formatTemp(locale, chart.max)}
                {tempUnit}
              </span>
              <span className="bg-background/85 text-muted-foreground pointer-events-none absolute start-0 bottom-2 px-1 text-[11px] tabular-nums">
                {lowLabel} {formatTemp(locale, chart.min)}
                {tempUnit}
              </span>
            </div>
            <div className="text-muted-foreground mt-2 grid grid-cols-3 text-[11px] tabular-nums">
              <span>{formatClock(locale, chart.first.t)}</span>
              <span className="text-center">{formatClock(locale, chart.mid.t)}</span>
              <span className="text-end">{formatClock(locale, chart.last.t)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground mt-6 text-base">{unavailable}</p>
      )}
    </section>
  )
}
