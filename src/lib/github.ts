import { socials } from "@/content"

export type GithubRepoLive = {
  repo: string
  language: string | null
  pushedAt: string | null
  url: string
  description: string | null
}

function githubUser() {
  const href = socials.find((item) => item.id === "github")?.href
  if (!href) return null
  const name = new URL(href).pathname.split("/").filter(Boolean)[0]
  return name || null
}

function asRepo(value: unknown): GithubRepoLive | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  if (typeof row.name !== "string" || typeof row.html_url !== "string") return null
  if (row.fork === true) return null
  return {
    repo: row.name,
    language: typeof row.language === "string" ? row.language : null,
    pushedAt: typeof row.pushed_at === "string" ? row.pushed_at : null,
    url: row.html_url,
    description: typeof row.description === "string" ? row.description : null,
  }
}

export async function getRecentPublicRepos(limit = 6): Promise<GithubRepoLive[]> {
  const user = githubUser()
  if (!user) return []

  const response = await fetch(
    `https://api.github.com/users/${user}/repos?sort=pushed&per_page=20&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-new",
      },
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    console.error(`GitHub repos returned ${response.status}`)
    return []
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload)) return []

  return payload
    .map(asRepo)
    .filter((repo): repo is GithubRepoLive => repo !== null && repo.repo !== user)
    .sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""))
    .slice(0, limit)
}
