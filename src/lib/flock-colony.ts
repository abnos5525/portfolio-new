/** Colony work layer — roles, nest, food motes, stigmergy helpers. */

export type ColonyRole = "scout" | "forager" | "guard"
export type WorkPhase = "flock" | "seek" | "carry" | "guard"

export type Nest = { x: number; y: number; r: number }

export type FoodMote = {
  x: number
  y: number
  stock: number
  pulse: number
  claims: number
}

export const MAX_SEEKERS = 24
export const MAX_CLAIMS_PER_FOOD = 2

export function assignRole(curiosity: number, grit: number): ColonyRole {
  if (curiosity > 0.78) return "scout"
  if (grit > 0.7) return "guard"
  return "forager"
}

export function roleBias(role: ColonyRole): number {
  if (role === "scout") return 0.85
  if (role === "guard") return 0.25
  return 0.5
}

export function createNest(width: number, height: number): Nest {
  return {
    x: width * 0.5,
    y: height * 0.82,
    r: Math.max(24, Math.min(36, width * 0.045)),
  }
}

export function seedFood(
  width: number,
  height: number,
  nest: Nest,
  count = 16
): FoodMote[] {
  const food: FoodMote[] = []
  let guard = 0
  while (food.length < count && guard < count * 30) {
    guard += 1
    const x = width * (0.08 + Math.random() * 0.84)
    const y = height * (0.06 + Math.random() * 0.58)
    if (Math.hypot(x - nest.x, y - nest.y) < nest.r + 90) continue
    let ok = true
    for (const existing of food) {
      if (Math.hypot(existing.x - x, existing.y - y) < 36) {
        ok = false
        break
      }
    }
    if (!ok) continue
    food.push({
      x,
      y,
      stock: 2 + Math.floor(Math.random() * 3),
      pulse: Math.random() * Math.PI * 2,
      claims: 0,
    })
  }
  return food
}

/** Prefer different motes per agent so the whole flock does not pile on one spot. */
export function preferredFood(
  agentId: number,
  x: number,
  y: number,
  food: FoodMote[],
  maxDist: number
): FoodMote | null {
  const candidates: { mote: FoodMote; dist: number; index: number }[] = []
  for (let i = 0; i < food.length; i++) {
    const mote = food[i]!
    if (mote.stock <= 0) continue
    if (mote.claims >= MAX_CLAIMS_PER_FOOD) continue
    const dist = Math.hypot(mote.x - x, mote.y - y)
    if (dist > maxDist) continue
    candidates.push({ mote, dist, index: i })
  }
  if (candidates.length === 0) return null
  candidates.sort((a, b) => a.dist - b.dist)
  const top = candidates.slice(0, Math.min(5, candidates.length))
  const pick = top[agentId % top.length]!
  return pick.mote
}

export function steerToward(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  strength: number
) {
  const dx = toX - fromX
  const dy = toY - fromY
  const mag = Math.hypot(dx, dy) || 0.0001
  return { x: (dx / mag) * strength, y: (dy / mag) * strength }
}

export function nestRepulsion(x: number, y: number, nest: Nest, strength: number) {
  const dx = x - nest.x
  const dy = y - nest.y
  const dist = Math.hypot(dx, dy) || 0.0001
  const zone = nest.r * 3.2
  if (dist > zone) return { x: 0, y: 0 }
  const falloff = 1 - dist / zone
  return {
    x: (dx / dist) * strength * falloff,
    y: (dy / dist) * strength * falloff,
  }
}

export function inNest(x: number, y: number, nest: Nest) {
  return Math.hypot(x - nest.x, y - nest.y) <= nest.r + 6
}

export function respawnMote(
  mote: FoodMote,
  width: number,
  height: number,
  nest: Nest
) {
  mote.claims = 0
  for (let i = 0; i < 16; i++) {
    const x = width * (0.08 + Math.random() * 0.84)
    const y = height * (0.06 + Math.random() * 0.58)
    if (Math.hypot(x - nest.x, y - nest.y) < nest.r + 90) continue
    mote.x = x
    mote.y = y
    mote.stock = 2 + Math.floor(Math.random() * 3)
    return
  }
  mote.stock = 3
}

export function scatterSpawn(
  width: number,
  height: number,
  nest: Nest,
  index: number,
  total: number
) {
  const ring = 0.18 + (index % 5) * 0.12
  const angle = (index / total) * Math.PI * 2 + (index % 3) * 0.4
  let x = width * 0.5 + Math.cos(angle) * width * ring
  let y = height * 0.38 + Math.sin(angle) * height * ring * 0.85
  x = Math.min(width * 0.92, Math.max(width * 0.08, x))
  y = Math.min(height * 0.72, Math.max(height * 0.08, y))
  if (Math.hypot(x - nest.x, y - nest.y) < nest.r + 50) {
    y = height * 0.25
  }
  return { x, y }
}
