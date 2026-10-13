import {
  createReef,
  FISH_COUNT,
  MAX_FOOD,
  preferredFood,
  respawnMote,
  scatterSpawn,
  seedFood,
  SHARK_COUNT,
  steerIntercept,
  steerToward,
  type FoodMote,
  type Reef,
  type Species,
} from "@/lib/flock-colony"
import { ScentField, TinyMind, TOPO_K } from "@/lib/flock-mind"
import {
  BITE_RANGE,
  EAT_FISH_GAIN,
  EAT_FOOD_GAIN,
  EDGE_MARGIN,
  FISH_BITE_COOL,
  FISH_DRAIN,
  FISH_ENERGY_FLOOR,
  FISH_HUNGER_AT,
  MAX_ACCEL,
  MAX_FORCE,
  MAX_WALLS,
  MIN_SPEED,
  OFFSCREEN_MARGIN,
  PRESETS,
  SHARK_BITE_COOL,
  SHARK_DRAIN,
  SHARK_FEAR_RANGE,
  SHARK_HUNGER_AT,
  SHARK_HUNGER_SPEED,
  SHARK_KEEP_AWAY,
  SHARK_SPEED_MULT,
  TOTAL,
  VEL_DAMP,
  WALL_RADIUS,
  FISH_CRUISE,
} from "@/lib/flock/constants"
import { drawOcean } from "@/lib/flock/draw"
import {
  cssVar,
  hungerDrive,
  limit,
  onScreenSpawn,
  smoothFear,
} from "@/lib/flock/helpers"
import type {
  Agent,
  Mode,
  Obstacle,
  OceanStats,
  Ripple,
  RuleFocus,
  Rules,
} from "@/lib/flock/types"

export type OceanControls = {
  mode: { current: Mode }
  rules: { current: Rules }
  trails: { current: boolean }
  sense: { current: boolean }
  mind: { current: boolean }
  focus: { current: RuleFocus }
  clearSignal: { current: number }
}

type Opts = {
  canvas: HTMLCanvasElement
  wrap: HTMLElement
  controls: OceanControls
  onStats: (stats: OceanStats) => void
}

/** Boot the ocean sim; returns disposer. */
export function startOceanRuntime({
  canvas,
  wrap,
  controls,
  onStats,
}: Opts): () => void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => undefined

  let width = 0
  let height = 0
  let raf = 0
  let running = true
  let seeded = false
  let lastClear = controls.clearSignal.current
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const pointer = { x: 0, y: 0, active: false, inside: false }
  const scent = new ScentField(34, 20)
  let reef: Reef = { x: 0, y: 0, r: 34 }
  let food: FoodMote[] = []
  const obstacles: Obstacle[] = []
  const ripples: Ripple[] = []
  let eaten = 0
  let orderLive = 0
  let statsClock = 0
  let rippleClock = 0
  let learnClock = 0
  let prevFrame = performance.now()

  const agents: Agent[] = []
  for (let i = 0; i < FISH_COUNT; i++) {
    agents.push({
      id: i,
      species: "fish",
      alive: true,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      energy: 0.65 + Math.random() * 0.3,
      stress: 0,
      mind: new TinyMind(2000 + i * 73),
      trail: [],
      biteCool: 0,
      jaw: 0,
    })
  }
  for (let i = 0; i < SHARK_COUNT; i++) {
    agents.push({
      id: FISH_COUNT + i,
      species: "shark",
      alive: true,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      // Mix of satiated + already-hungry patrol so hunting starts sooner
      energy: 0.35 + Math.random() * 0.5,
      stress: 0,
      mind: new TinyMind(9000 + i * 131),
      trail: [],
      biteCool: Math.floor(Math.random() * 20),
      jaw: 0,
    })
  }

  const neighborBuf: { agent: Agent; dist: number }[] = []

  const effectiveRules = (): Rules => {
    const base = controls.rules.current
    const focus = controls.focus.current
    if (!focus) return base
    return {
      ...base,
      sep: focus === "sep" ? base.sep * 2.4 : base.sep * 0.35,
      ali: focus === "ali" ? base.ali * 2.4 : base.ali * 0.35,
      coh: focus === "coh" ? base.coh * 2.4 : base.coh * 0.35,
    }
  }

  const nearestAlive = (
    species: Species,
    x: number,
    y: number,
    maxDist: number
  ) => {
    let best: Agent | null = null
    let bestD = maxDist
    for (const other of agents) {
      if (!other.alive || other.species !== species) continue
      const d = Math.hypot(other.x - x, other.y - y)
      if (d < bestD) {
        bestD = d
        best = other
      }
    }
    return best
  }

  const topoFish = (agent: Agent, perception: number) => {
    neighborBuf.length = 0
    for (const other of agents) {
      if (!other.alive || other === agent || other.species !== "fish") continue
      const dx = other.x - agent.x
      const dy = other.y - agent.y
      const dist = Math.hypot(dx, dy)
      if (dist === 0 || dist > perception) continue
      neighborBuf.push({ agent: other, dist })
    }
    neighborBuf.sort((a, b) => a.dist - b.dist)
    return neighborBuf.slice(0, TOPO_K)
  }

  /** Respawn only after eat / far off-screen — always back on the visible canvas */
  const respawnFishOnScreen = (fish: Agent) => {
    const spot = onScreenSpawn(width, height)
    fish.alive = true
    fish.x = spot.x
    fish.y = spot.y
    fish.vx = (Math.random() - 0.5) * 1.6
    fish.vy = (Math.random() - 0.5) * 1.6
    fish.energy = 0.6 + Math.random() * 0.3
    fish.stress = 0.1
    fish.jaw = 0
    fish.biteCool = 0
    fish.trail.length = 0
  }

  const softEdgePush = (agent: Agent, fx: number, fy: number) => {
    let ox = fx
    let oy = fy
    // Wider, softer walls — hard edges caused stall/spin bounce
    if (agent.x < EDGE_MARGIN) {
      const t = 1 - agent.x / EDGE_MARGIN
      ox += MAX_FORCE * t * t * 1.25
    } else if (agent.x > width - EDGE_MARGIN) {
      const t = 1 - (width - agent.x) / EDGE_MARGIN
      ox -= MAX_FORCE * t * t * 1.25
    }
    if (agent.y < EDGE_MARGIN) {
      const t = 1 - agent.y / EDGE_MARGIN
      oy += MAX_FORCE * t * t * 1.25
    } else if (agent.y > height - EDGE_MARGIN) {
      const t = 1 - (height - agent.y) / EDGE_MARGIN
      oy -= MAX_FORCE * t * t * 1.25
    }
    return { x: ox, y: oy }
  }

  const steer = (agent: Agent, dt: number) => {
    if (!agent.alive) return
    const rules = effectiveRules()
    const isShark = agent.species === "shark"
    if (agent.biteCool > 0) agent.biteCool -= 1
    if (agent.jaw > 0) agent.jaw = Math.max(0, agent.jaw - 0.06 * dt)

    agent.energy -=
      (isShark ? SHARK_DRAIN : FISH_DRAIN * (0.65 + agent.stress * 0.7)) * dt
    if (isShark) {
      // Allow real hunger; floor only prevents total collapse
      agent.energy = Math.max(0.08, agent.energy)
    } else {
      // Never despawn from hunger while visible — just get sluggish/hungry
      agent.energy = Math.max(FISH_ENERGY_FLOOR, agent.energy)
    }

    const hunger = hungerDrive(
      agent.energy,
      isShark ? SHARK_HUNGER_AT : FISH_HUNGER_AT
    )
    const scentSample = scent.sample(agent.x, agent.y)
    const nearestShark = nearestAlive(
      "shark",
      agent.x,
      agent.y,
      rules.perception * (isShark ? 1.2 : 2.5)
    )
    const nearestPrey = isShark
      ? nearestAlive("fish", agent.x, agent.y, rules.perception * 2.6)
      : null
    const sharkDist = nearestShark
      ? Math.hypot(nearestShark.x - agent.x, nearestShark.y - agent.y)
      : 9999
    const preyDist = nearestPrey
      ? Math.hypot(nearestPrey.x - agent.x, nearestPrey.y - agent.y)
      : 9999
    const sharkFear = isShark ? 0 : smoothFear(sharkDist, SHARK_FEAR_RANGE)
    const threat = isShark
      ? 0
      : Math.min(1, sharkFear * 0.92 + scentSample.blood * 0.08)

    agent.stress += (threat - agent.stress) * (0.06 * dt)
    const fear = agent.stress

    const foodTarget = !isShark
      ? preferredFood(agent.id, agent.x, agent.y, food, rules.perception * 2.3)
      : null
    const foodDist = foodTarget
      ? Math.hypot(foodTarget.x - agent.x, foodTarget.y - agent.y)
      : 9999
    const foodNear = foodTarget
      ? Math.max(0, 1 - foodDist / (rules.perception * 2.3))
      : 0
    const preyNear = nearestPrey
      ? Math.max(0, 1 - preyDist / (rules.perception * 2.6))
      : 0
    let alignX = 0
    let alignY = 0
    let cohX = 0
    let cohY = 0
    let sepX = 0
    let sepY = 0
    let alignScore = 0
    let total = 0

    if (!isShark) {
      const neighbors = topoFish(agent, rules.perception)
      total = neighbors.length
      for (const { agent: other, dist } of neighbors) {
        alignX += other.vx
        alignY += other.vy
        cohX += other.x
        cohY += other.y
        const near = Math.max(0, 1 - dist / 26)
        const push = Math.max(0, 1 - dist / (rules.perception * 0.42))
        const hard = 1 + near * near * 1.8
        sepX += ((agent.x - other.x) / dist) * (1 + push) * hard
        sepY += ((agent.y - other.y) / dist) * (1 + push) * hard
        const mag =
          Math.hypot(agent.vx, agent.vy) * Math.hypot(other.vx, other.vy) || 1
        alignScore += (agent.vx * other.vx + agent.vy * other.vy) / mag
      }
    } else {
      for (const other of agents) {
        if (!other.alive || other === agent || other.species !== "shark") continue
        const dist = Math.hypot(other.x - agent.x, other.y - agent.y)
        if (dist > 90 || dist === 0) continue
        sepX += (agent.x - other.x) / dist
        sepY += (agent.y - other.y) / dist
        total += 1
      }
    }

    const density = Math.min(1, total / TOPO_K)
    const localAlign = total > 0 && !isShark ? (alignScore / total + 1) / 2 : 0.4
    const speedNorm = Math.min(
      1,
      Math.hypot(agent.vx, agent.vy) / (rules.speed * 1.2)
    )

    let mind = {
      sep: 1,
      ali: 1,
      coh: 1,
      seek: hunger,
      flee: threat,
      hunt: isShark ? hunger : 0,
    }
    if (controls.mind.current) {
      mind = agent.mind.think({
        density,
        threat,
        energy: agent.energy,
        align: localAlign,
        hunger,
        foodNear,
        preyNear,
        reefNear: 0,
        isShark: isShark ? 1 : 0,
        speed: speedNorm,
      })
    }

    let fx = 0
    let fy = 0

    if (!isShark && total > 0) {
      const align = limit(
        alignX / total - agent.vx,
        alignY / total - agent.vy,
        MAX_FORCE
      )
      const coh = limit(cohX / total - agent.x, cohY / total - agent.y, MAX_FORCE)
      const sep = limit(sepX, sepY, MAX_FORCE * 1.25)
      const panic = 1 + fear * 0.35
      fx +=
        align.x * rules.ali * (1 - fear * 0.2) +
        coh.x * rules.coh * (1 - fear * 0.28) +
        sep.x * rules.sep * panic
      fy +=
        align.y * rules.ali * (1 - fear * 0.2) +
        coh.y * rules.coh * (1 - fear * 0.28) +
        sep.y * rules.sep * panic
    } else if (isShark && total > 0) {
      const sep = limit(sepX, sepY, MAX_FORCE)
      fx += sep.x * 1.4
      fy += sep.y * 1.4
    }

    const fearGrad = scent.gradient(agent.x, agent.y, "fear")
    const foodGrad = scent.gradient(agent.x, agent.y, "food")
    const bloodGrad = scent.gradient(agent.x, agent.y, "blood")

    if (!isShark) {
      if (nearestShark && sharkFear > 0.01) {
        const dx = agent.x - nearestShark.x
        const dy = agent.y - nearestShark.y
        const dist = Math.hypot(dx, dy) || 0.0001
        const ux = dx / dist
        const uy = dy / dist
        // Soft keep-away bubble — fish usually give sharks space
        if (dist < SHARK_KEEP_AWAY) {
          const bubble = Math.pow(1 - dist / SHARK_KEEP_AWAY, 1.45)
          const push = MAX_FORCE * (1.8 + bubble * 2.2) * bubble
          fx += ux * push
          fy += uy * push
          // Slide sideways so they don't stall head-on
          fx += -uy * push * 0.35
          fy += ux * push * 0.35
        }
        const fleeAmt =
          MAX_FORCE * (0.55 + sharkFear * 1.55 + mind.flee * 0.4) * sharkFear
        fx += ux * fleeAmt
        fy += uy * fleeAmt
        fx -= fearGrad.x * 0.1 * fear
        fy -= fearGrad.y * 0.1 * fear
      } else {
        // Tiny wander so idle fish keep swimming forward
        fx += (Math.random() - 0.5) * MAX_FORCE * 0.08
        fy += (Math.random() - 0.5) * MAX_FORCE * 0.08
      }

      const calm = Math.max(0, 1 - fear * 1.05)
      if (hunger > 0.15 && foodTarget && calm > 0.12) {
        const seek = steerToward(
          agent.x,
          agent.y,
          foodTarget.x,
          foodTarget.y,
          MAX_FORCE * (0.35 + mind.seek * 0.45 + hunger * 0.35) * calm
        )
        fx += seek.x + foodGrad.x * 0.22 * calm
        fy += seek.y + foodGrad.y * 0.22 * calm
      } else if (calm > 0.2) {
        fx += foodGrad.x * 0.05 * calm
        fy += foodGrad.y * 0.05 * calm
      }

      // Gentle ambient recovery so the school doesn't sit on the energy floor
      if (fear < 0.25) {
        agent.energy = Math.min(1, agent.energy + 0.00008 * dt)
      }
    } else {
      // Hunt whenever hungry — mind only scales intensity, doesn't gate it
      if (hunger > 0.12 && nearestPrey) {
        const hunt = steerIntercept(
          agent.x,
          agent.y,
          nearestPrey.x,
          nearestPrey.y,
          nearestPrey.vx,
          nearestPrey.vy,
          MAX_FORCE * (1.05 + mind.hunt * 0.7 + hunger * 1.1),
          10 + mind.hunt * 5 + hunger * 6
        )
        fx += hunt.x + bloodGrad.x * 0.55 * hunger
        fy += hunt.y + bloodGrad.y * 0.55 * hunger
      } else {
        fx += bloodGrad.x * 0.12 + (Math.random() - 0.5) * MAX_FORCE * 0.14
        fy += bloodGrad.y * 0.12 + (Math.random() - 0.5) * MAX_FORCE * 0.14
      }
    }

    for (const wallItem of obstacles) {
      const dx = agent.x - wallItem.x
      const dy = agent.y - wallItem.y
      const dist = Math.hypot(dx, dy) || 0.0001
      const safe = wallItem.r + (isShark ? 28 : 20)
      if (dist < safe) {
        const push = limit(dx / dist, dy / dist, MAX_FORCE * 2.8)
        const strength = (1 - dist / safe) * 2.2
        fx += push.x * strength
        fy += push.y * strength
      }
    }

    ;({ x: fx, y: fy } = softEdgePush(agent, fx, fy))

    // Cap school/fear forces first…
    let accel = limit(fx, fy, MAX_ACCEL)

    // …then add mouse influence so it isn't crushed by the cap
    const modeNow = controls.mode.current
    if (
      !isShark &&
      pointer.active &&
      (modeNow === "attract" || modeNow === "scare")
    ) {
      const dx = pointer.x - agent.x
      const dy = pointer.y - agent.y
      const dist = Math.hypot(dx, dy) || 1
      const reach = modeNow === "scare" ? 260 : 220
      if (dist < reach) {
        const dir = modeNow === "scare" ? -1 : 1
        const t = 1 - dist / reach
        const falloff = t * t * (3 - 2 * t)
        const pull = limit(
          (dx / dist) * dir,
          (dy / dist) * dir,
          MAX_FORCE * (2.8 + falloff * 2.4)
        )
        accel = {
          x: accel.x + pull.x * (0.7 + falloff * 1.5),
          y: accel.y + pull.y * (0.7 + falloff * 1.5),
        }
      }
    }

    const damp = Math.pow(VEL_DAMP, dt)
    agent.vx = (agent.vx + accel.x * dt) * damp
    agent.vy = (agent.vy + accel.y * dt) * damp

    const boost = isShark
      ? SHARK_SPEED_MULT + hunger * SHARK_HUNGER_SPEED
      : 0.92 + agent.energy * 0.1 + fear * 0.22
    const maxSp = rules.speed * boost
    let mag = Math.hypot(agent.vx, agent.vy)

    if (!isShark) {
      const cruise = maxSp * FISH_CRUISE * (1 + fear * 0.25)
      if (mag < 0.08) {
        // Dead-stop → resume swimming in a stable heading (kills spin-in-place)
        const heading =
          total > 0
            ? Math.atan2(alignY / total, alignX / total)
            : Math.atan2(agent.vy || 0.01, agent.vx || 0.01)
        agent.vx = Math.cos(heading) * cruise
        agent.vy = Math.sin(heading) * cruise
        mag = cruise
      } else if (mag < cruise) {
        // Soft ease up to cruise — no hard snap, no zero-speed stall
        const s = (mag * 0.9 + cruise * 0.1) / mag
        agent.vx *= s
        agent.vy *= s
        mag *= s
      }
    }

    if (mag > maxSp) {
      const s = maxSp / mag
      agent.vx *= s
      agent.vy *= s
    } else if (isShark && mag < MIN_SPEED * (0.5 + hunger * 0.35)) {
      const floor = MIN_SPEED * (0.5 + hunger * 0.35)
      const s = floor / Math.max(mag, 0.0001)
      agent.vx *= s
      agent.vy *= s
    }

    agent.x += agent.vx * dt
    agent.y += agent.vy * dt

    if (!isShark && hunger > 0.15 && foodDist < 18) {
      agent.jaw = Math.max(agent.jaw, 0.45)
    }
    if (isShark && hunger > 0.25 && preyDist < BITE_RANGE * 2.2) {
      agent.jaw = Math.max(agent.jaw, 0.55)
    }

    if (
      !isShark &&
      hunger > 0.12 &&
      foodTarget &&
      foodDist < 12 &&
      foodTarget.stock > 0 &&
      agent.biteCool <= 0
    ) {
      foodTarget.stock -= 1
      agent.energy = Math.min(1, agent.energy + EAT_FOOD_GAIN)
      agent.biteCool = FISH_BITE_COOL
      agent.jaw = 1
      scent.deposit(foodTarget.x, foodTarget.y, "food", 0.4)
      if (foodTarget.stock <= 0) respawnMote(foodTarget, width, height, reef)
      agent.mind.learn(0.7)
    }

    if (
      isShark &&
      hunger > 0.1 &&
      nearestPrey &&
      preyDist < BITE_RANGE &&
      agent.biteCool <= 0 &&
      nearestPrey.alive
    ) {
      nearestPrey.alive = false
      agent.energy = Math.min(1, agent.energy + EAT_FISH_GAIN)
      agent.biteCool = SHARK_BITE_COOL
      agent.jaw = 1
      eaten += 1
      scent.deposit(nearestPrey.x, nearestPrey.y, "blood", 0.85)
      scent.deposit(nearestPrey.x, nearestPrey.y, "fear", 0.55)
      ripples.push({
        x: nearestPrey.x,
        y: nearestPrey.y,
        age: 0,
        life: 520,
        kind: "bite",
      })
      agent.mind.learn(0.9)
      const prey = nearestPrey
      window.setTimeout(() => {
        if (running) respawnFishOnScreen(prey)
      }, 900 + Math.random() * 900)
    }

    if (!isShark && fear > 0.55 && Math.random() < 0.04 * dt) {
      scent.deposit(agent.x, agent.y, "fear", 0.08)
    }

    if (controls.trails.current) {
      agent.trail.push({ x: agent.x, y: agent.y })
      if (agent.trail.length > (isShark ? 22 : 14)) agent.trail.shift()
    } else if (agent.trail.length) {
      agent.trail.length = 0
    }

    // Far off-canvas only: recycle back onto the visible ocean
    if (
      !isShark &&
      (agent.x < -OFFSCREEN_MARGIN ||
        agent.x > width + OFFSCREEN_MARGIN ||
        agent.y < -OFFSCREEN_MARGIN ||
        agent.y > height + OFFSCREEN_MARGIN)
    ) {
      respawnFishOnScreen(agent)
    } else if (isShark) {
      // Sharks soft-wrap far away so they keep patrolling
      if (agent.x < -OFFSCREEN_MARGIN) agent.x = width + EDGE_MARGIN
      if (agent.x > width + OFFSCREEN_MARGIN) agent.x = -EDGE_MARGIN
      if (agent.y < -OFFSCREEN_MARGIN) agent.y = height + EDGE_MARGIN
      if (agent.y > height + OFFSCREEN_MARGIN) agent.y = -EDGE_MARGIN
    }
  }

  const resize = () => {
    width = wrap.clientWidth
    height = Math.max(430, Math.min(620, width * 0.58))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    scent.resize(width, height)
    reef = createReef(width, height)
    if (!seeded) {
      for (const agent of agents) {
        const spot = scatterSpawn(
          width,
          height,
          reef,
          agent.id,
          TOTAL,
          agent.species
        )
        agent.x = spot.x
        agent.y = spot.y
      }
      food = seedFood(width, height, reef, 16)
      seeded = true
    }
  }

  const pointFromEvent = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * width,
      y: ((event.clientY - rect.top) / rect.height) * height,
    }
  }

  const onMove = (event: PointerEvent) => {
    const point = pointFromEvent(event)
    pointer.x = point.x
    pointer.y = point.y
    pointer.inside = true
    const mode = controls.mode.current
    // Attract/scare react on hover — click is not required
    pointer.active = mode === "attract" || mode === "scare"
  }

  const onLeave = () => {
    pointer.inside = false
    pointer.active = false
  }

  const onUp = () => {
    // Keep hover attract/scare active while inside; wall/feed stay click-only
    const mode = controls.mode.current
    if (mode === "wall" || mode === "feed") pointer.active = false
  }

  const onDown = (event: PointerEvent) => {
    const point = pointFromEvent(event)
    pointer.x = point.x
    pointer.y = point.y
    pointer.inside = true

    if (controls.mode.current === "feed") {
      if (food.length < MAX_FOOD) {
        food.push({
          x: point.x,
          y: point.y,
          stock: 3,
          pulse: Math.random() * Math.PI * 2,
        })
      } else {
        const mote = food[Math.floor(Math.random() * food.length)]!
        mote.x = point.x
        mote.y = point.y
        mote.stock = 3
      }
      scent.deposit(point.x, point.y, "food", 0.75)
      ripples.push({
        x: point.x,
        y: point.y,
        age: 0,
        life: 520,
        kind: "attract",
      })
      pointer.active = false
      return
    }

    if (controls.mode.current === "wall") {
      const hit = obstacles.findIndex(
        (w) => Math.hypot(w.x - point.x, w.y - point.y) <= w.r + 6
      )
      if (hit >= 0) obstacles.splice(hit, 1)
      else if (obstacles.length < MAX_WALLS) {
        obstacles.push({ x: point.x, y: point.y, r: WALL_RADIUS })
      }
      pointer.active = false
      return
    }

    pointer.active = true
    const kind = controls.mode.current === "scare" ? "scare" : "attract"
    ripples.push({
      x: point.x,
      y: point.y,
      age: 0,
      life: 620,
      kind,
    })
    scent.deposit(point.x, point.y, kind === "scare" ? "fear" : "food", 0.7)
  }

  const loop = (now: number) => {
    if (!running) return
    try {
      const dt = Math.min(1.75, Math.max(0.5, (now - prevFrame) / 16.6667))
      prevFrame = now
      if (controls.clearSignal.current !== lastClear) {
        obstacles.length = 0
        scent.clear()
        lastClear = controls.clearSignal.current
      }
      if (!reduce) {
        for (const agent of agents) steer(agent, dt)
        scent.decay(Math.pow(0.974, dt))

        if (
          pointer.active &&
          controls.mode.current !== "wall" &&
          controls.mode.current !== "feed" &&
          now - rippleClock > 280
        ) {
          rippleClock = now
          const kind = controls.mode.current === "scare" ? "scare" : "attract"
          ripples.push({
            x: pointer.x,
            y: pointer.y,
            age: 0,
            life: 680,
            kind,
          })
          scent.deposit(
            pointer.x,
            pointer.y,
            kind === "scare" ? "fear" : "food",
            kind === "scare" ? 0.55 : 0.35
          )
        }

        if (controls.mind.current && now - learnClock > 450) {
          learnClock = now
          for (let i = 0; i < agents.length; i += 4) {
            const agent = agents[i]!
            if (!agent.alive) continue
            const reward =
              agent.energy * 0.55 +
              (1 - agent.stress) * 0.25 +
              (agent.species === "shark" ? 0.1 : orderLive * 0.15) -
              0.35
            agent.mind.learn(reward)
          }
        }

        if (now - statsClock > 180) {
          statsClock = now
          let sx = 0
          let sy = 0
          let fishN = 0
          let sharkN = 0
          let energySum = 0
          let foodLeft = 0
          for (const agent of agents) {
            if (!agent.alive) continue
            if (agent.species === "fish") {
              fishN += 1
              const mag = Math.hypot(agent.vx, agent.vy) || 1
              sx += agent.vx / mag
              sy += agent.vy / mag
              energySum += agent.energy
            } else {
              sharkN += 1
            }
          }
          for (const mote of food) foodLeft += mote.stock
          const order = fishN > 0 ? Math.hypot(sx, sy) / fishN : 0
          orderLive = order
          onStats({
            fish: fishN,
            sharks: sharkN,
            order: order * 100,
            food: foodLeft,
            eaten,
            energy: fishN > 0 ? (energySum / fishN) * 100 : 0,
          })
        }
      }

      drawOcean({
        ctx,
        width,
        height,
        now,
        accent: cssVar("--primary", "#5eead4"),
        food,
        agents,
        scent,
        obstacles,
        ripples,
        pointer,
        mode: controls.mode.current,
        trails: controls.trails.current,
        sense: controls.sense.current,
        order: orderLive,
        perception: effectiveRules().perception,
      })
    } finally {
      if (running) raf = window.requestAnimationFrame(loop)
    }
  }

  resize()
  if (reduce) {
    drawOcean({
      ctx,
      width,
      height,
      now: 0,
      accent: cssVar("--primary", "#5eead4"),
      food,
      agents,
      scent,
      obstacles,
      ripples,
      pointer,
      mode: controls.mode.current,
      trails: controls.trails.current,
      sense: controls.sense.current,
      order: 0,
      perception: PRESETS.school.perception,
    })
  } else {
    raf = window.requestAnimationFrame(loop)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(wrap)
  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerleave", onLeave)
  canvas.addEventListener("pointerdown", onDown)
  canvas.addEventListener("pointerup", onUp)

  return () => {
    running = false
    window.cancelAnimationFrame(raf)
    observer.disconnect()
    canvas.removeEventListener("pointermove", onMove)
    canvas.removeEventListener("pointerleave", onLeave)
    canvas.removeEventListener("pointerdown", onDown)
    canvas.removeEventListener("pointerup", onUp)
  }
}
