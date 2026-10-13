"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { FISH_COUNT, SHARK_COUNT } from "@/lib/flock-colony"
import {
  PRESETS,
  startOceanRuntime,
  type FlockFieldProps,
  type Mode,
  type OceanStats,
  type Preset,
  type RuleFocus,
} from "@/lib/flock"
import { cn } from "@/lib/utils"

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
  school,
  calm,
  frenzy,
  mind: mindLabel,
  clearWalls,
  fishLabel,
  sharkLabel,
  orderLabel,
  foodLabel,
  eatenLabel,
  energyLabel,
  sepTitle,
  sepBody,
  aliTitle,
  aliBody,
  cohTitle,
  cohBody,
  rulesHint,
}: FlockFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>("attract")
  const [preset, setPreset] = useState<Preset>("school")
  const [mindOn, setMindOn] = useState(true)
  const [ruleFocus, setRuleFocus] = useState<RuleFocus>(null)
  const [clearTick, setClearTick] = useState(0)
  const [stats, setStats] = useState<OceanStats>({
    fish: FISH_COUNT,
    sharks: SHARK_COUNT,
    order: 0,
    food: 0,
    eaten: 0,
    energy: 0,
  })

  const modeRef = useRef(mode)
  const rulesRef = useRef(PRESETS.school)
  const trailsRef = useRef(true)
  const senseRef = useRef(true)
  const mindRef = useRef(true)
  const focusRef = useRef<RuleFocus>(null)
  const clearSignal = useRef(0)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])
  useEffect(() => {
    rulesRef.current = PRESETS[preset]
  }, [preset])
  useEffect(() => {
    // One toggle: brain + scent overlay together
    mindRef.current = mindOn
    senseRef.current = mindOn
  }, [mindOn])
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
        { id: "school" as const, label: school },
        { id: "calm" as const, label: calm },
        { id: "frenzy" as const, label: frenzy },
      ] as const,
    [school, calm, frenzy]
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
    return startOceanRuntime({
      canvas,
      wrap,
      controls: {
        mode: modeRef,
        rules: rulesRef,
        trails: trailsRef,
        sense: senseRef,
        mind: mindRef,
        focus: focusRef,
        clearSignal,
      },
      onStats: setStats,
    })
  }, [])

  const orderPct = Math.round(stats.order)
  const energyPct = Math.round(stats.energy)

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
            aria-pressed={mindOn}
            onClick={() => setMindOn((v) => !v)}
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
            onClick={() => setClearTick((v) => v + 1)}
            className="focus-visible:ring-ring border-border text-muted-foreground hover:text-foreground min-h-9 rounded-lg border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            {clearWalls}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground font-mono text-[11px] tabular-nums">
          {fishLabel} {stats.fish}
          <span className="mx-2 opacity-40">·</span>
          {sharkLabel} {stats.sharks}
          <span className="mx-2 opacity-40">·</span>
          {orderLabel} {orderPct}%
          <span className="mx-2 opacity-40">·</span>
          {energyLabel} {energyPct}%
          <span className="mx-2 opacity-40">·</span>
          {foodLabel} {stats.food}
          <span className="mx-2 opacity-40">·</span>
          {eatenLabel} {stats.eaten}
        </p>
        <div
          className="bg-muted/50 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full"
          aria-hidden
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(100, energyPct)}%` }}
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
