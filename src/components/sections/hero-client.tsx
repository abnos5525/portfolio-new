"use client"

import { ArrowLeftIcon, MapPinIcon } from "lucide-react"

import { FadeRise, MonumentName } from "@/components/motion/kinetic"
import { MagneticLink } from "@/components/motion/magnetic-link"
import { OrbitStack } from "@/components/sections/orbit-stack"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden py-10 sm:py-14 lg:py-8">
      <FadeRise delay={0.04} className="flex flex-wrap items-center gap-3">
        <p className="text-primary text-sm font-medium tracking-[0.16em]">
          {role}
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

      <div className="relative mt-6 lg:mt-4">
        <MonumentName
          text={name}
          className="font-heading max-w-[18ch] text-[clamp(3.4rem,12vw,9.5rem)] font-extrabold tracking-tight text-balance leading-[0.88]"
        />
        <OrbitStack className="pointer-events-none absolute -end-8 top-1/2 hidden w-[min(42vw,26rem)] -translate-y-1/2 opacity-90 lg:block" />
      </div>

      <div className="mt-8 grid max-w-5xl gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:items-end">
        <FadeRise delay={0.28} className="flex max-w-xl flex-col gap-6">
          <p className="text-muted-foreground text-lg leading-8 text-pretty sm:text-xl sm:leading-9">
            {headline}
          </p>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPinIcon className="size-4 shrink-0 opacity-70" aria-hidden />
            {location}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticLink
              href="#experience"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <span className="inline-flex items-center gap-2">
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
          </div>
        </FadeRise>
      </div>
    </section>
  )
}
