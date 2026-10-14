import {
  skillLevelLabel,
  t,
  type Locale,
  type Skill,
  type SkillCategory,
  type SkillLevel,
} from "@/content"
import { cn } from "@/lib/utils"

const CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "data",
  "devops",
  "other",
]

const LEVEL_ORDER: SkillLevel[] = ["advanced", "intermediate", "beginner"]

const LEVEL_STEPS: Record<SkillLevel, number> = {
  advanced: 3,
  intermediate: 2,
  beginner: 1,
}

type Props = {
  locale: Locale
  title: string
  support: string
  skills: Skill[]
  categoryLabels: Record<SkillCategory, string>
}

function LevelMeter({ level }: { level: SkillLevel }) {
  const steps = LEVEL_STEPS[level]
  return (
    <span aria-hidden className="flex items-end gap-0.5">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={cn(
            "w-1 rounded-full",
            step === 1 ? "h-1.5" : step === 2 ? "h-2.5" : "h-3.5",
            step <= steps ? "bg-primary" : "bg-muted-foreground/25"
          )}
        />
      ))}
    </span>
  )
}

export function SkillsConstellation({
  locale,
  title,
  support,
  skills,
  categoryLabels,
}: Props) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills
      .filter((skill) => skill.category === category)
      .sort(
        (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
      ),
  })).filter((group) => group.items.length > 0)

  return (
    <section id="skills" className="border-border bg-card/50 scroll-mt-24 mt-20 border-y md:scroll-mt-28">
      <div className="page-gutter mx-auto w-full max-w-6xl py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-5xl">{title}</h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7 text-pretty sm:text-base">
              {support}
            </p>
          </div>
          <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {LEVEL_ORDER.map((level) => (
              <li key={level} className="flex items-center gap-1.5">
                <LevelMeter level={level} />
                {t(skillLevelLabel[level], locale)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-6 sm:mt-10 sm:grid-cols-2">
          {grouped.map((group) => (
            <div key={group.category}>
              <h3 className="text-primary text-sm font-medium">
                {categoryLabels[group.category]}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill.id}
                    title={t(skillLevelLabel[skill.level], locale)}
                    className={cn(
                      "bg-background/70 flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm",
                      skill.level === "advanced"
                        ? "border-primary/40"
                        : "border-border"
                    )}
                  >
                    {skill.name}
                    <LevelMeter level={skill.level} />
                    <span className="sr-only">
                      {t(skillLevelLabel[skill.level], locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
