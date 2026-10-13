import { CareerGraphLive } from "@/components/sections/career-graph-live"
import { buildCareerGraph } from "@/content/career-graph"
import type { Locale } from "@/content"

type Props = {
  locale: Locale
  title: string
  support: string
  companyLegend: string
  skillLegend: string
  hint: string
}

export function CareerGraph({
  locale,
  title,
  support,
  companyLegend,
  skillLegend,
  hint,
}: Props) {
  const data = buildCareerGraph(locale)
  return (
    <CareerGraphLive
      data={data}
      title={title}
      support={support}
      companyLegend={companyLegend}
      skillLegend={skillLegend}
      hint={hint}
    />
  )
}
