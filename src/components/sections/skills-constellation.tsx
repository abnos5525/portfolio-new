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
    <section id="skills" className="border-border bg-card/50 scroll-mt-24 mt-20 border-y md:scroll-mt-28">
      <div className="page-gutter mx-auto w-full max-w-6xl py-12 sm:py-16">
        <h2 className="font-heading text-2xl font-semibold sm:text-5xl">{title}</h2>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7 text-pretty sm:text-base">
          {support}
        </p>

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
                    className="border-border bg-background/70 rounded-md border px-2.5 py-1 text-sm"
                  >
                    {skill.name}
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
