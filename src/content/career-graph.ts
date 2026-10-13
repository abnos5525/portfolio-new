import { experience } from "./experience"
import { getAllSkills } from "./skills"
import type { Locale } from "./types"

export type GraphNodeKind = "company" | "skill"

export type GraphNode = {
  id: string
  kind: GraphNodeKind
  label: string
}

export type GraphEdge = {
  source: string
  target: string
}

export type CareerGraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/** Build a living map: companies ↔ skills proven on those chapters. */
export function buildCareerGraph(locale: Locale): CareerGraphData {
  const companies = experience.map((item) => ({
    id: `co:${item.id}`,
    kind: "company" as const,
    label: item.company[locale],
    expId: item.id,
  }))

  const companyIds = new Set(companies.map((item) => item.expId))

  const skills = getAllSkills()
    .filter(
      (skill) =>
        skill.level !== "familiar" &&
        skill.projectIds.some((id) => companyIds.has(id))
    )
    .map((skill) => ({
      id: `sk:${skill.id}`,
      kind: "skill" as const,
      label: skill.name,
      projectIds: skill.projectIds.filter((id) => companyIds.has(id)),
    }))

  const nodes: GraphNode[] = [
    ...companies.map(({ id, kind, label }) => ({ id, kind, label })),
    ...skills.map(({ id, kind, label }) => ({ id, kind, label })),
  ]

  const edges: GraphEdge[] = []
  for (const skill of skills) {
    for (const expId of skill.projectIds) {
      edges.push({ source: skill.id, target: `co:${expId}` })
    }
  }

  return { nodes, edges }
}
