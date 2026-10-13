"use client"

import { useEffect, useMemo, useState } from "react"

import type { Locale } from "@/content"
import type { GithubPulse } from "@/lib/github-pulse"
import { cn } from "@/lib/utils"

type Props = {
  locale: Locale
  initial: GithubPulse | null
  title: string
  support: string
  weekLabel: string
  lastLabel: string
  unavailable: string
  liveLabel: string
  activityLabel: string
  languagesLabel: string
  latestLabel: string
}

const VB_W = 1000
const VB_H = 220
const PAD_Y = 18

function relativeAge(secondsAgo: number, locale: Locale) {
  const rtf = new Intl.RelativeTimeFormat(locale === "fa" ? "fa" : "en", {
    numeric: "auto",
  })
  const abs = Math.abs(secondsAgo)
  if (abs < 60) return rtf.format(-secondsAgo, "second")
  if (abs < 3600) return rtf.format(-Math.round(secondsAgo / 60), "minute")
  if (abs < 86_400) return rtf.format(-Math.round(secondsAgo / 3600), "hour")
  return rtf.format(-Math.round(secondsAgo / 86_400), "day")
}

function formatDay(ts: number, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    month: "short",
    day: "numeric",
  }).format(ts * 1000)
}

export function GithubPulseLive({
  locale,
  initial,
  title,
  support,
  weekLabel,
  lastLabel,
  unavailable,
  liveLabel,
  activityLabel,
  languagesLabel,
  latestLabel,
}: Props) {
  const [pulse, setPulse] = useState(initial)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(tick)
  }, [])

  useEffect(() => {
    let alive = true
    const refresh = async () => {
      try {
        const response = await fetch("/api/github-pulse", { cache: "no-store" })
        if (!response.ok) return
        const data = (await response.json()) as GithubPulse
        if (alive) setPulse(data)
      } catch (error) {
        console.error("GitHub pulse refresh failed", error)
      }
    }
    const id = window.setInterval(() => void refresh(), 60_000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  const chart = useMemo(() => {
    if (!pulse || pulse.points.length < 2) return null
    const max = Math.max(...pulse.points.map((point) => point.n), 1)
    const lastIndex = pulse.points.length - 1
    const innerH = VB_H - PAD_Y * 2
    const coords = pulse.points.map((point, index) => {
      const x = (index / lastIndex) * VB_W
      const y = PAD_Y + (1 - point.n / max) * innerH
      return { x, y, ...point }
    })
    const line = coords
      .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(2)},${coord.y.toFixed(2)}`)
      .join(" ")
    const first = coords[0]
    const last = coords[lastIndex]
    if (!first || !last) return null
    const area = `${line} L${last.x.toFixed(2)},${VB_H - PAD_Y} L${first.x.toFixed(2)},${VB_H - PAD_Y} Z`
    const mid = coords[Math.floor(lastIndex / 2)]
    return { coords, line, area, first, last, mid, max }
  }, [pulse])

  const ageLabel =
    pulse?.lastAt != null
      ? relativeAge(Math.floor(now / 1000) - pulse.lastAt, locale)
      : null

  const maxLang = pulse ? Math.max(...pulse.languages.map((item) => item.count), 1) : 1

  return (
    <section
      id="ship-pulse"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-medium">{title}</p>
          <p className="text-muted-foreground mt-2 text-sm leading-7 text-pretty sm:text-base">
            {support}
          </p>
        </div>
        <span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide uppercase">
          <span className="bg-primary size-1.5 animate-pulse rounded-full" aria-hidden />
          {liveLabel}
        </span>
      </div>

      {pulse ? (
        <>
          <div className="mt-6 grid gap-8 sm:mt-8 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs">{weekLabel}</p>
              <p className="font-heading mt-2 text-[clamp(2.6rem,9vw,4.8rem)] leading-none font-semibold tabular-nums">
                {pulse.weekCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{lastLabel}</p>
              <p className="font-heading mt-2 text-[clamp(1.8rem,6vw,3.2rem)] leading-none font-semibold text-balance">
                {ageLabel ?? "—"}
              </p>
              {pulse.latest ? (
                <p className="text-muted-foreground mt-3 text-sm">
                  <span className="text-foreground/80">{latestLabel}</span>{" "}
                  <a
                    href={pulse.latest.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {pulse.latest.repo}
                  </a>
                  <span className="text-muted-foreground"> · {pulse.latest.type}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8" dir="ltr">
            <p className="text-muted-foreground mb-3 text-xs">{activityLabel}</p>
            {chart ? (
              <>
                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  preserveAspectRatio="none"
                  className="h-44 w-full overflow-visible sm:h-56"
                  role="img"
                  aria-label={activityLabel}
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
                <div className="text-muted-foreground mt-2 grid grid-cols-3 text-[11px] tabular-nums">
                  <span>{formatDay(chart.first.t, locale)}</span>
                  <span className="text-center">
                    {chart.mid ? formatDay(chart.mid.t, locale) : ""}
                  </span>
                  <span className="text-end">{formatDay(chart.last.t, locale)}</span>
                </div>
              </>
            ) : null}
          </div>

          {pulse.languages.length > 0 ? (
            <div className="mt-8">
              <p className="text-muted-foreground text-xs">{languagesLabel}</p>
              <ul className="mt-4 space-y-3">
                {pulse.languages.map((item) => (
                  <li key={item.name} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="bg-border/60 relative h-1.5 overflow-hidden rounded-full">
                      <span
                        className={cn("bg-primary absolute inset-y-0 start-0 rounded-full")}
                        style={{ width: `${(item.count / maxLang) * 100}%` }}
                      />
                    </span>
                    <span className="text-muted-foreground text-end font-mono text-xs tabular-nums">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-muted-foreground mt-6 text-base">{unavailable}</p>
      )}
    </section>
  )
}
