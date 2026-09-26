import type { Education, Experience, Locale, Skill, SkillCategory } from "@/content"
import { skillLevelLabel, t } from "@/content"
import { ScrollReveal } from "@/components/motion/kinetic"
import { cn } from "@/lib/utils"

import { ResumeHero } from "./resume-hero"

type Labels = {
  dossier: string
  contact: string
  available: string
  downloadPdf: string
  scrollCareer: string
  career: string
  current: string
  education: string
  skills: string
  skillsSupport: string
  categories: Record<SkillCategory, string>
  printHint: string
}

type Props = {
  locale: Locale
  name: string
  role: string
  headline: string
  about: string
  location: string
  available: boolean
  resumePath: string
  contacts: { id: string; label: string; href: string }[]
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  labels: Labels
}

function chapterMark(item: Experience, locale: Locale) {
  const end = t(item.end, locale)
  if (item.current) return end
  const year = locale === "fa" ? /[۰-۹]{4}/ : /\d{4}/
  return end.match(year)?.[0] ?? end
}

const CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "data",
  "devops",
  "other",
]

export function ResumeDossier({
  locale,
  name,
  role,
  headline,
  about,
  location,
  available,
  resumePath,
  contacts,
  experience,
  education,
  skills,
  labels,
}: Props) {
  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="resume-dossier page-gutter relative mx-auto w-full max-w-6xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] overflow-hidden"
      >
        <div className="engineering-grid absolute inset-0 opacity-40" />
        <div className="from-primary/12 via-transparent to-transparent absolute inset-0 bg-gradient-to-b" />
      </div>

      <ResumeHero
        name={name}
        role={role}
        headline={headline}
        about={about}
        location={location}
        available={available}
        resumePath={resumePath}
        contacts={contacts}
        labels={{
          contact: labels.contact,
          dossier: labels.dossier,
          available: labels.available,
          downloadPdf: labels.downloadPdf,
          scrollCareer: labels.scrollCareer,
        }}
      />

      <section
        id="career"
        className="scroll-mt-24 border-border border-t pt-14 sm:pt-20 md:scroll-mt-28"
      >
        <ScrollReveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-heading text-[clamp(1.75rem,5vw,3rem)] font-semibold">
              {labels.career}
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-6">
              {labels.printHint}
            </p>
          </div>
        </ScrollReveal>

        <ol className="mt-10">
          {experience.map((item, index) => {
            const mark = chapterMark(item, locale)

            return (
              <li key={item.id} className="relative">
                <div
                  aria-hidden
                  className="bg-border absolute inset-y-0 start-[0.55rem] w-px sm:start-[0.7rem]"
                />
                <ScrollReveal delay={Math.min(index * 0.06, 0.18)}>
                  <article
                    className={cn(
                      "relative grid gap-6 pb-12 ps-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-10 sm:ps-12 sm:pb-16",
                      item.current &&
                        "rounded-2xl bg-primary/[0.06] -ms-2 ps-10 sm:-ms-3 sm:ps-14"
                    )}
                  >
                    <div className="relative">
                      <span
                        aria-hidden
                        className={cn(
                          "border-background absolute start-[-1.55rem] top-2 size-3 rounded-full border-2 sm:start-[-1.85rem]",
                          item.current
                            ? "bg-primary shadow-[0_0_0_4px] shadow-primary/25"
                            : "bg-muted-foreground/50"
                        )}
                      />
                      <p className="text-muted-foreground font-mono text-[0.65rem] tracking-wider tabular-nums uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p
                        className={cn(
                          "font-heading mt-2 text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-extrabold tabular-nums",
                          item.current && "text-primary"
                        )}
                      >
                        {mark}
                      </p>
                      <h3 className="font-heading mt-4 text-2xl font-semibold text-balance sm:text-3xl">
                        {t(item.company, locale)}
                      </h3>
                      <p className="text-primary mt-1.5 text-sm font-medium sm:text-base">
                        {t(item.role, locale)}
                      </p>
                      <p className="text-muted-foreground mt-3 font-mono text-xs tabular-nums">
                        {t(item.start, locale)}
                        <span className="mx-1.5 opacity-40">—</span>
                        {t(item.end, locale)}
                        {item.current ? (
                          <span className="text-primary ms-2 font-sans text-xs font-medium">
                            {labels.current}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <ul className="border-border divide-border divide-y border-y">
                      {item.projects.map((project) => (
                        <li
                          key={`${item.id}-${project.name.en}`}
                          className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                        >
                          <p className="text-foreground/90 text-sm font-medium sm:text-base">
                            {t(project.name, locale)}
                          </p>
                          <p className="text-muted-foreground text-xs leading-5 sm:max-w-[55%] sm:text-end">
                            {project.stack.join(" · ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </ScrollReveal>
              </li>
            )
          })}
        </ol>
      </section>

      <section
        id="education"
        className="scroll-mt-24 border-border border-t py-14 sm:py-20 md:scroll-mt-28"
      >
        <ScrollReveal>
          <h2 className="font-heading text-[clamp(1.5rem,4vw,2.25rem)] font-semibold">
            {labels.education}
          </h2>
          <ul className="mt-8 space-y-6">
            {education.map((item) => (
              <li
                key={item.id}
                className="grid gap-1 sm:grid-cols-[minmax(0,1.4fr)_auto] sm:items-baseline sm:gap-8"
              >
                <div>
                  <p className="font-heading text-lg font-semibold sm:text-xl">
                    {t(item.degree, locale)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {t(item.school, locale)}
                  </p>
                </div>
                <p className="text-muted-foreground font-mono text-xs tabular-nums sm:text-end">
                  {t(item.start, locale)}
                  <span className="mx-1.5 opacity-40">—</span>
                  {t(item.end, locale)}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      <section
        id="skills"
        className="scroll-mt-24 border-border border-t py-14 sm:py-20 md:scroll-mt-28"
      >
        <ScrollReveal>
          <h2 className="font-heading text-[clamp(1.5rem,4vw,2.25rem)] font-semibold">
            {labels.skills}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-6">
            {labels.skillsSupport}
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory.map(({ category, items }) => (
              <div key={category}>
                <p className="text-primary text-xs font-medium">
                  {labels.categories[category]}
                </p>
                <ul className="border-border mt-3 space-y-2 border-t pt-3">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="text-foreground/90 flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground font-mono text-[0.65rem] tracking-wide">
                        {t(skillLevelLabel[skill.level], locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-border flex flex-col gap-4 border-t py-12 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <p className="font-heading text-lg font-semibold sm:text-xl">{name}</p>
        <a
          href={resumePath}
          download
          className="text-primary inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
        >
          {labels.downloadPdf}
        </a>
      </footer>
    </div>
  )
}
