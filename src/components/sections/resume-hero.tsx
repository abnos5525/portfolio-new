"use client"

import { ArrowDownIcon, MapPinIcon } from "lucide-react"

import { FadeRise, MonumentName } from "@/components/motion/kinetic"
import { MagneticLink } from "@/components/motion/magnetic-link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Contact = {
  id: string
  label: string
  href: string
}

type Props = {
  name: string
  role: string
  headline: string
  about: string
  location: string
  available: boolean
  resumePath: string
  contacts: Contact[]
  labels: {
    contact: string
    available: string
    dossier: string
    downloadPdf: string
    scrollCareer: string
  }
}

export function ResumeHero({
  name,
  role,
  headline,
  about,
  location,
  available,
  resumePath,
  contacts,
  labels,
}: Props) {
  return (
    <header className="relative flex flex-col pt-12 pb-12 sm:pt-20 sm:pb-16">
      <FadeRise delay={0.02} className="flex flex-wrap items-center gap-2">
        <p className="text-primary text-xs font-medium tracking-wide">{labels.dossier}</p>
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

      <FadeRise delay={0.06} className="mt-3">
        <p className="text-foreground/75 text-sm font-medium sm:text-base">{role}</p>
      </FadeRise>

      <div className="mt-4 overflow-visible py-2 sm:mt-6 sm:py-4">
        <MonumentName
          text={name}
          className="font-heading w-full max-w-none text-[clamp(2.6rem,12vw,7.5rem)] font-extrabold leading-[1.16] sm:text-[clamp(3.2rem,8.5vw,8rem)]"
        />
      </div>

      <FadeRise delay={0.18} className="mt-6 max-w-2xl space-y-4">
        <p className="text-muted-foreground text-lg leading-8 text-pretty sm:text-2xl sm:leading-10">
          {headline}
        </p>
        <p className="text-foreground/80 max-w-xl text-base leading-8 text-pretty sm:text-lg sm:leading-9">
          {about}
        </p>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPinIcon className="size-4 shrink-0 opacity-70" aria-hidden />
          {location}
        </p>
        {contacts.length > 0 ? (
          <nav aria-label={labels.contact} className="resume-contact-nav">
            <ul className="resume-contact flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-foreground/85 hover:text-primary inline-flex min-h-11 items-center underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </FadeRise>

      <FadeRise delay={0.28} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap print:hidden">
        <a
          href="#career"
          className={cn(
            buttonVariants({ size: "lg" }),
            "min-h-12 w-full justify-center sm:w-auto"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {labels.scrollCareer}
            <ArrowDownIcon className="size-4" aria-hidden />
          </span>
        </a>
        <MagneticLink
          href={resumePath}
          download
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "min-h-12 w-full justify-center sm:w-auto"
          )}
        >
          {labels.downloadPdf}
        </MagneticLink>
      </FadeRise>
    </header>
  )
}
