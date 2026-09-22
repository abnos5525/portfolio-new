import { getHafezCouplet } from "@/lib/ganjoor"

export const dynamic = "force-dynamic"

export async function GET() {
  const verse = await getHafezCouplet()
  return Response.json(verse, {
    headers: { "Cache-Control": "no-store" },
  })
}
