import type { NavItem } from "./types"

export const navigation: NavItem[] = [
  { id: "about", href: "/#about", label: { fa: "درباره من", en: "About" } },
  {
    id: "experience",
    href: "/#experience",
    label: { fa: "مسیر حرفه‌ای", en: "Career" },
  },
  { id: "skills", href: "/#skills", label: { fa: "تخصص‌ها", en: "Skills" } },
  { id: "education", href: "/#education", label: { fa: "تحصیلات", en: "Education" } },
]
