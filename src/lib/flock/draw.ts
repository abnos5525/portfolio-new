import type { FoodMote } from "@/lib/flock-colony"
import type { ScentField } from "@/lib/flock-mind"
import {
  FISH_HUNGER_AT,
  FOV,
  SHARK_HUNGER_AT,
  WALL_RADIUS,
} from "@/lib/flock/constants"
import {
  fishColor,
  hungerDrive,
  sharkColor,
} from "@/lib/flock/helpers"
import type { Agent, Mode, Obstacle, Ripple } from "@/lib/flock/types"

type DrawCtx = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  now: number
  accent: string
  food: FoodMote[]
  agents: Agent[]
  scent: ScentField
  obstacles: Obstacle[]
  ripples: Ripple[]
  pointer: { x: number; y: number; active: boolean; inside: boolean }
  mode: Mode
  trails: boolean
  sense: boolean
  order: number
  perception: number
}

export function drawOcean(frame: DrawCtx) {
  const {
    ctx,
    width,
    height,
    now,
    accent,
    food,
    agents,
    scent,
    obstacles,
    ripples,
    pointer,
    mode,
    trails,
    sense,
    order,
    perception,
  } = frame

  ctx.clearRect(0, 0, width, height)
  drawWash(ctx, width, height, accent, now, order)
  if (sense) drawScent(ctx, width, height, scent, accent)
  drawFood(ctx, food, accent)
  drawWalls(ctx, obstacles, accent)

  if ((mode === "wall" || mode === "feed") && pointer.inside) {
    ctx.beginPath()
    ctx.arc(pointer.x, pointer.y, mode === "wall" ? WALL_RADIUS : 8, 0, Math.PI * 2)
    ctx.strokeStyle = accent
    ctx.globalAlpha = 0.4
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i]!
    ripple.age += 16
    const t = ripple.age / ripple.life
    if (t >= 1) {
      ripples.splice(i, 1)
      continue
    }
    ctx.beginPath()
    ctx.arc(
      ripple.x,
      ripple.y,
      14 + t * (ripple.kind === "bite" ? 70 : 120),
      0,
      Math.PI * 2
    )
    ctx.strokeStyle = ripple.kind === "bite" ? "#fb7185" : accent
    ctx.globalAlpha = (1 - t) * 0.28
    ctx.lineWidth = 2 - t
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  if (pointer.active && mode !== "wall" && mode !== "feed") {
    const radius = mode === "scare" ? 120 : 90
    const g = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      radius
    )
    g.addColorStop(0, accent)
    g.addColorStop(1, "transparent")
    ctx.globalAlpha = 0.14
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  if (sense && pointer.inside) {
    let focus: Agent | null = null
    let best = Infinity
    for (const agent of agents) {
      if (!agent.alive) continue
      const d = Math.hypot(agent.x - pointer.x, agent.y - pointer.y)
      if (d < best) {
        best = d
        focus = agent
      }
    }
    if (focus) {
      const heading = Math.atan2(focus.vy, focus.vx)
      ctx.save()
      ctx.translate(focus.x, focus.y)
      ctx.rotate(heading)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, perception, -FOV / 2, FOV / 2)
      ctx.closePath()
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.07
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.globalAlpha = 0.3
      ctx.stroke()
      ctx.restore()
      ctx.globalAlpha = 1
    }
  }

  for (const agent of agents) {
    if (agent.species === "fish") drawAgent(ctx, agent, accent, trails)
  }
  for (const agent of agents) {
    if (agent.species === "shark") drawAgent(ctx, agent, accent, trails)
  }
}

function drawWash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  accent: string,
  now: number,
  order: number
) {
  const g = ctx.createLinearGradient(0, 0, 0, height)
  g.addColorStop(0, "transparent")
  g.addColorStop(1, accent)
  ctx.globalAlpha = 0.04 + order * 0.05
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = accent
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    const y = ((now / 40 + i * 90) % (height + 40)) - 20
    ctx.globalAlpha = 0.04
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= width; x += 28) {
      ctx.lineTo(x, y + Math.sin(x * 0.03 + now / 500 + i) * 4)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawScent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scent: ScentField,
  accent: string
) {
  const cellW = width / scent.cols
  const cellH = height / scent.rows
  for (let r = 0; r < scent.rows; r++) {
    for (let c = 0; c < scent.cols; c++) {
      const i = r * scent.cols + c
      const fear = scent.fear[i]!
      const foodS = scent.food[i]!
      const blood = scent.blood[i]!
      if (fear < 0.05 && foodS < 0.05 && blood < 0.05) continue
      const cx = c * cellW
      const cy = r * cellH
      if (blood > 0.05) {
        ctx.fillStyle = "#fb7185"
        ctx.globalAlpha = blood * 0.18
        ctx.fillRect(cx, cy, cellW + 0.5, cellH + 0.5)
      }
      if (fear > 0.05) {
        ctx.fillStyle = accent
        ctx.globalAlpha = fear * 0.1
        ctx.fillRect(cx, cy, cellW + 0.5, cellH + 0.5)
      }
      if (foodS > 0.05) {
        ctx.fillStyle = accent
        ctx.globalAlpha = foodS * 0.14
        ctx.beginPath()
        ctx.arc(
          cx + cellW * 0.5,
          cy + cellH * 0.5,
          Math.min(cellW, cellH) * 0.26,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }
  }
  ctx.globalAlpha = 1
}

function drawFood(
  ctx: CanvasRenderingContext2D,
  food: FoodMote[],
  accent: string
) {
  for (const mote of food) {
    if (mote.stock <= 0) continue
    mote.pulse += 0.06
    const radius = 3.2 + mote.stock * 1.2 + Math.sin(mote.pulse) * 0.7
    ctx.beginPath()
    ctx.arc(mote.x, mote.y, radius + 3, 0, Math.PI * 2)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.1
    ctx.fill()
    ctx.beginPath()
    ctx.arc(mote.x, mote.y, radius, 0, Math.PI * 2)
    ctx.globalAlpha = 0.8
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawWalls(
  ctx: CanvasRenderingContext2D,
  obstacles: Obstacle[],
  accent: string
) {
  for (const wallItem of obstacles) {
    ctx.beginPath()
    ctx.arc(wallItem.x, wallItem.y, wallItem.r, 0, Math.PI * 2)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.08
    ctx.fill()
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = accent
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawAgent(
  ctx: CanvasRenderingContext2D,
  agent: Agent,
  accent: string,
  trails: boolean
) {
  if (!agent.alive) return
  const angle = Math.atan2(agent.vy, agent.vx)
  const isShark = agent.species === "shark"
  const hunger = hungerDrive(
    agent.energy,
    isShark ? SHARK_HUNGER_AT : FISH_HUNGER_AT
  )
  const jaw = agent.jaw

  if (trails && agent.trail.length > 1) {
    ctx.lineCap = "round"
    ctx.lineWidth = isShark ? 2.1 : 1.1
    for (let i = 1; i < agent.trail.length; i++) {
      const a = agent.trail[i - 1]!
      const b = agent.trail[i]!
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = isShark
        ? sharkColor(agent.energy, hunger)
        : fishColor(agent.energy, agent.stress)
      ctx.globalAlpha = (i / agent.trail.length) * (isShark ? 0.35 : 0.26)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  ctx.save()
  ctx.translate(agent.x, agent.y)
  // Per-agent energy ring (behind body) — each creature has its own bar
  {
    const r = isShark ? 18 : 12
    ctx.beginPath()
    ctx.arc(0, 0, r, -Math.PI * 0.75, -Math.PI * 0.75 + Math.PI * 1.5)
    ctx.strokeStyle = "rgba(148,163,184,0.18)"
    ctx.lineWidth = isShark ? 2 : 1.4
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(
      0,
      0,
      r,
      -Math.PI * 0.75,
      -Math.PI * 0.75 + Math.PI * 1.5 * Math.max(0, Math.min(1, agent.energy))
    )
    ctx.strokeStyle = isShark
      ? hunger > 0.35
        ? "rgba(248,113,113,0.7)"
        : "rgba(148,163,184,0.55)"
      : agent.energy < 0.4
        ? "rgba(251,191,36,0.65)"
        : "rgba(56,189,248,0.55)"
    ctx.lineWidth = isShark ? 2 : 1.4
    ctx.lineCap = "round"
    ctx.stroke()
  }
  ctx.rotate(angle)
  if (isShark) {
    const body = sharkColor(agent.energy, hunger)
    ctx.beginPath()
    ctx.moveTo(24, 0)
    ctx.lineTo(-14, 9.5)
    ctx.lineTo(-8, 0)
    ctx.lineTo(-14, -9.5)
    ctx.closePath()
    ctx.fillStyle = body
    ctx.globalAlpha = 0.95
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(2, 0)
    ctx.lineTo(-5, -16)
    ctx.lineTo(-11, 0)
    ctx.closePath()
    ctx.globalAlpha = 0.78
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(10, 1.5)
    ctx.lineTo(22, 2 + jaw * 7)
    ctx.lineTo(4, 7 + jaw * 2)
    ctx.closePath()
    ctx.globalAlpha = 0.9
    ctx.fill()
    if (jaw > 0.15) {
      ctx.beginPath()
      ctx.moveTo(12, 0.5)
      ctx.lineTo(20, 1.5 + jaw * 5)
      ctx.lineTo(8, 4)
      ctx.closePath()
      ctx.fillStyle = "#1a0a0a"
      ctx.globalAlpha = 0.55 * jaw
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(14, -2.2, 1.7, 0, Math.PI * 2)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.9
    ctx.fill()
  } else {
    const color = fishColor(agent.energy, agent.stress)
    ctx.beginPath()
    ctx.ellipse(0, 0, 9, 4.2, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.92
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-8, 0)
    ctx.lineTo(-14, 4)
    ctx.lineTo(-12, 0)
    ctx.lineTo(-14, -4)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(6, -1.2 - jaw * 1.2)
    ctx.lineTo(11 + jaw * 2, 0)
    ctx.lineTo(6, 1.2 + jaw * 1.2)
    ctx.closePath()
    ctx.fill()
    if (jaw > 0.2) {
      ctx.beginPath()
      ctx.moveTo(7, -0.4)
      ctx.lineTo(10 + jaw, 0)
      ctx.lineTo(7, 0.4 + jaw * 0.8)
      ctx.closePath()
      ctx.fillStyle = "#0c1a22"
      ctx.globalAlpha = 0.5 * jaw
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(4, -1, 1.1, 0, Math.PI * 2)
    ctx.fillStyle = "#0f172a"
    ctx.globalAlpha = 0.7
    ctx.fill()
  }
  ctx.restore()
  ctx.globalAlpha = 1
}
