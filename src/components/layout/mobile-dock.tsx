"use client"

import { BriefcaseIcon, FileDownIcon, LayersIcon, UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { site } from "@/content"
import { cn } from "@/lib/utils"

const items = [
  { href: "#about", icon: UserIcon, key: "about" as const },
  { href: "#experience", icon: BriefcaseIcon, key: "experience" as const },
  { href: "#skills", icon: LayersIcon, key: "skills" as const },
] as const

export function MobileDock() {
  const translate = useTranslations("Dock")

  return (
    <nav
      aria-label={translate("label")}
      className="border-border/60 bg-background/85 pb-[max(0.5rem,env(safe-area-inset-bottom))] fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-[var(--page-gutter)] rounded-2xl border px-2 pt-2 backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              className={cn(
                "text-muted-foreground hover:text-primary flex min-h-12 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl text-[0.65rem] font-medium"
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {translate(item.key)}
            </a>
          </li>
        ))}
        <li>
          <a
            href={site.resumePath}
            download
            className="text-muted-foreground hover:text-primary flex min-h-12 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl text-[0.65rem] font-medium"
          >
            <FileDownIcon className="size-4" aria-hidden />
            {translate("resume")}
          </a>
        </li>
      </ul>
    </nav>
  )
}
