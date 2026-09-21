"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"

import type { Experience, Locale } from "@/content"
import { t } from "@/content"
import { cn } from "@/lib/utils"

type Props = {
  locale: Locale
  title: string
  currentLabel: string
  items: Experience[]
}

function yearFromStart(start: string, locale: Locale) {
  if (locale === "fa") {
    return start.match(/[۰-۹]{4}/)?.[0] ?? start
  }
  return start.match(/\d{4}/)?.[0] ?? start
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
  const touchX = useRef<number | null>(null)
  const active = items[index]
  const rtl = locale === "fa"

  const go = useCallback(
    (next: number) => {
      if (!items.length) return
      setIndex((next + items.length) % items.length)
    },
    [items.length]
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === "ArrowRight") go(index + (rtl ? 1 : -1))
      if (event.key === "ArrowLeft") go(index + (rtl ? -1 : 1))
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, index, rtl])

  if (!active) return null

  const activeYear = yearFromStart(t(active.start, locale), locale)

  return (
    <section
      id="experience"
      className="scroll-mt-24 mx-auto mt-16 w-full max-w-6xl px-4 sm:mt-24 sm:px-6 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between gap-4">
        <h2
          id={labelId}
          className="font-heading text-2xl font-semibold tracking-tight sm:text-5xl"
        >
          {title}
        </h2>
        <p className="text-muted-foreground hidden font-mono text-xs tabular-nums sm:block">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </p>
      </div>

      <div
        aria-hidden
        className="bg-primary/25 mt-5 h-px w-full overflow-hidden"
      >
        <div
          className="bg-primary h-px origin-start transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scaleX(${(index + 1) / items.length})` }}
        />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-6">
        <nav
          aria-labelledby={labelId}
          className="-mx-4 lg:col-span-4 lg:mx-0 lg:sticky lg:top-24"
        >
          <ol
            role="tablist"
            className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:items-start lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {items.map((item, i) => {
              const selected = i === index
              const year = yearFromStart(t(item.start, locale), locale)

              return (
                <li key={item.id} className="shrink-0 snap-center lg:w-full">
                  <button
                    id={`experience-tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`experience-panel-${item.id}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "font-heading block min-h-14 min-w-[7.5rem] rounded-xl px-2 py-1 text-start leading-none transition-[color,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-0 lg:px-0",
                      selected
                        ? "text-foreground scale-100"
                        : "text-foreground/22 hover:text-foreground/55"
                    )}
                  >
                    <span
                      className={cn(
                        "block font-extrabold tabular-nums",
                        selected
                          ? "text-[clamp(3.4rem,16vw,5.5rem)] lg:text-[clamp(4.4rem,7vw,7.5rem)]"
                          : "text-[clamp(2.1rem,10vw,3.2rem)] lg:text-[2.35rem]"
                      )}
                    >
                      {year}
                    </span>
                    {selected ? (
                      <span className="text-primary mt-2 block text-sm font-medium">
                        {t(item.company, locale)}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        <article
          id={`experience-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`experience-tab-${active.id}`}
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            if (touchX.current == null) return
            const currentX = event.changedTouches[0]?.clientX
            if (currentX == null) return
            const delta = currentX - touchX.current
            touchX.current = null
            if (Math.abs(delta) < 56) return
            if (rtl) go(index + (delta > 0 ? 1 : -1))
            else go(index + (delta < 0 ? 1 : -1))
          }}
          className="relative min-h-[22rem] overflow-hidden lg:col-span-8 lg:min-h-[28rem]"
        >
          <span
            aria-hidden
            className="font-heading text-foreground/6 pointer-events-none absolute -top-6 end-0 select-none text-[clamp(6rem,28vw,14rem)] leading-none font-extrabold tabular-nums"
          >
            {activeYear}
          </span>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                {t(active.start, locale)}
                <span className="mx-1.5 opacity-40">—</span>
                {t(active.end, locale)}
              </p>
              {active.current ? (
                <span className="text-primary inline-flex items-center gap-1.5 text-xs font-medium">
                  <span className="bg-primary size-1.5 rounded-full motion-safe:animate-pulse" />
                  {currentLabel}
                </span>
              ) : null}
            </div>

            <h3 className="font-heading mt-5 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {t(active.role, locale)}
            </h3>
            <p className="text-primary mt-3 text-lg font-medium sm:text-2xl">
              {t(active.company, locale)}
            </p>

            <ol className="mt-8 divide-y divide-primary/15 border-y border-primary/15">
              {active.projects.map((project, projectIndex) => (
                <li
                  key={`${active.id}-${project.name.en}`}
                  className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 py-4 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline"
                >
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {String(projectIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold sm:text-base">
                    {t(project.name, locale)}
                  </p>
                  <p className="text-muted-foreground col-start-2 text-xs leading-6 sm:col-start-3 sm:max-w-xs sm:text-end">
                    {project.stack.join(" · ")}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </div>
    </section>
  )
}
