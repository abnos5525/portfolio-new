import type { TinyMind } from "@/lib/flock-mind"
import type { Species } from "@/lib/flock-colony"

export type Mode = "attract" | "scare" | "wall" | "feed"
export type Preset = "school" | "calm" | "frenzy"
export type RuleFocus = "sep" | "ali" | "coh" | null

export type Agent = {
  id: number
  species: Species
  alive: boolean
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  stress: number
  mind: TinyMind
  trail: { x: number; y: number }[]
  biteCool: number
  /** 0 closed → 1 open */
  jaw: number
}

export type Obstacle = { x: number; y: number; r: number }
export type Ripple = {
  x: number
  y: number
  age: number
  life: number
  kind: "attract" | "scare" | "bite"
}
export type Rules = {
  sep: number
  ali: number
  coh: number
  perception: number
  speed: number
}

export type OceanStats = {
  fish: number
  sharks: number
  order: number
  food: number
  eaten: number
  energy: number
}

export type FlockFieldProps = {
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
  school: string
  calm: string
  frenzy: string
  mind: string
  clearWalls: string
  fishLabel: string
  sharkLabel: string
  orderLabel: string
  foodLabel: string
  eatenLabel: string
  energyLabel: string
  sepTitle: string
  sepBody: string
  aliTitle: string
  aliBody: string
  cohTitle: string
  cohBody: string
  rulesHint: string
}
