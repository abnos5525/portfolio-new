export type HafezCouplet = {
  lines: [string, string]
  title: string
  href: string
}

export const hafezFallback: HafezCouplet = {
  lines: [
    "دلش به ناله میازار و ختم کن حافظ",
    "که رستگاری جاوید در کم آزاری ست",
  ],
  title: "غزل شمارهٔ ۶۶",
  href: "https://ganjoor.net/hafez/ghazal/sh66",
}

function asCouplet(value: unknown): HafezCouplet | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  if (!Array.isArray(row.verses)) return null

  const lines = row.verses
    .filter((verse): verse is Record<string, unknown> => {
      if (!verse || typeof verse !== "object") return false
      const item = verse as Record<string, unknown>
      return item.coupletIndex === 0 && typeof item.text === "string"
    })
    .sort((a, b) => Number(a.vOrder) - Number(b.vOrder))
    .map((verse) => String(verse.text))
    .slice(0, 2)

  if (lines.length < 2 || !lines[0] || !lines[1]) return null

  const title = typeof row.title === "string" ? row.title : hafezFallback.title
  const path = typeof row.fullUrl === "string" ? row.fullUrl : "/hafez/ghazal/sh66"

  return {
    lines: [lines[0], lines[1]],
    title,
    href: `https://ganjoor.net${path}`,
  }
}

export async function getHafezCouplet(): Promise<HafezCouplet> {
  try {
    const response = await fetch("https://api.ganjoor.net/api/ganjoor/hafez/faal", {
      headers: { "User-Agent": "portfolio-new" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      console.error(`Ganjoor returned ${response.status}`)
      return hafezFallback
    }

    return asCouplet(await response.json()) ?? hafezFallback
  } catch (error) {
    console.error("Ganjoor request failed", error)
    return hafezFallback
  }
}
