import { socials } from "@/content"

export type PulsePoint = {
  /** Unix seconds (day start UTC) */
  t: number
  /** Event count that day */
  n: number
}

export type GithubPulse = {
  user: string
  profileUrl: string
  lastAt: number | null
  weekCount: number
  points: PulsePoint[]
  languages: { name: string; count: number }[]
  latest: { repo: string; type: string; at: number; url: string } | null
}

function githubUser() {
  const href = socials.find((item) => item.id === "github")?.href
  if (!href) return null
  const name = new URL(href).pathname.split("/").filter(Boolean)[0]
  return name || null
}

function dayKey(ms: number) {
  const date = new Date(ms)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000
}

function asEvent(value: unknown): { type: string; at: number; repo: string; url: string } | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  if (typeof row.type !== "string" || typeof row.created_at !== "string") return null
  const created = Date.parse(row.created_at)
  if (!Number.isFinite(created)) return null
  const repoObj = row.repo
  const repoName =
    repoObj && typeof repoObj === "object" && typeof (repoObj as { name?: unknown }).name === "string"
      ? (repoObj as { name: string }).name
      : "repo"
  const short = repoName.includes("/") ? repoName.split("/").pop()! : repoName
  return {
    type: row.type.replace(/Event$/, ""),
    at: Math.floor(created / 1000),
    repo: short,
    url: `https://github.com/${repoName}`,
  }
}

export async function getGithubPulse(): Promise<GithubPulse | null> {
  const user = githubUser()
  if (!user) return null

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-new",
  }

  try {
    const [eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}/events/public?per_page=100`, {
        headers,
        next: { revalidate: 120 },
      }),
      fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30&type=owner`, {
        headers,
        next: { revalidate: 120 },
      }),
    ])

    if (!eventsRes.ok) {
      console.error(`GitHub events returned ${eventsRes.status}`)
      return null
    }

    const eventsPayload: unknown = await eventsRes.json()
    if (!Array.isArray(eventsPayload)) return null

    const events = eventsPayload
      .map(asEvent)
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const now = Date.now()
    const weekAgo = Math.floor((now - 7 * 86_400_000) / 1000)
    const days = 14
    const startDay = dayKey(now - (days - 1) * 86_400_000)
    const buckets = new Map<number, number>()
    for (let i = 0; i < days; i++) {
      buckets.set(startDay + i * 86_400, 0)
    }
    for (const event of events) {
      const key = dayKey(event.at * 1000)
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }

    const points: PulsePoint[] = [...buckets.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([t, n]) => ({ t, n }))

    const weekCount = events.filter((event) => event.at >= weekAgo).length
    const latest = events[0]
      ? {
          repo: events[0].repo,
          type: events[0].type,
          at: events[0].at,
          url: events[0].url,
        }
      : null

    const languageCount = new Map<string, number>()
    if (reposRes.ok) {
      const reposPayload: unknown = await reposRes.json()
      if (Array.isArray(reposPayload)) {
        for (const row of reposPayload) {
          if (!row || typeof row !== "object") continue
          const language = (row as { language?: unknown }).language
          if (typeof language !== "string" || !language) continue
          languageCount.set(language, (languageCount.get(language) ?? 0) + 1)
        }
      }
    }

    const languages = [...languageCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      user,
      profileUrl: `https://github.com/${user}`,
      lastAt: latest?.at ?? null,
      weekCount,
      points,
      languages,
      latest,
    }
  } catch (error) {
    console.error("GitHub pulse failed", error)
    return null
  }
}
