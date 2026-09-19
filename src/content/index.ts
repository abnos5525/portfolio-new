import type { Locale, LocalizedString } from "./types"

export function t(value: LocalizedString, locale: Locale = "fa") {
  return value[locale]
}

export { site } from "./site"
export { projects, getFeaturedProjects, getProjectById } from "./projects"
export { skills, skillLevelLabel } from "./skills"
export { socials } from "./socials"
export { navigation } from "./navigation"
export type {
  Locale,
  LocalizedString,
  NavItem,
  Project,
  ProjectStatus,
  SiteContent,
  Skill,
  SkillLevel,
  SocialLink,
} from "./types"
