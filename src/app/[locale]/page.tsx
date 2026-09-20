import { getTranslations, setRequestLocale } from "next-intl/server"

import { ExperienceReel } from "@/components/sections/experience-reel"
import { HeroSection } from "@/components/sections/hero"
import { SkillsConstellation } from "@/components/sections/skills-constellation"
import { experience, getAllSkills, site, t, type Locale } from "@/content"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const translate = await getTranslations("Home")
  const allSkills = getAllSkills()

  return (
    <main id="main" className="w-full flex-1">
      <a
        href="#about"
        className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-20 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:ring-2"
      >
        {translate("skipToContent")}
      </a>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <HeroSection locale={locale} />

        <section id="about" className="scroll-mt-28 mt-6 max-w-3xl sm:mt-10">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
            {translate("about")}
          </h2>
          <p className="text-foreground/90 mt-6 text-base leading-8 text-pretty sm:text-lg sm:leading-9">
            {t(site.about, locale)}
          </p>
        </section>
      </div>

      <ExperienceReel
        locale={locale}
        title={translate("experience")}
        support={translate("experienceSupport")}
        items={experience}
      />

      <SkillsConstellation
        title={translate("skills")}
        support={translate("skillsSupport")}
        skills={allSkills}
        categoryLabels={{
          frontend: translate("catFrontend"),
          backend: translate("catBackend"),
          data: translate("catData"),
          devops: translate("catDevops"),
          other: translate("catOther"),
        }}
      />
    </main>
  )
}
