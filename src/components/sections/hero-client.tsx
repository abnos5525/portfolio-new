"use client"

import { ArrowLeftIcon, MapPinIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { FadeRise, KineticText } from "@/components/motion/kinetic"
import { MagneticLink } from "@/components/motion/magnetic-link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stackRail = [
  "React",
  "Next.js",
  "NestJS",
  "Spring Boot",
  "TypeScript",
  "PostgreSQL",
] as const

type Props = {
  name: string
  role: string
  headline: string
  location: string
  resumePath: string
  available: boolean
  labels: {
    available: string
    viewExperience: string
    downloadResume: string
    runtime: string
    signal: string
    buildOk: string
  }
}

export function HeroClient({
  name,
  role,
  headline,
  location,
  resumePath,
  available,
  labels,
}: Props) {
  const reduce = useReducedMotion()
  const [clock, setClock] = useState("--:--:--")

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative grid min-h-[calc(100dvh-4rem)] items-center gap-10 overflow-hidden py-14 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div
        aria-hidden
        className="text-primary/25 pointer-events-none absolute -end-6 top-10 hidden font-mono text-[clamp(4rem,14vw,9rem)] leading-none font-semibold tracking-tighter select-none lg:block"
      >
        01
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col gap-5">
        <FadeRise delay={0.05} className="flex flex-wrap items-center gap-3">
          <p className="text-primary font-mono text-[0.7rem] tracking-[0.22em] uppercase sm:text-xs">
            {labels.runtime} · {clock}
          </p>
          {available ? (
            <Badge
              variant="outline"
              className="border-primary/45 text-primary gap-1.5 px-2.5 py-0.5"
            >
              <span
                aria-hidden
                className="bg-primary size-1.5 rounded-full motion-safe:animate-pulse"
              />
              {labels.available}
            </Badge>
          ) : null}
        </FadeRise>

        <FadeRise delay={0.12}>
          <p className="text-muted-foreground text-sm font-medium tracking-[0.14em] sm:text-base">
            {role}
          </p>
        </FadeRise>

        <KineticText
          text={name}
          delay={0.18}
          className="font-heading text-[clamp(2.6rem,9vw,5.5rem)] font-semibold tracking-tight text-balance leading-[0.95]"
        />

        <FadeRise delay={0.45}>
          <p className="text-muted-foreground max-w-xl text-lg leading-8 text-pretty sm:text-xl sm:leading-9">
            {headline}
          </p>
        </FadeRise>

        <FadeRise
          delay={0.55}
          className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <MapPinIcon className="size-4 shrink-0 opacity-70" aria-hidden />
            {location}
          </span>
          <span className="text-primary/70 font-mono text-[0.7rem] tracking-wider">
            {labels.signal} · 35.68N / 51.39E
          </span>
        </FadeRise>

        <FadeRise delay={0.65} className="flex flex-wrap items-center gap-3 pt-3">
          <MagneticLink
            href="#experience"
            className={cn(buttonVariants({ size: "lg" }), "relative overflow-hidden")}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {labels.viewExperience}
              <ArrowLeftIcon className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </MagneticLink>
          <MagneticLink
            href={resumePath}
            download
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {labels.downloadResume}
          </MagneticLink>
        </FadeRise>
      </div>

      <aside aria-hidden className="relative hidden min-h-[22rem] lg:block">
        <motion.div
          className="border-primary/30 absolute inset-y-4 start-0 w-px border-s border-dashed"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <ul className="flex h-full flex-col justify-center gap-5 ps-10">
          {stackRail.map((item, index) => (
            <motion.li
              key={item}
              className="group font-heading text-foreground/80 flex items-baseline gap-4 text-2xl tracking-tight xl:text-3xl"
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.5 + index * 0.07,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transform: reduce
                  ? undefined
                  : `translateX(calc(var(--pointer-nx, 0) * ${index * 2}px))`,
              }}
            >
              <span className="text-primary/55 w-8 font-mono text-[0.65rem] tabular-nums transition-colors group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                translate="no"
                className="transition-colors group-hover:text-primary"
              >
                {item}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="border-border/40 bg-background/20 absolute end-0 bottom-2 rounded-md border px-3 py-2 font-mono text-[0.65rem] tracking-wider backdrop-blur-sm">
          <span className="text-foreground/80">{labels.buildOk}</span>
        </div>
      </aside>
    </section>
  )
}
