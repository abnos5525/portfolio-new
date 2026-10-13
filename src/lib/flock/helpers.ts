import type { Agent } from "@/lib/flock/types"
import { FOV } from "@/lib/flock/constants"

export function cssVar(name: string, fallback: string) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  )
}

export function limit(x: number, y: number, max: number) {
  const mag = Math.hypot(x, y) || 0.0001
  if (mag <= max) return { x, y }
  const s = max / mag
  return { x: x * s, y: y * s }
}

export function inFov(agent: Agent, dx: number, dy: number) {
  const heading = Math.atan2(agent.vy, agent.vx)
  const toOther = Math.atan2(dy, dx)
  let delta = toOther - heading
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return Math.abs(delta) <= FOV / 2
}

/** Calm → pale cyan; rising stress / fatigue → warmer red */
export function fishColor(energy: number, stress: number) {
  const fatigue = Math.max(0, 1 - energy) * 0.4
  const t = Math.min(1, stress * 0.9 + fatigue)
  const hue = 198 - t * 190
  const sat = 48 + t * 38
  const light = 66 - t * 22 + energy * 6
  return `hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${light.toFixed(0)}%)`
}

export function sharkColor(energy: number, hunger = 0) {
  const hue = 208 - hunger * 28
  const light = 24 + energy * 16
  return `hsl(${hue.toFixed(0)} ${20 + hunger * 18}% ${light.toFixed(0)}%)`
}

export function hungerDrive(energy: number, threshold: number) {
  if (energy >= threshold) return 0
  return (threshold - energy) / threshold
}

/** Smooth 0→1 falloff — avoids binary on/off jitter */
export function smoothFear(dist: number, range: number) {
  if (dist >= range) return 0
  const t = 1 - dist / range
  return t * t * (3 - 2 * t)
}

/** Random point clearly inside the visible canvas */
export function onScreenSpawn(width: number, height: number) {
  const pad = 48
  return {
    x: pad + Math.random() * Math.max(1, width - pad * 2),
    y: pad + Math.random() * Math.max(1, height - pad * 2),
  }
}
