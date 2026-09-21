import { Badge } from "@/components/ui/badge"
import type { Skill, SkillCategory } from "@/content"

const CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "data",
  "devops",
  "other",
]

type Props = {
  title: string
  support: string
  skills: Skill[]
  categoryLabels: Record<SkillCategory, string>
}

export function SkillsConstellation({
  title,
  support,
  skills,
  categoryLabels,
}: Props) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <section
      id="skills"
      className="scroll-mt-24 mx-auto mt-16 mb-8 w-full max-w-6xl px-4 sm:mt-32 sm:mb-32 sm:px-6 md:scroll-mt-28"
    >
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 text-pretty sm:mt-4 sm:text-base sm:leading-7">
        {support}
      </p>

      <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {grouped.map((group) => (
          <div
            key={group.category}
            className="border-primary/20 rounded-xl border p-4 sm:rounded-none sm:border-0 sm:border-t sm:p-0 sm:pt-5"
          >
            <h3 className="text-primary mb-3 text-xs font-medium tracking-[0.14em] uppercase sm:mb-4">
              {categoryLabels[group.category]}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li key={skill.id}>
                  <Badge variant="secondary" className="px-3 py-1.5 text-[0.75rem]">
                    {skill.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
