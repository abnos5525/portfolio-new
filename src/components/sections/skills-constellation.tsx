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
      className="scroll-mt-28 mx-auto mt-24 mb-28 w-full max-w-6xl px-4 sm:mt-32 sm:mb-32 sm:px-6"
    >
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty">
        {support}
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((group) => (
          <div
            key={group.category}
            className="border-border/40 border-t pt-5"
          >
            <h3 className="text-primary mb-4 text-xs font-medium tracking-[0.18em] uppercase">
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
