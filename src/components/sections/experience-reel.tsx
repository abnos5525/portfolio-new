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
  tag: string
  items: Experience[]
}

export function ExperienceReel({ locale, title, tag, items }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const ctx = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>("[data-exp-card]")
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={rootRef}
      className="scroll-mt-28 mt-24 [perspective:1200px] sm:mt-28"
    >
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          {title}
        </h2>
        <span
          aria-hidden
          className="text-primary/40 font-mono text-[0.65rem] tracking-[0.2em]"
        >
          {tag}
        </span>
      </div>

      <ul className="flex flex-col gap-14 sm:gap-16">
        {items.map((role, roleIndex) => (
          <li
            key={role.id}
            data-exp-card
            className="border-border/40 relative border-s ps-6 sm:ps-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span
              aria-hidden
              className="bg-primary absolute top-2 -start-[5px] size-2.5 rounded-full shadow-[0_0_12px_var(--primary)]"
            />
            <span
              aria-hidden
              className="text-primary/25 absolute -top-1 end-0 font-mono text-4xl font-semibold tracking-tighter select-none sm:text-5xl"
            >
              {String(roleIndex + 1).padStart(2, "0")}
            </span>

            <header className="relative z-10 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <h3 className="font-heading text-xl font-semibold tracking-tight text-balance sm:text-2xl sm:leading-snug">
                  {t(role.role, locale)}
                </h3>
                <p className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums sm:pt-2 sm:text-sm">
                  {t(role.start, locale)}
                  <span className="mx-1.5 opacity-50">—</span>
                  {t(role.end, locale)}
                </p>
              </div>
              <p className="text-primary text-sm font-medium tracking-wide sm:text-base">
                {t(role.company, locale)}
              </p>
            </header>

            <ul className="relative z-10 mt-8 flex flex-col gap-7">
              {role.projects.map((project) => (
                <li
                  key={`${role.id}-${project.name.en}`}
                  className="flex flex-col gap-3"
                >
                  <p className="text-foreground/90 text-[0.95rem] font-medium sm:text-base">
                    {t(project.name, locale)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="font-mono text-[0.7rem]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
