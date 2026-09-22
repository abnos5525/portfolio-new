"use client"

import { useEffect, useState } from "react"

import { ClockSkeleton } from "@/components/sections/page-skeleton"
import type { Locale } from "@/content"

type Props = {
  locale: Locale
  label: string
  city: string
}

type ClockParts = {
  hour: string
  minute: string
  second: string
  date: string
}

function readTehran(now: Date, locale: Locale): ClockParts {
  const timeTag = locale === "fa" ? "fa-IR" : "en-GB"
  const time = new Intl.DateTimeFormat(timeTag, {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    time.find((part) => part.type === type)?.value ?? "––"

  const date = new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB",
    {
      timeZone: "Asia/Tehran",
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  ).format(now)

  return {
    hour: pick("hour"),
    minute: pick("minute"),
    second: pick("second"),
    date,
  }
}

export function IranClock({ locale, label, city }: Props) {
  const [parts, setParts] = useState<ClockParts | null>(null)

  useEffect(() => {
    const tick = () => setParts(readTehran(new Date(), locale))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [locale])

  if (!parts) {
    return (
      <section aria-label={label} aria-busy="true">
        <ClockSkeleton />
      </section>
    )
  }

  return (
    <section
      aria-label={label}
      className="border-border flex items-end justify-between gap-4 border-b pt-5 pb-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{city}</p>
        <p className="text-muted-foreground mt-1 min-h-5 text-xs">{parts.date}</p>
      </div>
      <p
        className="font-heading text-[clamp(2rem,8vw,3.25rem)] leading-none font-semibold tabular-nums"
        suppressHydrationWarning
      >
        <span>{parts.hour}</span>
        <span className="text-primary">:</span>
        <span>{parts.minute}</span>
        <span className="text-muted-foreground ms-1.5 align-baseline text-[0.42em] font-medium">
          {parts.second}
        </span>
      </p>
    </section>
  )
}
