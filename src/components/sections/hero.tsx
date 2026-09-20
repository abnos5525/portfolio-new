import { getTranslations } from "next-intl/server"

import { HeroClient } from "@/components/sections/hero-client"
import { site, t, type Locale } from "@/content"

type Props = {
  locale: Locale
}

export async function HeroSection({ locale }: Props) {
  const translate = await getTranslations("Home")

  return (
    <HeroClient
      name={t(site.name, locale)}
      role={t(site.role, locale)}
      headline={t(site.headline, locale)}
      location={t(site.location, locale)}
      resumePath={site.resumePath}
      available={site.availability === "open"}
      labels={{
        available: translate("available"),
        viewExperience: translate("viewExperience"),
        downloadResume: translate("downloadResume"),
      }}
    />
  )
}
