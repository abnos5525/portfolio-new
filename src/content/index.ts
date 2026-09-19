import type { Locale, LocalizedString } from "./types"

export function t(value: LocalizedString, locale: Locale = "fa") {
  return value[locale]
}

export { site } from "./site"
export { projects, getFeaturedProjects, getProjectById } from "./projects"
export { skills, skillLevelLabel, getCoreSkills } from "./skills"
export { experience } from "./experience"
export { education } from "./education"
export { socials } from "./socials"
export { navigation } from "./navigation"
export type {
  Education,
  Experience,
  Locale,
  LocalizedString,
  NavItem,
  Project,
  ProjectStatus,
  SiteContent,
  Skill,
  SkillCategory,
  SkillLevel,
  SocialLink,
} from "./types"
