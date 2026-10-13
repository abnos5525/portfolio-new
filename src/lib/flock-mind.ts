/**
 * Onboard micro-policy + multi-channel scent field.
 * Combines murmuration topology, ant-style stigmergy, and a tiny neural net.
 */

export type MindInputs = {
  density: number
  threat: number
  energy: number
  align: number
  cargo: number
  foodNear: number
  nestNear: number
  roleBias: number
}

export type MindOutputs = {
  sep: number
  ali: number
  coh: number
  work: number
  explore: number
}

const HIDDEN = 6
const IN = 8
const OUT = 5

function tanh(x: number) {
  if (x > 4) return 1
  if (x < -4) return -1
  const e2 = Math.exp(2 * x)
  return (e2 - 1) / (e2 + 1)
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

/** Compact feed-forward brain: 8 → 6 → 5 — still tiny, no libs. */
export class TinyMind {
  readonly w1: Float32Array
  readonly b1: Float32Array
  readonly w2: Float32Array
  readonly b2: Float32Array
  readonly lastIn = new Float32Array(IN)
  readonly lastH = new Float32Array(HIDDEN)
  readonly lastOut = new Float32Array(OUT)

  constructor(seed: number) {
    const rnd = mulberry(seed)
    this.w1 = new Float32Array(IN * HIDDEN)
    this.b1 = new Float32Array(HIDDEN)
    this.w2 = new Float32Array(HIDDEN * OUT)
    this.b2 = new Float32Array(OUT)
    for (let i = 0; i < this.w1.length; i++) this.w1[i] = (rnd() - 0.5) * 0.85
    for (let i = 0; i < this.b1.length; i++) this.b1[i] = (rnd() - 0.5) * 0.2
    for (let i = 0; i < this.w2.length; i++) this.w2[i] = (rnd() - 0.5) * 0.85
    for (let i = 0; i < this.b2.length; i++) this.b2[i] = (rnd() - 0.5) * 0.15
  }

  think(input: MindInputs): MindOutputs {
    const x = this.lastIn
    x[0] = clamp(input.density, 0, 1)
    x[1] = clamp(input.threat, 0, 1)
    x[2] = clamp(input.energy, 0, 1)
    x[3] = clamp(input.align, 0, 1)
    x[4] = clamp(input.cargo, 0, 1)
    x[5] = clamp(input.foodNear, 0, 1)
    x[6] = clamp(input.nestNear, 0, 1)
    x[7] = clamp(input.roleBias, 0, 1)

    const h = this.lastH
    for (let j = 0; j < HIDDEN; j++) {
      let sum = this.b1[j]!
      for (let i = 0; i < IN; i++) sum += x[i]! * this.w1[i * HIDDEN + j]!
      h[j] = tanh(sum)
    }

    const y = this.lastOut
    for (let k = 0; k < OUT; k++) {
      let sum = this.b2[k]!
      for (let j = 0; j < HIDDEN; j++) sum += h[j]! * this.w2[j * OUT + k]!
      y[k] = tanh(sum)
    }

    return {
      sep: 0.5 + (y[0]! + 1) * 0.9,
      ali: 0.5 + (y[1]! + 1) * 0.9,
      coh: 0.5 + (y[2]! + 1) * 0.9,
      work: (y[3]! + 1) * 0.5,
      explore: (y[4]! + 1) * 0.5,
    }
  }

  learn(reward: number) {
    const lr = 0.005
    const target = clamp(reward, -1, 1)
    for (let k = 0; k < OUT; k++) {
      const err = target - this.lastOut[k]!
      for (let j = 0; j < HIDDEN; j++) {
        const idx = j * OUT + k
        this.w2[idx]! += lr * err * this.lastH[j]!
        this.w2[idx] = clamp(this.w2[idx]!, -2.8, 2.8)
      }
      this.b2[k]! += lr * err * 0.25
      this.b2[k] = clamp(this.b2[k]!, -1.6, 1.6)
    }
    for (let j = 0; j < HIDDEN; j++) {
      let back = 0
      for (let k = 0; k < OUT; k++) {
        back += (target - this.lastOut[k]!) * this.w2[j * OUT + k]!
      }
      const gate = 1 - this.lastH[j]! * this.lastH[j]!
      for (let i = 0; i < IN; i++) {
        const idx = i * HIDDEN + j
        this.w1[idx]! += lr * back * gate * this.lastIn[i]! * 0.4
        this.w1[idx] = clamp(this.w1[idx]!, -2.8, 2.8)
      }
    }
  }
}

function mulberry(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export type ScentKind = "fear" | "food" | "home"

/** Fear + ant-style food/home trails on one coarse grid. */
export class ScentField {
  readonly cols: number
  readonly rows: number
  readonly fear: Float32Array
  readonly food: Float32Array
  readonly home: Float32Array
  private width = 1
  private height = 1

  constructor(cols = 32, rows = 18) {
    this.cols = cols
    this.rows = rows
    this.fear = new Float32Array(cols * rows)
    this.food = new Float32Array(cols * rows)
    this.home = new Float32Array(cols * rows)
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
  }

  private index(x: number, y: number) {
    const c = clamp(Math.floor((x / this.width) * this.cols), 0, this.cols - 1)
    const r = clamp(Math.floor((y / this.height) * this.rows), 0, this.rows - 1)
    return r * this.cols + c
  }

  private field(kind: ScentKind) {
    if (kind === "fear") return this.fear
    if (kind === "food") return this.food
    return this.home
  }

  deposit(x: number, y: number, kind: ScentKind, amount = 0.55) {
    const grid = this.field(kind)
    const i = this.index(x, y)
    grid[i] = clamp(grid[i]! + amount, 0, 1)
    const neighbors = [i - 1, i + 1, i - this.cols, i + this.cols]
    for (const n of neighbors) {
      if (n < 0 || n >= grid.length) continue
      grid[n] = clamp(grid[n]! + amount * 0.32, 0, 1)
    }
  }

  sample(x: number, y: number) {
    const i = this.index(x, y)
    return {
      fear: this.fear[i]!,
      food: this.food[i]!,
      home: this.home[i]!,
    }
  }

  gradient(x: number, y: number, kind: ScentKind) {
    const grid = this.field(kind)
    const c = clamp(Math.floor((x / this.width) * this.cols), 1, this.cols - 2)
    const r = clamp(Math.floor((y / this.height) * this.rows), 1, this.rows - 2)
    const at = (cc: number, rr: number) => grid[rr * this.cols + cc]!
    return {
      x: at(c + 1, r) - at(c - 1, r),
      y: at(c, r + 1) - at(c, r - 1),
    }
  }

  decay(rate = 0.97) {
    for (let i = 0; i < this.fear.length; i++) {
      this.fear[i]! *= rate
      this.food[i]! *= rate * 0.992
      this.home[i]! *= rate * 0.992
      if (this.fear[i]! < 0.008) this.fear[i] = 0
      if (this.food[i]! < 0.008) this.food[i] = 0
      if (this.home[i]! < 0.008) this.home[i] = 0
    }
  }

  clear() {
    this.fear.fill(0)
    this.food.fill(0)
    this.home.fill(0)
  }
}

export const TOPO_K = 7
