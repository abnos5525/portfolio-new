import { getGithubPulse } from "@/lib/github-pulse"

export const dynamic = "force-dynamic"

export async function GET() {
  const pulse = await getGithubPulse()
  if (!pulse) {
    return Response.json(
      { error: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
  return Response.json(pulse, {
    headers: { "Cache-Control": "no-store" },
  })
}
