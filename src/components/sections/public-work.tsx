"use client"

import { useEffect, useState } from "react"

import type { Locale } from "@/content"
import { getRecentPublicRepos, type GithubRepoLive } from "@/lib/github"

type Props = {
  locale: Locale
  title: string
  support: string
}

function formatPushed(iso: string, locale: Locale) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000)
  const tag = locale === "fa" ? "fa" : "en"
  const format = new Intl.RelativeTimeFormat(tag, { numeric: "auto" })
  if (days < 1) return format.format(0, "day")
  if (days < 30) return format.format(-days, "day")
  return format.format(-Math.max(1, Math.round(days / 30)), "month")
}

const REFRESH_MS = 10 * 60_000

export function PublicWork({ locale, title, support }: Props) {
  const [repos, setRepos] = useState<GithubRepoLive[]>([])

  useEffect(() => {
    let alive = true

    const load = async () => {
      try {
        const next = await getRecentPublicRepos()
        if (alive) setRepos(next)
      } catch (error) {
        console.error("GitHub recent repos failed", error)
      }
    }

    void load()
    const id = window.setInterval(() => void load(), REFRESH_MS)
    const onFocus = () => void load()
    window.addEventListener("focus", onFocus)

    return () => {
      alive = false
      window.clearInterval(id)
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  return (
    <section
      id="public-work"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <h2 className="font-heading text-2xl font-semibold sm:text-5xl">{title}</h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7 text-pretty sm:text-base">
        {support}
      </p>

      <ul className="border-border mt-8 divide-y border-y sm:mt-10">
        {repos.map((repo) => {
          const when = repo.pushedAt ? formatPushed(repo.pushedAt, locale) : null

          return (
            <li key={repo.repo}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-primary/5 focus-visible:ring-ring grid gap-2 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_7rem_8rem] sm:items-baseline sm:gap-6 sm:py-5"
              >
                <p className="font-heading min-w-0 text-lg font-semibold sm:text-2xl">
                  {repo.repo}
                </p>
                <p className="text-primary text-sm font-medium">{repo.language}</p>
                <p className="text-muted-foreground font-mono text-xs tabular-nums sm:text-end">
                  {when}
                </p>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
