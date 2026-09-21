"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("LocaleSwitch")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="bg-background/70 flex items-center gap-1 rounded-lg border p-1 backdrop-blur-sm"
    >
      {routing.locales.map((item) => {
        const label = item === "fa" ? t("fa") : t("en")
        const sharedClass = cn(
          buttonVariants({
            size: "sm",
            variant: item === locale ? "secondary" : "ghost",
          }),
          "min-w-10 px-2.5"
        )

        if (!mounted) {
          return (
            <span key={item} aria-hidden className={sharedClass}>
              {label}
            </span>
          )
        }

        return (
          <Link key={item} href={pathname} locale={item} className={sharedClass}>
            {label}
          </Link>
        )
      })}
    </div>
  )
}
