import { ArrowLeftIcon } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  getCoreSkills,
  getFeaturedProjects,
  site,
  socials,
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

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--surface-glow),transparent_55%)]"
      />

      <div className="absolute top-6 end-6 z-20">
        <LocaleSwitcher />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl">
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

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <section aria-labelledby="featured-heading">
            <h2
              id="featured-heading"
              className="text-sm font-medium tracking-wide uppercase"
            >
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

          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="text-sm font-medium tracking-wide uppercase"
            >
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

        <nav
          aria-label={translate("socialNav")}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t(social.label, locale)}
            </a>
          ))}
        </nav>
      </div>
    </main>
  )
}
