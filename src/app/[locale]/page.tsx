import { ArrowLeftIcon } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  experience,
  getCoreSkills,
  getFeaturedProjects,
  site,
  t,
  type Locale,
} from "@/content"
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
  const featured = getFeaturedProjects().slice(0, 4)
  const highlightSkills = getCoreSkills(10)
  const roles = experience.slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <section className="max-w-3xl">
        <p className="text-primary text-sm font-medium tracking-wide">
          {t(site.role, locale)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
          {t(site.name, locale)}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed sm:text-xl">
          {t(site.headline, locale)}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/#projects"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {translate("viewProjects")}
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

      <section id="about" className="scroll-mt-24 mt-20 max-w-3xl">
        <h2 className="text-sm font-medium tracking-wide uppercase">
          {translate("about")}
        </h2>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          {t(site.about, locale)}
        </p>
      </section>

      <section id="experience" className="scroll-mt-24 mt-20">
        <h2 className="text-sm font-medium tracking-wide uppercase">
          {translate("experience")}
        </h2>
        <ul className="mt-6 space-y-6">
          {roles.map((role) => (
            <li key={role.id} className="border-border/70 border-s-2 ps-4">
              <p className="font-medium">{t(role.role, locale)}</p>
              <p className="text-muted-foreground text-sm">
                {t(role.company, locale)} · {t(role.start, locale)} —{" "}
                {t(role.end, locale)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-20 grid gap-12 sm:grid-cols-2">
        <section id="projects" className="scroll-mt-24">
          <h2 className="text-sm font-medium tracking-wide uppercase">
            {translate("featured")}
          </h2>
          <ul className="mt-4 space-y-3">
            {featured.map((project) => {
              const href = project.liveUrl ?? project.repoUrl ?? "#"
              return (
                <li key={project.id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:border-primary/40 group flex items-center justify-between gap-3 rounded-xl border border-transparent px-1 py-2 transition-colors"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {t(project.title, locale)}
                    </span>
                    <Badge variant="outline">
                      {translate(`status.${project.status}`)}
                    </Badge>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>

        <section id="skills" className="scroll-mt-24">
          <h2 className="text-sm font-medium tracking-wide uppercase">
            {translate("skills")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {highlightSkills.map((skill) => (
              <Badge key={skill.id} variant="secondary">
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
