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
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <a
        href="#about"
        className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-20 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:ring-2"
      >
        {translate("skipToContent")}
      </a>

      <HeroSection locale={locale} />

      <section id="about" className="scroll-mt-28 relative mt-6 max-w-3xl sm:mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
            {translate("about")}
          </h2>
          <span
            aria-hidden
            className="text-primary/40 font-mono text-[0.65rem] tracking-[0.2em]"
          >
            {translate("aboutTag")}
          </span>
        </div>
        <p className="border-primary/25 text-foreground/90 border-s-2 ps-5 text-base leading-8 text-pretty sm:text-lg sm:leading-9">
          {t(site.about, locale)}
        </p>
      </section>

      <ExperienceReel
        locale={locale}
        title={translate("experience")}
        tag={translate("experienceTag")}
        items={experience}
      />

      <SkillsConstellation
        title={translate("skills")}
        tag={translate("skillsTag")}
        skills={allSkills}
      />
    </main>
  )
}
