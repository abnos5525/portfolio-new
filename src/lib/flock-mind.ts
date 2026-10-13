/**
 * Stronger onboard micro-policy for ocean agents (fish + sharks).
 * 10 → 8 → 6 net, still tiny / no ML libs / main-thread safe.
 */

export type MindInputs = {
  density: number
  threat: number
  energy: number
  align: number
  hunger: number
  foodNear: number
  preyNear: number
  reefNear: number
  isShark: number
  speed: number
}

export type MindOutputs = {
  sep: number
  ali: number
  coh: number
  seek: number
  flee: number
  hunt: number
}

const HIDDEN = 8
const IN = 10
const OUT = 6

function tanh(x: number) {
  if (x > 4) return 1
  if (x < -4) return -1
  const e2 = Math.exp(2 * x)
  return (e2 - 1) / (e2 + 1)
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

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
    for (let i = 0; i < this.w1.length; i++) this.w1[i] = (rnd() - 0.5) * 0.9
    for (let i = 0; i < this.b1.length; i++) this.b1[i] = (rnd() - 0.5) * 0.25
    for (let i = 0; i < this.w2.length; i++) this.w2[i] = (rnd() - 0.5) * 0.9
    for (let i = 0; i < this.b2.length; i++) this.b2[i] = (rnd() - 0.5) * 0.2
  }

  think(input: MindInputs): MindOutputs {
    const x = this.lastIn
    x[0] = clamp(input.density, 0, 1)
    x[1] = clamp(input.threat, 0, 1)
    x[2] = clamp(input.energy, 0, 1)
    x[3] = clamp(input.align, 0, 1)
    x[4] = clamp(input.hunger, 0, 1)
    x[5] = clamp(input.foodNear, 0, 1)
    x[6] = clamp(input.preyNear, 0, 1)
    x[7] = clamp(input.reefNear, 0, 1)
    x[8] = clamp(input.isShark, 0, 1)
    x[9] = clamp(input.speed, 0, 1)

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
      sep: 0.45 + (y[0]! + 1) * 0.95,
      ali: 0.45 + (y[1]! + 1) * 0.95,
      coh: 0.45 + (y[2]! + 1) * 0.95,
      seek: (y[3]! + 1) * 0.5,
      flee: (y[4]! + 1) * 0.5,
      hunt: (y[5]! + 1) * 0.5,
    }
  }

  learn(reward: number) {
    const lr = 0.006
    const target = clamp(reward, -1, 1)
    for (let k = 0; k < OUT; k++) {
      const err = target - this.lastOut[k]!
      for (let j = 0; j < HIDDEN; j++) {
        const idx = j * OUT + k
        this.w2[idx]! += lr * err * this.lastH[j]!
        this.w2[idx] = clamp(this.w2[idx]!, -3, 3)
      }
      this.b2[k]! += lr * err * 0.3
      this.b2[k] = clamp(this.b2[k]!, -1.8, 1.8)
    }
    for (let j = 0; j < HIDDEN; j++) {
      let back = 0
      for (let k = 0; k < OUT; k++) {
        back += (target - this.lastOut[k]!) * this.w2[j * OUT + k]!
      }
      const gate = 1 - this.lastH[j]! * this.lastH[j]!
      for (let i = 0; i < IN; i++) {
        const idx = i * HIDDEN + j
        this.w1[idx]! += lr * back * gate * this.lastIn[i]! * 0.45
        this.w1[idx] = clamp(this.w1[idx]!, -3, 3)
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

export type ScentKind = "fear" | "food" | "blood"

/** Fear / food / blood trails — sharks follow blood, fish fear. */
export class ScentField {
  readonly cols: number
  readonly rows: number
  readonly fear: Float32Array
  readonly food: Float32Array
  readonly blood: Float32Array
  private width = 1
  private height = 1

  constructor(cols = 34, rows = 20) {
    this.cols = cols
    this.rows = rows
    this.fear = new Float32Array(cols * rows)
    this.food = new Float32Array(cols * rows)
    this.blood = new Float32Array(cols * rows)
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
    return this.blood
  }

  deposit(x: number, y: number, kind: ScentKind, amount = 0.55) {
    const grid = this.field(kind)
    const i = this.index(x, y)
    grid[i] = clamp(grid[i]! + amount, 0, 1)
    const neighbors = [i - 1, i + 1, i - this.cols, i + this.cols]
    for (const n of neighbors) {
      if (n < 0 || n >= grid.length) continue
      grid[n] = clamp(grid[n]! + amount * 0.34, 0, 1)
    }
  }

  /** Bilinear sample — avoids cell-edge ticks when agents cross grid lines */
  private sampleField(grid: Float32Array, x: number, y: number) {
    const fx = clamp((x / this.width) * this.cols - 0.5, 0, this.cols - 1.001)
    const fy = clamp((y / this.height) * this.rows - 0.5, 0, this.rows - 1.001)
    const c0 = Math.floor(fx)
    const r0 = Math.floor(fy)
    const c1 = Math.min(this.cols - 1, c0 + 1)
    const r1 = Math.min(this.rows - 1, r0 + 1)
    const tx = fx - c0
    const ty = fy - r0
    const at = (c: number, r: number) => grid[r * this.cols + c]!
    const a = at(c0, r0) * (1 - tx) + at(c1, r0) * tx
    const b = at(c0, r1) * (1 - tx) + at(c1, r1) * tx
    return a * (1 - ty) + b * ty
  }

  sample(x: number, y: number) {
    return {
      fear: this.sampleField(this.fear, x, y),
      food: this.sampleField(this.food, x, y),
      blood: this.sampleField(this.blood, x, y),
    }
  }

  gradient(x: number, y: number, kind: ScentKind) {
    const grid = this.field(kind)
    const e = 2.5
    return {
      x: this.sampleField(grid, x + e, y) - this.sampleField(grid, x - e, y),
      y: this.sampleField(grid, x, y + e) - this.sampleField(grid, x, y - e),
    }
  }

  decay(rate = 0.972) {
    for (let i = 0; i < this.fear.length; i++) {
      this.fear[i]! *= rate
      this.food[i]! *= rate * 0.994
      this.blood[i]! *= rate * 0.96
      if (this.fear[i]! < 0.008) this.fear[i] = 0
      if (this.food[i]! < 0.008) this.food[i] = 0
      if (this.blood[i]! < 0.008) this.blood[i] = 0
    }
  }

  clear() {
    this.fear.fill(0)
    this.food.fill(0)
    this.blood.fill(0)
  }
}

export const TOPO_K = 7
