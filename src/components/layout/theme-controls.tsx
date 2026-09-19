"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useAccent, type Accent } from "@/components/layout/use-accent"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const accentSwatch: Record<Accent, string> = {
  trust: "bg-[oklch(0.65_0.11_185)]",
  energy: "bg-[oklch(0.68_0.15_45)]",
  focus: "bg-[oklch(0.75_0.18_130)]",
}

export function ThemeControls() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { accent, setAccent, accents } = useAccent()
  const translate = useTranslations("Theme")
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = (resolvedTheme ?? theme) === "dark"

  return (
    <div className="flex items-center gap-1.5">
      <div
        role="group"
        aria-label={translate("accent")}
        className="flex items-center gap-1 rounded-lg border p-1"
      >
        {accents.map((item) => (
          <button
            key={item}
            type="button"
            aria-label={translate(item)}
            aria-pressed={accent === item}
            onClick={() => setAccent(item)}
            className={cn(
              "size-6 rounded-full border transition-transform",
              accentSwatch[item],
              accent === item
                ? "scale-110 ring-2 ring-ring ring-offset-1 ring-offset-background"
                : "opacity-70 hover:opacity-100"
            )}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label={translate("toggle")}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        disabled={!mounted}
      >
        {mounted && isDark ? (
          <SunIcon className="size-4" />
        ) : (
          <MoonIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
