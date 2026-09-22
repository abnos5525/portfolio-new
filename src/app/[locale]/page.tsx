import { getTranslations, setRequestLocale } from "next-intl/server"
import { Suspense } from "react"

import { ExperienceReel } from "@/components/sections/experience-reel"
import { HafezVerse } from "@/components/sections/hafez-verse"
import { HeroSection } from "@/components/sections/hero"
import { IranClock } from "@/components/sections/iran-clock"
import {
  EducationSection,
  HireBand,
  ProofStrip,
} from "@/components/sections/hire-signals"
import { PublicWorkSkeleton } from "@/components/sections/page-skeleton"
import { PublicWork } from "@/components/sections/public-work"
import { SkillsConstellation } from "@/components/sections/skills-constellation"
import { experience, getAllSkills, site, t, type Locale } from "@/content"

type Props = {
  params: Promise<{ locale: string }>
}

function splitLead(copy: string) {
  const match = copy.match(/^(.+?)[.;؛]\s+([\s\S]+)$/)
  if (!match?.[1] || !match[2]) return { lead: copy, rest: "" }
  return { lead: match[1], rest: match[2] }
}

function AboutLead({ kicker, copy }: { kicker: string; copy: string }) {
  const { lead, rest } = splitLead(copy)

  return (
    <section id="about" className="scroll-mt-24 mt-10 max-w-3xl md:scroll-mt-28">
      <p className="text-primary text-xs font-medium">{kicker}</p>
      <h2 className="font-heading mt-3 text-[clamp(1.7rem,6.4vw,3.15rem)] leading-[1.28] font-semibold text-balance">
        {lead}
      </h2>
      {rest ? (
        <p className="text-foreground/85 mt-5 max-w-xl text-base leading-8 text-pretty sm:text-lg sm:leading-9">
          {rest}
        </p>
      ) : null}
    </section>
  )
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

      <HafezVerse />

      <div className="page-gutter mx-auto w-full max-w-6xl">
        <IranClock
          locale={locale}
          label={translate("iranClock")}
          city={translate("iranCity")}
        />
        <HeroSection locale={locale} />

        <AboutLead
          kicker={translate("about")}
          copy={t(site.about, locale)}
        />
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

      <Suspense fallback={<PublicWorkSkeleton />}>
        <PublicWork
          locale={locale}
          title={translate("publicWork")}
          support={translate("publicWorkSupport")}
        />
      </Suspense>

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
        resumeLabel={translate("downloadResume")}
      />
    </main>
  )
}
