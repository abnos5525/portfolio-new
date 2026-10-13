/** Ocean helpers — schooling fish, sharks, plankton food, reef landmark. */

export type Species = "fish" | "shark"

export type Reef = { x: number; y: number; r: number }

export type FoodMote = {
  x: number
  y: number
  stock: number
  pulse: number
}

export const FISH_COUNT = 86
export const SHARK_COUNT = 5
export const MAX_FOOD = 20

export function createReef(width: number, height: number): Reef {
  return {
    x: width * 0.5,
    y: height * 0.78,
    r: Math.max(26, Math.min(40, width * 0.048)),
  }
}

export function seedFood(
  width: number,
  height: number,
  reef: Reef,
  count = 16
): FoodMote[] {
  const food: FoodMote[] = []
  let guard = 0
  while (food.length < count && guard < count * 28) {
    guard += 1
    const x = width * (0.08 + Math.random() * 0.84)
    const y = height * (0.07 + Math.random() * 0.62)
    if (Math.hypot(x - reef.x, y - reef.y) < reef.r + 50) continue
    let ok = true
    for (const existing of food) {
      if (Math.hypot(existing.x - x, existing.y - y) < 32) {
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
    })
  }
  return food
}

export function preferredFood(
  agentId: number,
  x: number,
  y: number,
  food: FoodMote[],
  maxDist: number
): FoodMote | null {
  const candidates: { mote: FoodMote; dist: number }[] = []
  for (const mote of food) {
    if (mote.stock <= 0) continue
    const dist = Math.hypot(mote.x - x, mote.y - y)
    if (dist > maxDist) continue
    candidates.push({ mote, dist })
  }
  if (candidates.length === 0) return null
  candidates.sort((a, b) => a.dist - b.dist)
  const top = candidates.slice(0, Math.min(5, candidates.length))
  return top[agentId % top.length]!.mote
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

/** Lead the prey — simple pursuit prediction. */
export function steerIntercept(
  fromX: number,
  fromY: number,
  preyX: number,
  preyY: number,
  preyVx: number,
  preyVy: number,
  strength: number,
  lead = 11
) {
  return steerToward(
    fromX,
    fromY,
    preyX + preyVx * lead,
    preyY + preyVy * lead,
    strength
  )
}

export function reefRepulsion(x: number, y: number, reef: Reef, strength: number) {
  const dx = x - reef.x
  const dy = y - reef.y
  const dist = Math.hypot(dx, dy) || 0.0001
  const zone = reef.r * 2.4
  if (dist > zone) return { x: 0, y: 0 }
  const falloff = 1 - dist / zone
  return {
    x: (dx / dist) * strength * falloff,
    y: (dy / dist) * strength * falloff,
  }
}

export function inReef(x: number, y: number, reef: Reef) {
  return Math.hypot(x - reef.x, y - reef.y) <= reef.r + 4
}

export function respawnMote(
  mote: FoodMote,
  width: number,
  height: number,
  reef: Reef
) {
  for (let i = 0; i < 16; i++) {
    const x = width * (0.08 + Math.random() * 0.84)
    const y = height * (0.07 + Math.random() * 0.62)
    if (Math.hypot(x - reef.x, y - reef.y) < reef.r + 55) continue
    mote.x = x
    mote.y = y
    mote.stock = 2 + Math.floor(Math.random() * 3)
    return
  }
  mote.stock = 3
}

export function edgeSpawn(width: number, height: number, preferFar = false) {
  const side = Math.floor(Math.random() * 4)
  const pad = 24
  if (side === 0) return { x: pad + Math.random() * (width - pad * 2), y: pad }
  if (side === 1)
    return { x: pad + Math.random() * (width - pad * 2), y: height - pad }
  if (side === 2) return { x: pad, y: pad + Math.random() * (height - pad * 2) }
  return {
    x: width - pad,
    y: preferFar
      ? pad + Math.random() * (height * 0.45)
      : pad + Math.random() * (height - pad * 2),
  }
}

export function scatterSpawn(
  width: number,
  height: number,
  reef: Reef,
  index: number,
  total: number,
  species: Species
) {
  if (species === "shark") {
    const angle = (index / Math.max(1, SHARK_COUNT)) * Math.PI * 2
    return {
      x: width * 0.5 + Math.cos(angle) * width * 0.32,
      y: height * 0.28 + Math.sin(angle) * height * 0.18,
    }
  }
  const ring = 0.16 + (index % 6) * 0.1
  const angle = (index / total) * Math.PI * 2 + (index % 3) * 0.35
  let x = width * 0.5 + Math.cos(angle) * width * ring
  let y = height * 0.36 + Math.sin(angle) * height * ring * 0.8
  x = Math.min(width * 0.92, Math.max(width * 0.08, x))
  y = Math.min(height * 0.68, Math.max(height * 0.08, y))
  if (Math.hypot(x - reef.x, y - reef.y) < reef.r + 40) y = height * 0.22
  return { x, y }
}
