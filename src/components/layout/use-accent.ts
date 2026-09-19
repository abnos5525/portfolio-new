"use client"

import { useEffect, useState } from "react"

export const accents = ["trust", "energy", "focus"] as const

export type Accent = (typeof accents)[number]

const STORAGE_KEY = "portfolio-accent"

export function useAccent() {
  const [accent, setAccentState] = useState<Accent>("trust")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Accent | null
    const next = stored && accents.includes(stored) ? stored : "trust"
    document.documentElement.dataset.accent = next
    setAccentState(next)
    setReady(true)
  }, [])

  function setAccent(next: Accent) {
    setAccentState(next)
    document.documentElement.dataset.accent = next
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return { accent, setAccent, ready, accents }
}
