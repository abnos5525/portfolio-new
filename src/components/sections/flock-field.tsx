"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  assignRole,
  createNest,
  inNest,
  MAX_SEEKERS,
  nestRepulsion,
  preferredFood,
  respawnMote,
  roleBias,
  scatterSpawn,
  seedFood,
  steerToward,
  type ColonyRole,
  type FoodMote,
  type Nest,
  type WorkPhase,
} from "@/lib/flock-colony"
import { ScentField, TinyMind, TOPO_K } from "@/lib/flock-mind"
import { cn } from "@/lib/utils"

type Mode = "attract" | "scare" | "wall" | "feed"
type Preset = "murmur" | "school" | "scatter"
type RuleFocus = "sep" | "ali" | "coh" | null

type Props = {
  eyebrow: string
  title: string
  support: string
  hint: string
  whyLabel: string
  whyBody: string
  modeLabel: string
  presetLabel: string
  attract: string
  scare: string
  wall: string
  feed: string
  murmur: string
  school: string
  scatter: string
  trails: string
  sense: string
  mind: string
  work: string
  clearWalls: string
  agentsLabel: string
  orderLabel: string
  wallsLabel: string
  seeingLabel: string
  alertLabel: string
  harvestLabel: string
  workingLabel: string
  foodLabel: string
  sepTitle: string
  sepBody: string
  aliTitle: string
  aliBody: string
  cohTitle: string
  cohBody: string
  rulesHint: string
}

type Boid = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  stress: number
  curiosity: number
  grit: number
  role: ColonyRole
  phase: WorkPhase
  cargo: number
  cooldown: number
  claimed: FoodMote | null
  mind: TinyMind
  trail: { x: number; y: number }[]
}

type Obstacle = { x: number; y: number; r: number }
type Ripple = { x: number; y: number; age: number; life: number; kind: "attract" | "scare" }
type Rules = { sep: number; ali: number; coh: number; perception: number; speed: number }

const COUNT = 96
const MAX_FORCE = 0.072
const MIN_SPEED = 1.1
const WALL_RADIUS = 30
const MAX_WALLS = 10
const MAX_FOOD = 18
const FOV = (220 * Math.PI) / 180

const PRESETS: Record<Preset, Rules> = {
  murmur: { sep: 1.45, ali: 1.25, coh: 0.85, perception: 68, speed: 2.45 },
  school: { sep: 1.55, ali: 1.4, coh: 1.25, perception: 74, speed: 2.15 },
  scatter: { sep: 2.35, ali: 0.28, coh: 0.18, perception: 52, speed: 2.85 },
}

function cssVar(name: string, fallback: string) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  )
}

function limit(x: number, y: number, max: number) {
  const mag = Math.hypot(x, y) || 0.0001
  if (mag <= max) return { x, y }
  const s = max / mag
  return { x: x * s, y: y * s }
}

function headingColor(angle: number, accentHue: number, stress: number, role: ColonyRole) {
  const roleShift = role === "scout" ? 28 : role === "guard" ? -22 : 0
  const hue = ((angle * 180) / Math.PI + 360 + accentHue + stress * 36 + roleShift) % 360
  const light = 57 + (1 - stress) * 9
  return `hsl(${hue.toFixed(0)} ${64 + stress * 10}% ${light}%)`
}

function inFov(boid: Boid, dx: number, dy: number) {
  const heading = Math.atan2(boid.vy, boid.vx)
  const toOther = Math.atan2(dy, dx)
  let delta = toOther - heading
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return Math.abs(delta) <= FOV / 2
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "focus-visible:ring-ring min-h-9 flex-1 rounded-md px-3 text-xs focus-visible:ring-2 focus-visible:outline-none sm:flex-none",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

export function FlockField({
  eyebrow,
  title,
  support,
  hint,
  whyLabel,
  whyBody,
  modeLabel,
  presetLabel,
  attract,
  scare,
  wall,
  feed,
  murmur,
  school,
  scatter,
  trails: trailsLabel,
  sense: senseLabel,
  mind: mindLabel,
  work: workLabel,
  clearWalls,
  agentsLabel,
  orderLabel,
  wallsLabel,
  seeingLabel,
  alertLabel,
  harvestLabel,
  workingLabel,
  foodLabel,
  sepTitle,
  sepBody,
  aliTitle,
  aliBody,
  cohTitle,
  cohBody,
  rulesHint,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>("attract")
  const [preset, setPreset] = useState<Preset>("murmur")
  const [trailsOn, setTrailsOn] = useState(true)
  const [senseOn, setSenseOn] = useState(true)
  const [mindOn, setMindOn] = useState(true)
  const [workOn, setWorkOn] = useState(true)
  const [ruleFocus, setRuleFocus] = useState<RuleFocus>(null)
  const [stats, setStats] = useState({
    order: 0,
    walls: 0,
    seeing: 0,
    alert: 0,
    harvested: 0,
    working: 0,
    food: 0,
  })

  const modeRef = useRef(mode)
  const rulesRef = useRef(PRESETS.murmur)
  const trailsRef = useRef(true)
  const senseRef = useRef(true)
  const mindRef = useRef(true)
  const workRef = useRef(true)
  const focusRef = useRef<RuleFocus>(null)
  const obstaclesRef = useRef<Obstacle[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const scentRef = useRef(new ScentField(32, 18))
  const harvestedRef = useRef(0)
  const clearSignal = useRef(0)
  const [clearTick, setClearTick] = useState(0)
  const statsClock = useRef(0)
  const rippleClock = useRef(0)
  const learnClock = useRef(0)
  const orderLive = useRef(0)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])
  useEffect(() => {
    rulesRef.current = PRESETS[preset]
  }, [preset])
  useEffect(() => {
    trailsRef.current = trailsOn
  }, [trailsOn])
  useEffect(() => {
    senseRef.current = senseOn
  }, [senseOn])
  useEffect(() => {
    mindRef.current = mindOn
  }, [mindOn])
  useEffect(() => {
    workRef.current = workOn
  }, [workOn])
  useEffect(() => {
    focusRef.current = ruleFocus
  }, [ruleFocus])
  useEffect(() => {
    clearSignal.current = clearTick
  }, [clearTick])

  const modeOptions = useMemo(
    () =>
      [
        { id: "attract" as const, label: attract },
        { id: "scare" as const, label: scare },
        { id: "wall" as const, label: wall },
        { id: "feed" as const, label: feed },
      ] as const,
    [attract, scare, wall, feed]
  )

  const presetOptions = useMemo(
    () =>
      [
        { id: "murmur" as const, label: murmur },
        { id: "school" as const, label: school },
        { id: "scatter" as const, label: scatter },
      ] as const,
    [murmur, school, scatter]
  )

  const ruleCards = useMemo(
    () =>
      [
        { id: "sep" as const, title: sepTitle, body: sepBody },
        { id: "ali" as const, title: aliTitle, body: aliBody },
        { id: "coh" as const, title: cohTitle, body: cohBody },
      ] as const,
    [sepTitle, sepBody, aliTitle, aliBody, cohTitle, cohBody]
  )

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let alive = true
    let seeded = false
    let lastClear = clearSignal.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pointer = { x: 0, y: 0, active: false, inside: false }
    let accentHue = 170
    const scent = scentRef.current
    let nest: Nest = { x: 0, y: 0, r: 36 }
    let food: FoodMote[] = []

    const boids: Boid[] = Array.from({ length: COUNT }, (_, i) => {
      const curiosity = 0.2 + Math.random() * 0.75
      const grit = 0.15 + Math.random() * 0.8
      return {
        id: i,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 1.9,
        vy: (Math.random() - 0.5) * 1.9,
        energy: 0.55 + Math.random() * 0.4,
        stress: Math.random() * 0.12,
        curiosity,
        grit,
        role: assignRole(curiosity, grit),
        phase: "flock" as WorkPhase,
        cargo: 0,
        cooldown: 0,
        claimed: null,
        mind: new TinyMind(1200 + i * 91),
        trail: [],
      }
    })

    const distBuf: { boid: Boid; dist: number }[] = []
    let seekerCount = 0

    const readAccentHue = () => {
      const accent = cssVar("--primary", "#5eead4")
      const probe = document.createElement("div")
      probe.style.color = accent
      document.body.appendChild(probe)
      const rgb = getComputedStyle(probe).color
      document.body.removeChild(probe)
      const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/)
      if (!match) return
      const r = Number(match[1]) / 255
      const g = Number(match[2]) / 255
      const b = Number(match[3]) / 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const d = max - min
      if (d === 0) {
        accentHue = 170
        return
      }
      let h = 0
      if (max === r) h = ((g - b) / d) % 6
      else if (max === g) h = (b - r) / d + 2
      else h = (r - g) / d + 4
      accentHue = Math.round(h * 60)
      if (accentHue < 0) accentHue += 360
    }

    const resize = () => {
      width = wrap.clientWidth
      height = Math.max(420, Math.min(600, width * 0.58))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scent.resize(width, height)
      nest = createNest(width, height)
      if (!seeded) {
        for (const boid of boids) {
          const spot = scatterSpawn(width, height, nest, boid.id, COUNT)
          boid.x = spot.x
          boid.y = spot.y
        }
        food = seedFood(width, height, nest, 16)
        seeded = true
      }
    }

    const effectiveRules = () => {
      const base = rulesRef.current
      const focus = focusRef.current
      if (!focus) return base
      return {
        ...base,
        sep: focus === "sep" ? base.sep * 2.5 : base.sep * 0.32,
        ali: focus === "ali" ? base.ali * 2.5 : base.ali * 0.32,
        coh: focus === "coh" ? base.coh * 2.5 : base.coh * 0.32,
      }
    }

    const nearestToPointer = () => {
      let best: Boid | null = null
      let bestDist = Infinity
      for (const boid of boids) {
        const dist = Math.hypot(boid.x - pointer.x, boid.y - pointer.y)
        if (dist < bestDist) {
          bestDist = dist
          best = boid
        }
      }
      return best
    }

    const topoNeighbors = (boid: Boid, perception: number) => {
      distBuf.length = 0
      for (const other of boids) {
        if (other === boid) continue
        const dx = other.x - boid.x
        const dy = other.y - boid.y
        const dist = Math.hypot(dx, dy)
        if (dist === 0 || dist > perception * 1.35) continue
        const close = dist < perception * 0.35
        if (!close && !inFov(boid, dx, dy)) continue
        distBuf.push({ boid: other, dist })
      }
      distBuf.sort((a, b) => a.dist - b.dist)
      return distBuf.slice(0, TOPO_K)
    }

    const releaseClaim = (boid: Boid) => {
      if (boid.claimed) {
        boid.claimed.claims = Math.max(0, boid.claimed.claims - 1)
        boid.claimed = null
      }
    }

    const steer = (boid: Boid) => {
      const rules = effectiveRules()
      const neighbors = topoNeighbors(boid, rules.perception)
      let alignX = 0
      let alignY = 0
      let cohX = 0
      let cohY = 0
      let sepX = 0
      let sepY = 0
      let alignScore = 0

      for (const { boid: other, dist } of neighbors) {
        alignX += other.vx
        alignY += other.vy
        cohX += other.x
        cohY += other.y
        const hard = dist < 26 ? 2.8 : 1
        const push = Math.max(0, 1 - dist / (rules.perception * 0.42))
        sepX += ((boid.x - other.x) / dist) * (1 + push) * hard
        sepY += ((boid.y - other.y) / dist) * (1 + push) * hard
        const mag =
          Math.hypot(boid.vx, boid.vy) * Math.hypot(other.vx, other.vy) || 1
        alignScore += (boid.vx * other.vx + boid.vy * other.vy) / mag
      }

      const total = neighbors.length
      const density = total / TOPO_K
      const localAlign = total > 0 ? (alignScore / total + 1) / 2 : 0.5
      const scentSample = scent.sample(boid.x, boid.y)
      const pointerThreat =
        pointer.active && modeRef.current === "scare"
          ? Math.max(
              0,
              1 - Math.hypot(pointer.x - boid.x, pointer.y - boid.y) / 240
            )
          : 0
      const threat = Math.min(1, scentSample.fear * 0.85 + pointerThreat)

      if (boid.cooldown > 0) boid.cooldown -= 1

      const foodTarget =
        boid.claimed && boid.claimed.stock > 0
          ? boid.claimed
          : preferredFood(
              boid.id,
              boid.x,
              boid.y,
              food,
              rules.perception * (boid.role === "scout" ? 2.8 : 2.1)
            )
      const foodDist = foodTarget
        ? Math.hypot(foodTarget.x - boid.x, foodTarget.y - boid.y)
        : 9999
      const nestDist = Math.hypot(nest.x - boid.x, nest.y - boid.y)
      const foodNear = foodTarget
        ? Math.max(0, 1 - foodDist / (rules.perception * 2.4))
        : 0
      const nestNear = Math.max(
        0,
        1 - nestDist / (Math.max(width, height) * 0.55)
      )

      boid.stress += (threat - boid.stress) * 0.08
      boid.energy +=
        (0.7 -
          density * 0.28 -
          boid.stress * 0.3 +
          (boid.cargo > 0 ? -0.03 : 0.02) -
          boid.energy) *
        0.04
      boid.energy = Math.max(0.12, Math.min(1, boid.energy))

      let mindMods = { sep: 1, ali: 1, coh: 1, work: 0.45, explore: 0.5 }
      if (mindRef.current) {
        mindMods = boid.mind.think({
          density,
          threat,
          energy: boid.energy,
          align: localAlign,
          cargo: boid.cargo > 0 ? 1 : 0,
          foodNear,
          nestNear,
          roleBias: roleBias(boid.role),
        })
      }

      if (workRef.current) {
        if (boid.cargo > 0) {
          boid.phase = "carry"
        } else if (boid.cooldown > 0) {
          boid.phase = "flock"
          releaseClaim(boid)
        } else if (boid.role === "guard" && threat > 0.55) {
          boid.phase = "guard"
          releaseClaim(boid)
        } else if (
          (boid.role === "forager" || boid.role === "scout") &&
          (mindMods.work > 0.52 || foodNear > 0.55) &&
          boid.energy > 0.35 &&
          foodTarget &&
          seekerCount < MAX_SEEKERS
        ) {
          if (boid.phase !== "seek") seekerCount += 1
          boid.phase = "seek"
          if (boid.claimed !== foodTarget) {
            releaseClaim(boid)
            foodTarget.claims += 1
            boid.claimed = foodTarget
          }
        } else {
          if (boid.phase === "seek") {
            seekerCount = Math.max(0, seekerCount - 1)
          }
          boid.phase = "flock"
          releaseClaim(boid)
        }

        if (
          boid.phase === "seek" &&
          foodTarget &&
          foodDist < 13 &&
          foodTarget.stock > 0
        ) {
          foodTarget.stock -= 1
          releaseClaim(boid)
          if (boid.phase === "seek") {
            seekerCount = Math.max(0, seekerCount - 1)
          }
          boid.cargo = 1
          boid.phase = "carry"
          boid.energy = Math.min(1, boid.energy + 0.1)
          scent.deposit(foodTarget.x, foodTarget.y, "food", 0.55)
          if (foodTarget.stock <= 0) {
            respawnMote(foodTarget, width, height, nest)
          }
        }

        if (boid.phase === "carry" && inNest(boid.x, boid.y, nest)) {
          boid.cargo = 0
          harvestedRef.current += 1
          boid.energy = Math.min(1, boid.energy + 0.14)
          scent.deposit(nest.x, nest.y, "home", 0.28)
          boid.phase = "flock"
          boid.cooldown = 70 + (boid.id % 50)
          boid.mind.learn(0.8)
          const kick = nestRepulsion(boid.x, boid.y, nest, MAX_FORCE * 3.5)
          boid.vx += kick.x
          boid.vy += kick.y
        }
      } else {
        if (boid.phase === "seek") {
          seekerCount = Math.max(0, seekerCount - 1)
        }
        boid.phase = "flock"
        releaseClaim(boid)
      }

      let fx = 0
      let fy = 0
      if (total > 0) {
        const align = limit(
          alignX / total - boid.vx,
          alignY / total - boid.vy,
          MAX_FORCE
        )
        const coh = limit(
          cohX / total - boid.x,
          cohY / total - boid.y,
          MAX_FORCE
        )
        const sep = limit(sepX, sepY, MAX_FORCE * 1.35)
        const crowd = 1 + density * 0.55
        const workSoft =
          boid.phase === "carry" || boid.phase === "seek" ? 0.55 : 1
        fx +=
          align.x * rules.ali * mindMods.ali * workSoft +
          coh.x * rules.coh * mindMods.coh * workSoft * 0.85 +
          sep.x * rules.sep * mindMods.sep * crowd
        fy +=
          align.y * rules.ali * mindMods.ali * workSoft +
          coh.y * rules.coh * mindMods.coh * workSoft * 0.85 +
          sep.y * rules.sep * mindMods.sep * crowd
      }

      const fearGrad = scent.gradient(boid.x, boid.y, "fear")
      fx += -fearGrad.x * (0.5 + boid.stress)
      fy += -fearGrad.y * (0.5 + boid.stress)

      if (boid.phase === "flock" || boid.cooldown > 0) {
        const away = nestRepulsion(boid.x, boid.y, nest, MAX_FORCE * 1.6)
        fx += away.x
        fy += away.y
      }

      if (workRef.current) {
        const foodGrad = scent.gradient(boid.x, boid.y, "food")
        const homeGrad = scent.gradient(boid.x, boid.y, "home")

        if (boid.phase === "seek") {
          const pull = foodTarget
            ? steerToward(
                boid.x,
                boid.y,
                foodTarget.x,
                foodTarget.y,
                MAX_FORCE * (0.75 + mindMods.work * 0.45)
              )
            : { x: foodGrad.x * 0.7, y: foodGrad.y * 0.7 }
          fx += pull.x + foodGrad.x * 0.45
          fy += pull.y + foodGrad.y * 0.45
          if (boid.role === "scout") {
            fx += (Math.random() - 0.5) * MAX_FORCE * (0.85 + mindMods.explore)
            fy += (Math.random() - 0.5) * MAX_FORCE * (0.85 + mindMods.explore)
          }
        }

        if (boid.phase === "carry") {
          const home = steerToward(
            boid.x,
            boid.y,
            nest.x,
            nest.y,
            MAX_FORCE * (0.9 + mindMods.work * 0.35)
          )
          fx += home.x + homeGrad.x * 0.55
          fy += home.y + homeGrad.y * 0.55
          if (Math.random() < 0.22) {
            scent.deposit(boid.x, boid.y, "food", 0.12)
          }
        }

        if (boid.phase === "guard") {
          const orbitAngle =
            performance.now() / 900 + boid.grit * 6 + boid.id * 0.7
          const orbit = steerToward(
            boid.x,
            boid.y,
            nest.x + Math.cos(orbitAngle) * (nest.r + 54 + (boid.id % 5) * 8),
            nest.y + Math.sin(orbitAngle) * (nest.r + 40 + (boid.id % 4) * 6),
            MAX_FORCE * 0.95
          )
          fx += orbit.x
          fy += orbit.y
        }
      }

      const modeNow = modeRef.current
      if (pointer.active && modeNow !== "wall" && modeNow !== "feed") {
        const dx = pointer.x - boid.x
        const dy = pointer.y - boid.y
        const dist = Math.hypot(dx, dy) || 1
        const reach = modeNow === "scare" ? 235 : 195
        if (dist < reach) {
          const dir = modeNow === "scare" ? -1 : 1
          const pull = limit((dx / dist) * dir, (dy / dist) * dir, MAX_FORCE * 2.6)
          const falloff = 1 - dist / reach
          const amp =
            modeNow === "scare"
              ? 1.35 + falloff * 1.6 + boid.stress * 0.45
              : 0.8 + falloff * 1.25 + boid.curiosity * 0.3
          fx += pull.x * amp
          fy += pull.y * amp
        }
      }

      for (const wallItem of obstaclesRef.current) {
        const dx = boid.x - wallItem.x
        const dy = boid.y - wallItem.y
        const dist = Math.hypot(dx, dy) || 0.0001
        const safe = wallItem.r + 22
        if (dist < safe) {
          const push = limit(dx / dist, dy / dist, MAX_FORCE * 3.4)
          const strength = (1 - dist / safe) * 2.6
          fx += push.x * strength
          fy += push.y * strength
          if (dist < wallItem.r + 4) {
            boid.x = wallItem.x + (dx / dist) * (wallItem.r + 7)
            boid.y = wallItem.y + (dy / dist) * (wallItem.r + 7)
          }
        }
      }

      boid.vx += fx
      boid.vy += fy
      const maxSpeed =
        rules.speed *
        (0.72 + boid.energy * 0.4) *
        (boid.phase === "carry" ? 0.88 : boid.role === "scout" ? 1.08 : 1)
      let capped = limit(boid.vx, boid.vy, maxSpeed)
      const mag = Math.hypot(capped.x, capped.y) || 0.0001
      if (mag < MIN_SPEED) {
        const s = MIN_SPEED / mag
        capped = { x: capped.x * s, y: capped.y * s }
      }
      boid.vx = capped.x
      boid.vy = capped.y
      boid.x += boid.vx
      boid.y += boid.vy

      if (trailsRef.current) {
        boid.trail.push({ x: boid.x, y: boid.y })
        if (boid.trail.length > 16) boid.trail.shift()
      } else if (boid.trail.length) {
        boid.trail.length = 0
      }

      if (boid.x < -18) boid.x = width + 18
      if (boid.x > width + 18) boid.x = -18
      if (boid.y < -18) boid.y = height + 18
      if (boid.y > height + 18) boid.y = -18
    }

    const drawAwareness = (accent: string) => {
      if (!senseRef.current || !pointer.inside) return
      const focus = nearestToPointer()
      if (!focus) return
      const rules = effectiveRules()
      const neighbors = topoNeighbors(focus, rules.perception)
      const heading = Math.atan2(focus.vy, focus.vx)

      ctx.save()
      ctx.translate(focus.x, focus.y)
      ctx.rotate(heading)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, rules.perception, -FOV / 2, FOV / 2)
      ctx.closePath()
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.07
      ctx.fill()
      ctx.globalAlpha = 0.28
      ctx.strokeStyle = accent
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()

      for (const { boid: other } of neighbors) {
        ctx.beginPath()
        ctx.moveTo(focus.x, focus.y)
        ctx.lineTo(other.x, other.y)
        ctx.strokeStyle = accent
        ctx.globalAlpha = 0.22
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(focus.x, focus.y, 12, 0, Math.PI * 2)
      ctx.strokeStyle = accent
      ctx.globalAlpha = 0.75
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const drawScent = (accent: string) => {
      if (!senseRef.current) return
      const cellW = width / scent.cols
      const cellH = height / scent.rows
      for (let r = 0; r < scent.rows; r++) {
        for (let c = 0; c < scent.cols; c++) {
          const i = r * scent.cols + c
          const fear = scent.fear[i]!
          const foodS = scent.food[i]!
          const home = scent.home[i]!
          if (fear < 0.05 && foodS < 0.05 && home < 0.05) continue
          const cx = c * cellW
          const cy = r * cellH
          if (fear > 0.05) {
            ctx.fillStyle = accent
            ctx.globalAlpha = fear * 0.12
            ctx.fillRect(cx, cy, cellW + 0.5, cellH + 0.5)
          }
          if (foodS > 0.05) {
            ctx.fillStyle = accent
            ctx.globalAlpha = foodS * 0.16
            ctx.beginPath()
            ctx.arc(cx + cellW * 0.5, cy + cellH * 0.5, Math.min(cellW, cellH) * 0.28, 0, Math.PI * 2)
            ctx.fill()
          }
          if (home > 0.05) {
            ctx.strokeStyle = accent
            ctx.globalAlpha = home * 0.2
            ctx.strokeRect(cx + 1, cy + 1, cellW - 2, cellH - 2)
          }
        }
      }
      ctx.globalAlpha = 1
    }

    const draw = (now: number) => {
      const accent = cssVar("--primary", "#5eead4")
      ctx.clearRect(0, 0, width, height)

      const vitality = 0.03 + orderLive.current * 0.09
      const wash = ctx.createRadialGradient(
        nest.x,
        nest.y,
        20,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.7
      )
      wash.addColorStop(0, accent)
      wash.addColorStop(1, "transparent")
      ctx.globalAlpha = vitality
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1

      drawScent(accent)

      if (workRef.current) {
        ctx.beginPath()
        ctx.arc(nest.x, nest.y, nest.r, 0, Math.PI * 2)
        ctx.fillStyle = accent
        ctx.globalAlpha = 0.08
        ctx.fill()
        ctx.globalAlpha = 0.55
        ctx.strokeStyle = accent
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(nest.x, nest.y, nest.r * 0.35, 0, Math.PI * 2)
        ctx.globalAlpha = 0.35
        ctx.fill()
        ctx.globalAlpha = 1

        for (const mote of food) {
          if (mote.stock <= 0) continue
          mote.pulse += 0.05
          const radius = 4 + mote.stock * 1.4 + Math.sin(mote.pulse) * 0.8
          ctx.beginPath()
          ctx.arc(mote.x, mote.y, radius + 4, 0, Math.PI * 2)
          ctx.fillStyle = accent
          ctx.globalAlpha = 0.12
          ctx.fill()
          ctx.beginPath()
          ctx.arc(mote.x, mote.y, radius, 0, Math.PI * 2)
          ctx.globalAlpha = 0.85
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      for (const wallItem of obstaclesRef.current) {
        ctx.beginPath()
        ctx.arc(wallItem.x, wallItem.y, wallItem.r, 0, Math.PI * 2)
        ctx.fillStyle = accent
        ctx.globalAlpha = 0.09
        ctx.fill()
        ctx.globalAlpha = 0.55
        ctx.strokeStyle = accent
        ctx.lineWidth = 1.6
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      if ((modeRef.current === "wall" || modeRef.current === "feed") && pointer.inside) {
        ctx.beginPath()
        ctx.arc(
          pointer.x,
          pointer.y,
          modeRef.current === "wall" ? WALL_RADIUS : 8,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = accent
        ctx.globalAlpha = 0.4
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i]!
        ripple.age += 16
        const t = ripple.age / ripple.life
        if (t >= 1) {
          ripplesRef.current.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(
          ripple.x,
          ripple.y,
          18 + t * (ripple.kind === "scare" ? 150 : 110),
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = accent
        ctx.globalAlpha = (1 - t) * 0.24
        ctx.lineWidth = 2 - t
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      if (pointer.active && modeRef.current !== "wall" && modeRef.current !== "feed") {
        const radius = modeRef.current === "scare" ? 124 : 94
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
        ctx.globalAlpha = modeRef.current === "scare" ? 0.18 : 0.13
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      drawAwareness(accent)

      if (trailsRef.current) {
        ctx.lineWidth = 1.15
        ctx.lineCap = "round"
        for (const boid of boids) {
          if (boid.trail.length < 2) continue
          const angle = Math.atan2(boid.vy, boid.vx)
          for (let i = 1; i < boid.trail.length; i++) {
            const a = boid.trail[i - 1]!
            const b = boid.trail[i]!
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = headingColor(angle, accentHue, boid.stress, boid.role)
            ctx.globalAlpha = (i / boid.trail.length) * 0.28
            ctx.stroke()
          }
        }
        ctx.globalAlpha = 1
      }

      for (const boid of boids) {
        const angle = Math.atan2(boid.vy, boid.vx)
        const color = headingColor(angle, accentHue, boid.stress, boid.role)
        ctx.beginPath()
        ctx.arc(boid.x, boid.y, 6 + boid.energy * 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = 0.1 + boid.energy * 0.07
        ctx.fill()

        ctx.save()
        ctx.translate(boid.x, boid.y)
        ctx.rotate(angle)
        ctx.beginPath()
        if (boid.role === "guard") {
          ctx.moveTo(8, 0)
          ctx.lineTo(-5, 4.5)
          ctx.lineTo(-5, -4.5)
        } else if (boid.role === "scout") {
          ctx.moveTo(10, 0)
          ctx.lineTo(-5, 3.2)
          ctx.lineTo(-3, 0)
          ctx.lineTo(-5, -3.2)
        } else {
          ctx.moveTo(9, 0)
          ctx.lineTo(-6, 3.8)
          ctx.lineTo(-4, 0)
          ctx.lineTo(-6, -3.8)
        }
        ctx.closePath()
        ctx.fillStyle = color
        ctx.globalAlpha = 0.94
        ctx.fill()
        ctx.restore()

        if (boid.cargo > 0) {
          ctx.beginPath()
          ctx.arc(boid.x + Math.cos(angle) * -8, boid.y + Math.sin(angle) * -8, 3.2, 0, Math.PI * 2)
          ctx.fillStyle = accent
          ctx.globalAlpha = 0.9
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      if (!alive) return
      try {
        if (clearSignal.current !== lastClear) {
          obstaclesRef.current = []
          scent.clear()
          lastClear = clearSignal.current
        }
        if (!reduce) {
          seekerCount = 0
          for (const boid of boids) {
            if (boid.phase === "seek") seekerCount += 1
          }
          for (const boid of boids) steer(boid)
          scent.decay(0.972)

          if (
            pointer.active &&
            modeRef.current !== "wall" &&
            modeRef.current !== "feed" &&
            now - rippleClock.current > 260
          ) {
            rippleClock.current = now
            const kind = modeRef.current === "scare" ? "scare" : "attract"
            ripplesRef.current.push({
              x: pointer.x,
              y: pointer.y,
              age: 0,
              life: 700,
              kind,
            })
            scent.deposit(
              pointer.x,
              pointer.y,
              kind === "scare" ? "fear" : "food",
              kind === "scare" ? 0.6 : 0.35
            )
            if (ripplesRef.current.length > 8) ripplesRef.current.shift()
          }

          if (mindRef.current && now - learnClock.current > 400) {
            learnClock.current = now
            for (let i = 0; i < boids.length; i += 3) {
              const boid = boids[i]!
              const workBonus =
                boid.phase === "carry"
                  ? 0.25
                  : boid.phase === "seek"
                    ? 0.1
                    : 0
              const reward =
                boid.energy * 0.4 +
                (1 - boid.stress) * 0.25 +
                orderLive.current * 0.15 +
                workBonus -
                0.35
              boid.mind.learn(reward)
            }
          }

          if (now - statsClock.current > 180) {
            statsClock.current = now
            let sx = 0
            let sy = 0
            let alert = 0
            let working = 0
            let foodLeft = 0
            for (const boid of boids) {
              const mag = Math.hypot(boid.vx, boid.vy) || 1
              sx += boid.vx / mag
              sy += boid.vy / mag
              if (boid.stress > 0.45) alert += 1
              if (boid.phase === "seek" || boid.phase === "carry" || boid.phase === "guard") {
                working += 1
              }
            }
            for (const mote of food) foodLeft += mote.stock
            const order = Math.hypot(sx, sy) / boids.length
            orderLive.current = order
            let seeing = 0
            if (senseRef.current && pointer.inside) {
              const focus = nearestToPointer()
              if (focus) {
                seeing = topoNeighbors(focus, effectiveRules().perception).length
              }
            }
            setStats({
              order: order * 100,
              walls: obstaclesRef.current.length,
              seeing,
              alert: Math.round((alert / boids.length) * 100),
              harvested: harvestedRef.current,
              working,
              food: foodLeft,
            })
          }
        }
        draw(now)
      } finally {
        raf = window.requestAnimationFrame(loop)
      }
    }

    const localPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const onMove = (event: PointerEvent) => {
      const point = localPoint(event)
      pointer.x = point.x
      pointer.y = point.y
      pointer.inside = true
      pointer.active =
        modeRef.current !== "wall" && modeRef.current !== "feed"
    }

    const onLeave = () => {
      pointer.active = false
      pointer.inside = false
    }

    const onDown = (event: PointerEvent) => {
      const point = localPoint(event)
      pointer.x = point.x
      pointer.y = point.y
      pointer.inside = true

      if (modeRef.current === "feed") {
        if (food.length < MAX_FOOD) {
          food.push({
            x: point.x,
            y: point.y,
            stock: 3,
            pulse: Math.random() * Math.PI * 2,
            claims: 0,
          })
        } else {
          const mote = food[Math.floor(Math.random() * food.length)]!
          mote.x = point.x
          mote.y = point.y
          mote.stock = 3
          mote.claims = 0
        }
        scent.deposit(point.x, point.y, "food", 0.8)
        pointer.active = false
        return
      }

      if (modeRef.current === "wall") {
        const hit = obstaclesRef.current.findIndex(
          (wallItem) =>
            Math.hypot(wallItem.x - point.x, wallItem.y - point.y) <=
            wallItem.r + 6
        )
        if (hit >= 0) {
          obstaclesRef.current.splice(hit, 1)
        } else if (obstaclesRef.current.length < MAX_WALLS) {
          obstaclesRef.current.push({
            x: point.x,
            y: point.y,
            r: WALL_RADIUS,
          })
        }
        setStats((prev) => ({
          ...prev,
          walls: obstaclesRef.current.length,
        }))
        pointer.active = false
        return
      }

      pointer.active = true
      const kind = modeRef.current === "scare" ? "scare" : "attract"
      ripplesRef.current.push({
        x: point.x,
        y: point.y,
        age: 0,
        life: 650,
        kind,
      })
      scent.deposit(point.x, point.y, kind === "scare" ? "fear" : "food", 0.65)
    }

    readAccentHue()
    resize()
    if (reduce) {
      for (const boid of boids) {
        boid.x = Math.random() * width
        boid.y = Math.random() * height
      }
      draw(0)
    } else {
      raf = window.requestAnimationFrame(loop)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("pointerdown", onDown)

    const themeObserver = new MutationObserver(readAccentHue)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    return () => {
      alive = false
      window.cancelAnimationFrame(raf)
      observer.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("pointerdown", onDown)
    }
  }, [])

  const orderPct = Math.round(stats.order)

  return (
    <section
      id="flock"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold sm:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-7 text-pretty sm:text-base">
            {support}
          </p>
          <p className="text-muted-foreground mt-2 text-xs leading-6">{hint}</p>
        </div>
        <div className="border-border bg-card/40 max-w-sm rounded-lg border px-4 py-3">
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
            {whyLabel}
          </p>
          <p className="text-foreground/90 mt-2 text-sm leading-6 text-pretty">
            {whyBody}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
        {ruleCards.map((rule) => {
          const active = ruleFocus === rule.id
          return (
            <button
              key={rule.id}
              type="button"
              aria-pressed={active}
              onClick={() =>
                setRuleFocus((current) => (current === rule.id ? null : rule.id))
              }
              className={cn(
                "focus-visible:ring-ring border-border rounded-lg border p-4 text-start transition-colors focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "bg-primary/12 border-primary/40"
                  : "bg-card/30 hover:bg-card/50"
              )}
            >
              <p className="font-heading text-sm font-medium">{rule.title}</p>
              <p className="text-muted-foreground mt-2 text-xs leading-5">
                {rule.body}
              </p>
            </button>
          )
        })}
      </div>
      <p className="text-muted-foreground mt-2 text-[11px]">{rulesHint}</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label={modeLabel}
          className="border-border flex w-full rounded-lg border p-1 sm:w-auto"
        >
          {modeOptions.map((item) => (
            <Chip
              key={item.id}
              active={mode === item.id}
              label={item.label}
              onClick={() => setMode(item.id)}
            />
          ))}
        </div>
        <div
          role="group"
          aria-label={presetLabel}
          className="border-border flex w-full rounded-lg border p-1 sm:w-auto"
        >
          {presetOptions.map((item) => (
            <Chip
              key={item.id}
              active={preset === item.id}
              label={item.label}
              onClick={() => setPreset(item.id)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={workOn}
            onClick={() => setWorkOn((value) => !value)}
            className={cn(
              "focus-visible:ring-ring border-border min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none",
              workOn
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {workLabel}
          </button>
          <button
            type="button"
            aria-pressed={mindOn}
            onClick={() => setMindOn((value) => !value)}
            className={cn(
              "focus-visible:ring-ring border-border min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none",
              mindOn
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {mindLabel}
          </button>
          <button
            type="button"
            aria-pressed={senseOn}
            onClick={() => setSenseOn((value) => !value)}
            className={cn(
              "focus-visible:ring-ring border-border min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none",
              senseOn
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {senseLabel}
          </button>
          <button
            type="button"
            aria-pressed={trailsOn}
            onClick={() => setTrailsOn((value) => !value)}
            className={cn(
              "focus-visible:ring-ring border-border min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none",
              trailsOn
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {trailsLabel}
          </button>
          <button
            type="button"
            onClick={() => setClearTick((value) => value + 1)}
            disabled={stats.walls === 0}
            className="focus-visible:ring-ring border-border text-muted-foreground hover:text-foreground min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
          >
            {clearWalls}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {agentsLabel} {COUNT}
          <span className="mx-2 opacity-40">·</span>
          {orderLabel} {orderPct}%
          <span className="mx-2 opacity-40">·</span>
          {workingLabel} {stats.working}
          <span className="mx-2 opacity-40">·</span>
          {harvestLabel} {stats.harvested}
          <span className="mx-2 opacity-40">·</span>
          {foodLabel} {stats.food}
          <span className="mx-2 opacity-40">·</span>
          {alertLabel} {stats.alert}%
        </p>
        <div
          className="bg-muted/50 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full"
          aria-hidden
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(100, orderPct)}%` }}
          />
        </div>
      </div>

      <div
        ref={wrapRef}
        className="border-border bg-card/30 mt-2 overflow-hidden border"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          aria-label={title}
        />
      </div>
    </section>
  )
}
