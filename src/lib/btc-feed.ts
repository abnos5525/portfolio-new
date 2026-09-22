import { type BtcPoint, type BtcRange, type BtcSeries } from "@/lib/btc"

const CANDLE_TTL_MS = 60_000

const specs: Record<BtcRange, { span: number; bucket: number }> = {
  "1h": { span: 60 * 60, bucket: 60 },
  "1d": { span: 24 * 60 * 60, bucket: 300 },
  "1w": { span: 7 * 24 * 60 * 60, bucket: 3600 },
  "1m": { span: 30 * 24 * 60 * 60, bucket: 21600 },
}

const candleCache = new Map<BtcRange, { at: number; points: BtcPoint[] }>()

function asCandles(value: unknown): BtcPoint[] | null {
  if (!Array.isArray(value) || value.length < 2) return null
  const points: BtcPoint[] = []
  for (const row of value) {
    if (!Array.isArray(row) || row.length < 5) return null
    const t = Number(row[0])
    const close = Number(row[4])
    if (!Number.isFinite(t) || !Number.isFinite(close) || close <= 0) return null
    points.push({ t, p: close })
  }
  points.sort((a, b) => a.t - b.t)
  return points
}

async function loadCandles(range: BtcRange): Promise<BtcPoint[] | null> {
  const cached = candleCache.get(range)
  if (cached && Date.now() - cached.at < CANDLE_TTL_MS) return cached.points
  const spec = specs[range]
  const end = Math.floor(Date.now() / 1000)
  const start = end - spec.span
  const response = await fetch(
    `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=${spec.bucket}&start=${start}&end=${end}`,
    {
      headers: { "User-Agent": "portfolio-new" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    },
  )
  if (!response.ok) {
    console.error(`Coinbase candles returned ${response.status}`)
    return null
  }
  const points = asCandles(await response.json())
  if (!points) return null
  candleCache.set(range, { at: Date.now(), points })
  return points
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
    console.error("Coinbase request failed", error)
    return null
  }
}
