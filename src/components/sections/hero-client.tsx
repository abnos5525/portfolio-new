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
    <section className="relative flex min-h-[100svh] flex-col justify-center py-6 sm:min-h-[calc(100dvh-4rem)] sm:py-12">
      <FadeRise delay={0.04} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-foreground/80 text-sm font-medium">{role}</p>
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
        </div>
      </FadeRise>

      <div className="mt-4 overflow-visible py-3 sm:mt-6 sm:py-5">
        <MonumentName
          text={name}
          className="font-heading w-full max-w-none text-[clamp(2.75rem,13vw,8rem)] font-extrabold leading-[1.18] sm:text-[clamp(3.4rem,9vw,8.75rem)]"
        />
      </div>

      <OrbitStack className="mt-6 w-full max-w-[18rem] self-center sm:max-w-[22rem] lg:absolute lg:end-0 lg:top-1/2 lg:mt-0 lg:max-w-[24rem] lg:-translate-y-1/2 lg:self-auto" />

      <FadeRise delay={0.22} className="mt-8 flex max-w-xl flex-col gap-5">
        <p className="text-muted-foreground text-base leading-7 text-pretty sm:text-xl sm:leading-9">
          {headline}
        </p>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPinIcon className="size-4 shrink-0 opacity-70" aria-hidden />
          {location}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <MagneticLink
            href="#experience"
            className={cn(buttonVariants({ size: "lg" }), "min-h-12 w-full justify-center sm:w-auto")}
          >
            <span className="inline-flex items-center gap-2">
              {labels.viewExperience}
              <ArrowLeftIcon className="size-4 rtl:rotate-180" aria-hidden />
            </span>
          </MagneticLink>
          <MagneticLink
            href={resumePath}
            download
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "min-h-12 w-full justify-center sm:w-auto"
            )}
          >
            {labels.downloadResume}
          </MagneticLink>
        </div>
      </FadeRise>
    </section>
  )
}
