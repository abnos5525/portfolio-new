import { ArrowLeftIcon } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { experience, getAllSkills, site, t, type Locale } from "@/content"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

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
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 sm:py-24">
      <section className="max-w-3xl">
        <p className="text-primary text-sm font-medium tracking-[0.14em]">
          {t(site.role, locale)}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          {t(site.name, locale)}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-8 sm:text-xl sm:leading-9">
          {t(site.headline, locale)}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/#experience"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {translate("viewExperience")}
            <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          </Link>
          <a
            href={site.resumePath}
            download
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {translate("downloadResume")}
          </a>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 mt-24 max-w-3xl sm:mt-28">
        <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          {translate("about")}
        </h2>
        <p className="text-foreground/90 mt-5 text-base leading-8 sm:text-lg sm:leading-9">
          {t(site.about, locale)}
        </p>
      </section>

      <section id="experience" className="scroll-mt-28 mt-24 sm:mt-28">
        <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          {translate("experience")}
        </h2>

        <ul className="mt-10 space-y-14 sm:space-y-16">
          {experience.map((role) => (
            <li key={role.id} className="relative ps-6 sm:ps-8">
              <span
                aria-hidden
                className="bg-primary absolute top-2 start-0 size-2.5 rounded-full"
              />
              <span
                aria-hidden
                className="bg-border absolute top-5 bottom-0 start-[4px] w-px"
              />

              <header className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl sm:leading-snug">
                    {t(role.role, locale)}
                  </h3>
                  <p className="text-muted-foreground shrink-0 text-sm tabular-nums sm:pt-1.5">
                    {t(role.start, locale)}
                    <span className="mx-1.5 opacity-50">—</span>
                    {t(role.end, locale)}
                  </p>
                </div>
                <p className="text-primary text-sm font-medium tracking-wide sm:text-base">
                  {t(role.company, locale)}
                </p>
              </header>

              <ul className="mt-8 space-y-7">
                {role.projects.map((project) => (
                  <li key={`${role.id}-${project.name.en}`} className="space-y-3">
                    <p className="text-foreground/90 text-[0.95rem] font-medium sm:text-base">
                      {t(project.name, locale)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="scroll-mt-28 mt-24 sm:mt-28">
        <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          {translate("skills")}
        </h2>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {allSkills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="px-3 py-1">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>
    </main>
  )
}
