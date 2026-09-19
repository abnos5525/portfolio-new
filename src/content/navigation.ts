import type { NavItem } from "./types"

export const navigation: NavItem[] = [
  { id: "home", href: "/", label: { fa: "صفحه اصلی", en: "Home" } },
  { id: "about", href: "/#about", label: { fa: "درباره من", en: "About" } },
  { id: "skills", href: "/#skills", label: { fa: "مهارت‌ها", en: "Skills" } },
  {
    id: "projects",
    href: "/#projects",
    label: { fa: "پروژه‌ها", en: "Projects" },
  },
]
