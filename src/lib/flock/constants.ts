import type { Preset, Rules } from "@/lib/flock/types"
import { FISH_COUNT, SHARK_COUNT } from "@/lib/flock-colony"

export const TOTAL = FISH_COUNT + SHARK_COUNT
export const MAX_FORCE = 0.065
export const MIN_SPEED = 0.55
export const MAX_ACCEL = 0.22
export const WALL_RADIUS = 28
export const MAX_WALLS = 10
export const FOV = (210 * Math.PI) / 180
export const FISH_DRAIN = 0.00016
export const SHARK_DRAIN = 0.00032
export const EAT_FOOD_GAIN = 0.48
export const EAT_FISH_GAIN = 0.55
export const BITE_RANGE = 26
export const FISH_HUNGER_AT = 0.48
/** Sharks start hunting below this energy */
export const SHARK_HUNGER_AT = 0.62
export const SHARK_SPEED_MULT = 0.7
/** Hungry chase burst — must outpace fleeing fish */
export const SHARK_HUNGER_SPEED = 0.95
export const SHARK_BITE_COOL = 48
export const FISH_BITE_COOL = 18
export const SHARK_FEAR_RANGE = 120
/** Fish give space, but not so wide sharks can never bite */
export const SHARK_KEEP_AWAY = 56
export const VEL_DAMP = 0.994
/** Soft keep-inside margin; beyond OFFSCREEN_MARGIN fish may respawn */
export const EDGE_MARGIN = 42
export const OFFSCREEN_MARGIN = 140
/** Starving fish slow down but never vanish on-screen */
export const FISH_ENERGY_FLOOR = 0.12
/** Soft cruise fraction of max speed — stops mid-ocean stall/spin */
export const FISH_CRUISE = 0.58

export const PRESETS: Record<Preset, Rules> = {
  school: { sep: 1.3, ali: 1.55, coh: 1.3, perception: 74, speed: 1.75 },
  calm: { sep: 1.05, ali: 1.25, coh: 1.1, perception: 66, speed: 1.4 },
  frenzy: { sep: 1.7, ali: 0.9, coh: 0.7, perception: 78, speed: 2.1 },
}
