"use client"

import { MenuIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { ThemeControls } from "@/components/layout/theme-controls"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navigation, site, t, type Locale } from "@/content"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const locale = useLocale() as Locale
  const translate = useTranslations("Nav")
  const [open, setOpen] = useState(false)
  const sheetSide = locale === "fa" ? "left" : "right"

  return (
    <header
      className="border-border/60 bg-background/75 sticky top-0 z-40 border-b backdrop-blur-md"
      suppressHydrationWarning
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="hover:text-primary truncate text-sm font-semibold tracking-tight transition-colors sm:text-base"
        >
          {t(site.name, locale)}
        </Link>

        <nav
          aria-label={translate("primary")}
          className="hidden items-center gap-1 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(item.label, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.resumePath}
            download
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "hidden sm:inline-flex"
            )}
          >
            {translate("resume")}
          </a>

          <div className="hidden items-center gap-2 sm:flex">
            <ThemeControls />
            <LocaleSwitcher />
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden"
              )}
              aria-label={translate("menu")}
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side={sheetSide} className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle>{t(site.name, locale)}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2 px-4 pb-6">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start"
                    )}
                  >
                    {t(item.label, locale)}
                  </Link>
                ))}
                <a
                  href={site.resumePath}
                  download
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-2 justify-start"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {translate("resume")}
                </a>
                <div className="mt-4 space-y-3">
                  <ThemeControls />
                  <LocaleSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
