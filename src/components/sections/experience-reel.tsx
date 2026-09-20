"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

import { Badge } from "@/components/ui/badge"
import type { Experience, Locale } from "@/content"
import { t } from "@/content"

gsap.registerPlugin(ScrollTrigger)

type Props = {
  locale: Locale
  title: string
  support: string
  items: Experience[]
}

/** Award-style stacked pin: each role holds, then the next covers it. */
export function ExperienceReel({ locale, title, support, items }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const desktop = window.matchMedia("(min-width: 768px)").matches
    if (reduce || !desktop) return

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-exp-card]")
    )
    if (cards.length < 2) return

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const next = cards[index + 1]
        if (!next) return

        ScrollTrigger.create({
          trigger: card,
          start: "top 18%",
          endTrigger: next,
          end: "top 18%",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        })

        gsap.to(card, {
          scale: 0.94,
          filter: "brightness(0.72)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 90%",
            end: "top 18%",
            scrub: true,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={rootRef}
      className="scroll-mt-28 mx-auto mt-24 w-full max-w-6xl px-4 sm:mt-32 sm:px-6"
    >
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty">
        {support}
      </p>

      <div className="mt-12 flex flex-col gap-8 pb-8 md:gap-10">
        {items.map((role, index) => (
          <article
            key={role.id}
            data-exp-card
            className="border-border/50 bg-card/80 origin-top rounded-3xl border p-6 shadow-[0_24px_80px_-40px_oklch(0_0_0_/_45%)] backdrop-blur-md sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="text-primary font-mono text-xs tracking-[0.22em]">
                {String(index + 1).padStart(2, "0")}
                <span className="text-muted-foreground">
                  {" "}
                  / {String(items.length).padStart(2, "0")}
                </span>
              </span>
              <p className="text-muted-foreground font-mono text-xs tabular-nums sm:text-sm">
                {t(role.start, locale)}
                <span className="mx-1.5 opacity-50">—</span>
                {t(role.end, locale)}
              </p>
            </div>

            <h3 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {t(role.role, locale)}
            </h3>
            <p className="text-primary mt-3 text-base font-medium sm:text-lg">
              {t(role.company, locale)}
            </p>

            <ul className="mt-8 flex flex-col gap-6">
              {role.projects.map((project) => (
                <li
                  key={`${role.id}-${project.name.en}`}
                  className="flex flex-col gap-3"
                >
                  <p className="text-foreground/90 text-sm font-medium sm:text-base">
                    {t(project.name, locale)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[0.7rem]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
