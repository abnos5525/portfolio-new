import { getTehranWeather } from "@/lib/weather"

export const dynamic = "force-dynamic"

export async function GET() {
  const weather = await getTehranWeather()
  if (!weather) {
    return Response.json(
      { error: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
  return Response.json(weather, {
    headers: { "Cache-Control": "no-store" },
  })
}
