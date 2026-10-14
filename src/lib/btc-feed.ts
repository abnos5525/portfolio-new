import { type BtcPoint, type BtcRange, type BtcSeries } from "@/lib/btc"

const CANDLE_TTL_MS = 60_000
const API = "https://api.coingecko.com/api/v3"

const specs: Record<BtcRange, { days: number; span: number; bucket: number }> = {
  "1h": { days: 1, span: 60 * 60, bucket: 300 },
  "1d": { days: 1, span: 24 * 60 * 60, bucket: 300 },
  "1w": { days: 7, span: 7 * 24 * 60 * 60, bucket: 3600 },
  "1m": { days: 30, span: 30 * 24 * 60 * 60, bucket: 21600 },
}

const chartCache = new Map<number, { at: number; points: BtcPoint[] }>()

function asPrices(value: unknown): BtcPoint[] | null {
  if (!value || typeof value !== "object") return null
  const rows = (value as Record<string, unknown>).prices
  if (!Array.isArray(rows) || rows.length < 2) return null
  const points: BtcPoint[] = []
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 2) return null
    const t = Math.floor(Number(row[0]) / 1000)
    const p = Number(row[1])
    if (!Number.isFinite(t) || !Number.isFinite(p) || p <= 0) return null
    points.push({ t, p })
  }
  points.sort((a, b) => a.t - b.t)
  return points
}

/** Keep the last sample of each bucket so every range has an even cadence. */
function toBuckets(points: BtcPoint[], bucket: number, since: number): BtcPoint[] {
  const byBucket = new Map<number, BtcPoint>()
  for (const point of points) {
    if (point.t < since) continue
    byBucket.set(Math.floor(point.t / bucket), point)
  }
  return [...byBucket.values()]
}

/** CoinGecko's free tier is tightly rate limited; ranges sharing `days` share one request. */
async function loadChart(days: number): Promise<BtcPoint[] | null> {
  const cached = chartCache.get(days)
  if (cached && Date.now() - cached.at < CANDLE_TTL_MS) return cached.points
  const response = await fetch(
    `${API}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    {
      cache: typeof window === "undefined" ? "force-cache" : "no-store",
      signal: AbortSignal.timeout(8000),
    },
  )
  if (!response.ok) {
    console.error(`CoinGecko market chart returned ${response.status}`)
    return null
  }
  const points = asPrices(await response.json())
  if (!points) return null
  chartCache.set(days, { at: Date.now(), points })
  return points
}

async function loadCandles(range: BtcRange): Promise<BtcPoint[] | null> {
  const spec = specs[range]
  const raw = await loadChart(spec.days)
  const last = raw?.[raw.length - 1]
  if (!raw || !last) return null
  const points = toBuckets(raw, spec.bucket, last.t - spec.span)
  return points.length < 2 ? null : points
}

export async function getBtcSeries(range: BtcRange = "1d"): Promise<BtcSeries | null> {
  try {
    const points = await loadCandles(range)
    const first = points?.[0]
    const last = points?.[points.length - 1]
    if (!points || !first || !last) return null
    return {
      price: last.p,
      changePercent: ((last.p - first.p) / first.p) * 100,
      bucket: specs[range].bucket,
      points,
    }
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.warn("CoinGecko request timed out")
      return null
    }
    console.error("CoinGecko request failed", error)
    return null
  }
}

export async function getBtcSpot(): Promise<number | null> {
  try {
    const response = await fetch(`${API}/simple/price?ids=bitcoin&vs_currencies=usd`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) {
      console.error(`CoinGecko price returned ${response.status}`)
      return null
    }
    const data: unknown = await response.json()
    const usd = Number(
      (data as { bitcoin?: { usd?: unknown } } | null)?.bitcoin?.usd,
    )
    return Number.isFinite(usd) && usd > 0 ? usd : null
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") return null
    console.error("CoinGecko price failed", error)
    return null
  }
}
