export type WeatherPoint = {
  t: number
  temp: number
}

export type WeatherSnapshot = {
  temp: number
  humidity: number
  wind: number
  code: number
  symbol: string
  at: number
  points: WeatherPoint[]
}

const TEHRAN = { lat: 35.6892, lon: 51.389 }

const SYMBOL_LABEL: Record<string, { fa: string; en: string }> = {
  clearsky: { fa: "آفتابی", en: "Clear" },
  fair: { fa: "عمدتاً صاف", en: "Fair" },
  partlycloudy: { fa: "نیمه‌ابری", en: "Partly cloudy" },
  cloudy: { fa: "ابری", en: "Cloudy" },
  fog: { fa: "مه", en: "Fog" },
  rain: { fa: "باران", en: "Rain" },
  heavyrain: { fa: "باران شدید", en: "Heavy rain" },
  lightrain: { fa: "باران ملایم", en: "Light rain" },
  snow: { fa: "برف", en: "Snow" },
  sleet: { fa: "سلیت", en: "Sleet" },
  thunder: { fa: "رعدوبرق", en: "Thunder" },
}

export function weatherLabel(symbol: string, locale: "fa" | "en"): string {
  const key = symbol.replace(/_(day|night|polartwilight)$/, "")
  return (SYMBOL_LABEL[key] ?? { fa: "متغیر", en: "Mixed" })[locale]
}

function asSnapshot(value: unknown): WeatherSnapshot | null {
  if (!value || typeof value !== "object") return null
  const series = (value as { properties?: { timeseries?: unknown } }).properties
    ?.timeseries
  if (!Array.isArray(series) || series.length < 2) return null

  const points: WeatherPoint[] = []
  for (const row of series.slice(0, 24)) {
    if (!row || typeof row !== "object") continue
    const item = row as {
      time?: unknown
      data?: { instant?: { details?: Record<string, unknown> } }
    }
    const stamp = Date.parse(String(item.time ?? ""))
    const temp = Number(item.data?.instant?.details?.air_temperature)
    if (!Number.isFinite(stamp) || !Number.isFinite(temp)) continue
    points.push({ t: Math.floor(stamp / 1000), temp })
  }
  if (points.length < 2) return null

  const first = series[0] as {
    time?: unknown
    data?: {
      instant?: { details?: Record<string, unknown> }
      next_1_hours?: { summary?: { symbol_code?: unknown } }
      next_6_hours?: { summary?: { symbol_code?: unknown } }
    }
  }
  const details = first.data?.instant?.details
  if (!details) return null

  const temp = Number(details.air_temperature)
  const humidity = Number(details.relative_humidity)
  const windMs = Number(details.wind_speed)
  if (![temp, humidity, windMs].every(Number.isFinite)) return null

  const symbol =
    typeof first.data?.next_1_hours?.summary?.symbol_code === "string"
      ? first.data.next_1_hours.summary.symbol_code
      : typeof first.data?.next_6_hours?.summary?.symbol_code === "string"
        ? first.data.next_6_hours.summary.symbol_code
        : "fair"

  const at = Date.parse(String(first.time ?? ""))
  return {
    temp,
    humidity,
    wind: windMs * 3.6,
    code: 0,
    symbol,
    at: Number.isFinite(at) ? Math.floor(at / 1000) : Math.floor(Date.now() / 1000),
    points,
  }
}

export async function getTehranWeather(): Promise<WeatherSnapshot | null> {
  try {
    const response = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${TEHRAN.lat}&lon=${TEHRAN.lon}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/json",
          "User-Agent": "portfolio-new/1.0 (https://github.com/abnos5525)",
        },
      }
    )
    if (!response.ok) {
      console.error(`Weather API returned ${response.status}`)
      return null
    }
    return asSnapshot(await response.json())
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return null
    console.error("Weather request failed", error)
    return null
  }
}
