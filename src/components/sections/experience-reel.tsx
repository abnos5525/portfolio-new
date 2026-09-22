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
  return (
    <section
      id="experience"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <h2 className="font-heading text-2xl font-semibold sm:text-5xl">{title}</h2>

      <ol className="mt-8 sm:mt-12">
        {items.map((item, index) => {
          const year = yearFromStart(t(item.start, locale), locale)

          return (
            <li key={item.id} className="border-border border-t">
              <article
                className={cn(
                  "px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-14",
                  item.current && "bg-primary/[0.06]"
                )}
              >
                <div className="flex items-start justify-between gap-6 lg:sticky lg:top-28 lg:col-span-5 lg:block lg:self-start">
                  <div className="min-w-0">
                    <p className="text-muted-foreground font-mono text-xs tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-heading mt-2 text-[clamp(1.75rem,6vw,3rem)] leading-[1.2] font-semibold text-balance">
                      {t(item.company, locale)}
                    </h3>
                    <p className="text-primary mt-2 text-sm font-medium sm:text-base">
                      {t(item.role, locale)}
                    </p>
                  </div>
                  <p className="font-heading shrink-0 text-[clamp(2.25rem,9vw,3.25rem)] leading-none font-extrabold tabular-nums lg:mt-5 lg:text-[clamp(3.5rem,5vw,5.5rem)]">
                    {year}
                  </p>
                </div>

                <div className="mt-8 min-w-0 lg:col-span-7 lg:mt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-muted-foreground font-mono text-xs tabular-nums">
                      {t(item.start, locale)}
                      <span className="mx-1.5 opacity-40">—</span>
                      {t(item.end, locale)}
                    </p>
                    {item.current ? (
                      <p className="text-primary inline-flex items-center gap-1.5 text-xs font-medium">
                        <span className="bg-primary size-1.5 rounded-full" aria-hidden />
                        {currentLabel}
                      </p>
                    ) : null}
                  </div>

                  <ol className="border-border divide-border mt-6 divide-y border-y">
                    {item.projects.map((project, projectIndex) => (
                      <li
                        key={`${item.id}-${project.name.en}`}
                        className="grid grid-cols-[2rem_1fr] gap-x-4 gap-y-1.5 py-4 sm:grid-cols-[2.5rem_1fr_auto] sm:items-baseline sm:gap-x-5 sm:py-5"
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
            </li>
          )
        })}
      </ol>
    </section>
  )
}
