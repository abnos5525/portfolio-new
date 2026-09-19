import type { Metadata } from "next"

import { DirectionProvider } from "@/components/ui/direction"
import { site, t } from "@/content"

import "./globals.css"

export const metadata: Metadata = {
  title: `${t(site.name, "en")} | ${t(site.role, "en")}`,
  description: t(site.headline, "en"),
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" data-accent="trust" className="dark">
      <body className="min-h-dvh font-sans antialiased">
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  )
}
