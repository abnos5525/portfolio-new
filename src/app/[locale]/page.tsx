import { getTranslations, setRequestLocale } from "next-intl/server"

import { ExperienceReel } from "@/components/sections/experience-reel"
import { HeroSection } from "@/components/sections/hero"
import {
  EducationSection,
  HireBand,
  ProofStrip,
} from "@/components/sections/hire-signals"
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

        <section id="about" className="scroll-mt-24 mt-4 max-w-3xl sm:mt-10 md:scroll-mt-28">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-5xl">
            {translate("about")}
          </h2>
          <p className="text-foreground/90 mt-4 text-base leading-7 text-pretty sm:mt-6 sm:text-lg sm:leading-9">
            {t(site.about, locale)}
          </p>
        </section>
      </div>

      <ProofStrip
        proofs={[
          { label: translate("proofLang"), value: translate("proofLangValue") },
          { label: translate("proofStack"), value: translate("proofStackValue") },
          { label: translate("proofEdu"), value: translate("proofEduValue") },
          { label: translate("proofWork"), value: translate("proofWorkValue") },
        ]}
      />

      <ExperienceReel
        locale={locale}
        title={translate("experience")}
        currentLabel={translate("current")}
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

      <EducationSection locale={locale} title={translate("education")} />

      <HireBand
        title={translate("hireTitle")}
        body={translate("hireBody")}
        linkedinLabel={translate("hireLinkedin")}
        resumeLabel={translate("downloadResume")}
      />
    </main>
  )
}
