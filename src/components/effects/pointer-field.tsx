"use client"

import { useEffect } from "react"

/** Drives --pointer-x/y on <html> for spotlight & parallax (desktop only). */
export function PointerField() {
  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia("(pointer: fine)")
    if (!media.matches) return

    const onMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`)
      root.style.setProperty("--pointer-y", `${event.clientY}px`)
      root.style.setProperty(
        "--pointer-nx",
        `${(event.clientX / window.innerWidth - 0.5) * 2}`
      )
      root.style.setProperty(
        "--pointer-ny",
        `${(event.clientY / window.innerHeight - 0.5) * 2}`
      )
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return null
}
