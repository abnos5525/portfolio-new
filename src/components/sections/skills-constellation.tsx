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

        <ol className="mt-8 sm:mt-12">
          {grouped.map((group, index) => (
            <li
              key={group.category}
              className="border-border grid gap-3 border-t py-5 sm:grid-cols-[4.5rem_11rem_1fr] sm:items-start sm:gap-6 sm:py-6"
            >
              <span className="font-heading text-foreground/25 text-3xl leading-none font-extrabold tabular-nums sm:text-4xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-primary text-sm font-medium sm:pt-1">
                {categoryLabels[group.category]}
              </h3>
              <ul className="flex flex-col">
                {group.items.map((skill) => (
                  <li
                    key={skill.id}
                    className="border-border/70 border-b py-2 text-sm last:border-b-0 sm:text-[0.95rem]"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
