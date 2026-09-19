"use client"

import { useLocale, useTranslations } from "next-intl"

import { buttonVariants } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("LocaleSwitch")

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="bg-background/70 flex items-center gap-1 rounded-lg border p-1 backdrop-blur-sm"
    >
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={cn(
            buttonVariants({
              size: "sm",
              variant: item === locale ? "secondary" : "ghost",
            }),
            "min-w-10 px-2.5"
          )}
        >
          {item === "fa" ? t("fa") : t("en")}
        </Link>
      ))}
    </div>
  )
}
