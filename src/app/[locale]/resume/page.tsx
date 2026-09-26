import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { ResumeDossier } from "@/components/sections/resume-dossier"
import {
  education,
  experience,
  getAllSkills,
  site,
  socials,
  t,
  type Locale,
} from "@/content"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = raw as Locale
  const translate = await getTranslations({ locale, namespace: "Resume" })

  return {
    title: `${translate("metaTitle")} | ${t(site.name, locale)}`,
    description: t(site.headline, locale),
  }
}

export default async function ResumePage({ params }: Props) {
  const { locale: raw } = await params
  const locale = raw as Locale
  setRequestLocale(locale)

  const translate = await getTranslations("Resume")
  const home = await getTranslations("Home")

  const contacts = [
    ...(site.email
      ? [{ id: "email", label: site.email, href: `mailto:${site.email}` }]
      : []),
    ...socials.map((social) => ({
      id: social.id,
      label: t(social.label, locale),
      href: social.href,
    })),
  ]

  return (
    <main id="main" className="w-full flex-1">
      <a
        href="#career"
        className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-20 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:ring-2"
      >
        {translate("skipToCareer")}
      </a>

      <ResumeDossier
        locale={locale}
        name={t(site.name, locale)}
        role={t(site.role, locale)}
        headline={t(site.headline, locale)}
        about={t(site.about, locale)}
        location={t(site.location, locale)}
        available={site.availability === "open"}
        resumePath={site.resumePath}
        contacts={contacts}
        experience={experience}
        education={education}
        skills={getAllSkills()}
        labels={{
          dossier: translate("dossier"),
          contact: translate("contact"),
          available: home("available"),
          downloadPdf: translate("downloadPdf"),
          scrollCareer: translate("scrollCareer"),
          career: translate("career"),
          current: home("current"),
          education: home("education"),
          skills: home("skills"),
          skillsSupport: home("skillsSupport"),
          categories: {
            frontend: home("catFrontend"),
            backend: home("catBackend"),
            data: home("catData"),
            devops: home("catDevops"),
            other: home("catOther"),
          },
          printHint: translate("printHint"),
        }}
      />
    </main>
  )
}
