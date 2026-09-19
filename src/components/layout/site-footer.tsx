import { getLocale, getTranslations } from "next-intl/server"

import { site, socials, t, type Locale } from "@/content"

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale
  const translate = await getTranslations("Footer")
  const year = new Date().getFullYear()

  return (
    <footer className="border-border/60 mt-auto border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">{t(site.name, locale)}</p>
          <p className="text-muted-foreground text-sm">{t(site.role, locale)}</p>
        </div>

        <nav
          aria-label={translate("social")}
          className="flex flex-wrap items-center gap-4"
        >
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t(social.label, locale)}
            </a>
          ))}
        </nav>

        <p className="text-muted-foreground text-xs sm:text-end">
          © {year} {t(site.name, locale)}
        </p>
      </div>
    </footer>
  )
}
