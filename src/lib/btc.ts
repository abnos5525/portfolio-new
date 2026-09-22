export type BtcPoint = {
  t: number
  p: number
}

export const btcRanges = ["1h", "1d", "1w", "1m"] as const

export type BtcRange = (typeof btcRanges)[number]

export type BtcSeries = {
  price: number
  changePercent: number
  bucket: number
  points: BtcPoint[]
}

export function asBtcRange(value: string | null): BtcRange {
  if (value === "1h" || value === "1d" || value === "1w" || value === "1m") return value
  return "1d"
}

function asPoint(value: unknown): BtcPoint | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  const t = Number(row.t)
  const p = Number(row.p)
  if (!Number.isFinite(t) || !Number.isFinite(p) || p <= 0) return null
  return { t, p }
}

export function asBtcSeries(value: unknown): BtcSeries | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  const price = Number(row.price)
  const changePercent = Number(row.changePercent)
  const bucket = Number(row.bucket)
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(changePercent)) return null
  if (!Number.isFinite(bucket) || bucket <= 0) return null
  if (!Array.isArray(row.points) || row.points.length < 2) return null
  const points: BtcPoint[] = []
  for (const item of row.points) {
    const point = asPoint(item)
    if (!point) return null
    points.push(point)
  }
  return { price, changePercent, bucket, points }
}

export function stampBtcPrice(series: BtcSeries, price: number, at: number): BtcSeries {
  const points = series.points.map((point) => ({ ...point }))
  const last = points[points.length - 1]
  const first = points[0]
  if (!last || !first) return series
  if (at < last.t + series.bucket) last.p = price
  else points.push({ t: at, p: price })
  return {
    price,
    changePercent: ((price - first.p) / first.p) * 100,
    bucket: series.bucket,
    points,
  }
}
