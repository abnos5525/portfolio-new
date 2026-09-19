import type { NavItem } from "./types"

export const navigation: NavItem[] = [
  { id: "about", href: "/#about", label: { fa: "درباره", en: "About" } },
  {
    id: "experience",
    href: "/#experience",
    label: { fa: "سوابق", en: "Experience" },
  },
  { id: "skills", href: "/#skills", label: { fa: "مهارت‌ها", en: "Skills" } },
  {
    id: "projects",
    href: "/#projects",
    label: { fa: "پروژه‌ها", en: "Projects" },
  },
]
