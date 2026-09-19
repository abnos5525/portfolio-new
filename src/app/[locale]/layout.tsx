import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { SiteShell } from "@/components/layout/site-shell"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { site, t, type Locale } from "@/content"
import { routing } from "@/i18n/routing"

import "../globals.css"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = (hasLocale(routing.locales, raw) ? raw : "fa") as Locale

  return {
    title: `${t(site.name, locale)} | ${t(site.role, locale)}`,
    description: t(site.headline, locale),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const direction = locale === "fa" ? "rtl" : "ltr"

  return (
    <html
      lang={locale}
      dir={direction}
      data-accent="trust"
      className="dark"
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <DirectionProvider direction={direction}>
              <SiteShell>{children}</SiteShell>
            </DirectionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
