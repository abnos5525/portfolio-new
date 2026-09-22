import { asBtcRange } from "@/lib/btc"
import { getBtcSeries } from "@/lib/btc-feed"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const range = asBtcRange(new URL(request.url).searchParams.get("range"))
  const series = await getBtcSeries(range)
  if (!series) {
    return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  return Response.json(series, {
    headers: { "Cache-Control": "no-store" },
  })
}
