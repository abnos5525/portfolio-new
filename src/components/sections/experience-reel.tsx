"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useCallback, useId, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { Experience, Locale } from "@/content"
import { t } from "@/content"
import { cn } from "@/lib/utils"

type Props = {
  locale: Locale
  title: string
  currentLabel: string
  items: Experience[]
}

export function ExperienceReel({
  locale,
  title,
  currentLabel,
  items,
}: Props) {
  const labelId = useId()
  const startIndex = Math.max(
    0,
    items.findIndex((item) => item.current)
  )
  const [index, setIndex] = useState(startIndex === -1 ? 0 : startIndex)
  const active = items[index]
  const rtl = locale === "fa"

  const go = useCallback(
    (next: number) => {
      if (!items.length) return
      setIndex((next + items.length) % items.length)
    },
    [items.length]
  )

  if (!active) return null

  const dir = rtl ? 1 : -1

  return (
    <section
      id="experience"
      className="scroll-mt-24 mx-auto mt-16 w-full max-w-6xl px-4 sm:mt-24 sm:px-6 md:scroll-mt-28"
    >
      <h2
        id={labelId}
        className="font-heading text-2xl font-semibold tracking-tight sm:text-5xl"
      >
        {title}
      </h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-primary/20 bg-card/65 p-4 sm:p-5">
            <ol
              role="tablist"
              aria-labelledby={labelId}
              className="relative space-y-3 before:bg-primary/18 before:absolute before:inset-y-3 before:start-[0.62rem] before:w-px before:content-['']"
            >
              {items.map((item, i) => {
                const selected = i === index
                const tabId = `experience-tab-${item.id}`
                const panelId = `experience-panel-${item.id}`

                return (
                  <li key={item.id} className="relative ps-7">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute start-0 top-1/2 size-3 -translate-y-1/2 rounded-full border",
                        selected
                          ? "border-primary bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_26%,transparent)]"
                          : "border-primary/35 bg-background"
                      )}
                    />
                    <button
                      id={tabId}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={panelId}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-3 text-start transition-colors",
                        selected
                          ? "border-primary/65 bg-primary/10"
                          : "border-primary/15 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-muted-foreground font-mono text-[0.66rem] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="text-muted-foreground font-mono text-[0.66rem] tabular-nums">
                          {t(item.start, locale)}
                        </p>
                      </div>
                      <p className="mt-1.5 text-sm font-semibold">
                        {t(item.company, locale)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {t(item.role, locale)}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="mt-4 hidden items-center justify-between gap-3 border-t border-primary/15 pt-4 lg:flex">
              <p className="text-muted-foreground font-mono text-[0.7rem] tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="prev"
                  onClick={() => go(index - dir)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "size-10 touch-manipulation"
                  )}
                >
                  <ChevronRightIcon className="size-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="next"
                  onClick={() => go(index + dir)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "size-10 touch-manipulation"
                  )}
                >
                  <ChevronLeftIcon className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <article
            id={`experience-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`experience-tab-${active.id}`}
            className="relative overflow-hidden rounded-3xl border border-primary/22 bg-card/80 p-5 shadow-[0_22px_90px_-55px_var(--primary)] sm:p-8"
          >
            <div
              aria-hidden
              className="from-primary/40 absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r via-transparent to-transparent"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              {active.current ? (
                <Badge className="px-2.5 py-0 text-[0.65rem]">{currentLabel}</Badge>
              ) : (
                <span />
              )}
              <p className="text-muted-foreground bg-background/80 rounded-full border px-3 py-1 font-mono text-xs tabular-nums">
                {t(active.start, locale)}
                <span className="mx-1.5 opacity-50">—</span>
                {t(active.end, locale)}
              </p>
            </div>

            <h3 className="font-heading mt-5 text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t(active.role, locale)}
            </h3>
            <p className="text-primary mt-2 text-base font-medium sm:text-xl">
              {t(active.company, locale)}
            </p>

            <ul className="mt-7 space-y-3 sm:mt-8">
              {active.projects.map((project, projectIndex) => (
                <li
                  key={`${active.id}-${project.name.en}`}
                  className="rounded-2xl border border-primary/15 bg-background/55 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold sm:text-[0.95rem]">
                      {t(project.name, locale)}
                    </p>
                    <p className="text-muted-foreground font-mono text-[0.66rem] tabular-nums">
                      {String(projectIndex + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[0.68rem]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <div className="mt-4 flex justify-end gap-2 lg:hidden">
            <button
              type="button"
              aria-label="prev"
              onClick={() => go(index - dir)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-11 touch-manipulation"
              )}
            >
              <ChevronRightIcon className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              aria-label="next"
              onClick={() => go(index + dir)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-11 touch-manipulation"
              )}
            >
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
