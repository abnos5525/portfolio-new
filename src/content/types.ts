export type Locale = "fa" | "en"

export type LocalizedString = Record<Locale, string>

export type SocialLink = {
  id: string
  label: LocalizedString
  href: string
}

export type NavItem = {
  id: string
  href: string
  label: LocalizedString
}

export type SkillLevel = "core" | "proficient" | "familiar"

export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "data"
  | "other"

export type Skill = {
  id: string
  name: string
  icon?: string
  category: SkillCategory
  level: SkillLevel
  /** Project / role ids that prove this skill — no fake percentages */
  projectIds: string[]
}

export type ProjectStatus = "live" | "repo"

export type Project = {
  id: string
  title: LocalizedString
  summary: LocalizedString
  image: string
  stack: string[]
  status: ProjectStatus
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  year?: number
}

export type Experience = {
  id: string
  company: LocalizedString
  role: LocalizedString
  start: LocalizedString
  end: LocalizedString
  current?: boolean
  highlights: LocalizedString[]
  stack: string[]
}

export type Education = {
  id: string
  school: LocalizedString
  degree: LocalizedString
  start: LocalizedString
  end: LocalizedString
  current?: boolean
}

export type SiteContent = {
  name: LocalizedString
  role: LocalizedString
  headline: LocalizedString
  about: LocalizedString
  location: LocalizedString
  email?: string
  resumePath: string
  availability: "open" | "busy" | "selective"
  nowLearning: string[]
}
