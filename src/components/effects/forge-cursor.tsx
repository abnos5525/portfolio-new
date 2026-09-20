"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** Crosshair forge cursor — fine pointers only; respects reduced motion. */
export function ForgeCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setEnabled(fine.matches && !reduce.matches)
    sync()
    fine.addEventListener("change", sync)
    reduce.addEventListener("change", sync)
    return () => {
      fine.removeEventListener("change", sync)
      reduce.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add("forge-cursor-active")

    const onMove = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      document.documentElement.classList.remove("forge-cursor-active")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed start-0 top-0 z-[100] mix-blend-difference transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      <div
        className={cn(
          "relative -translate-x-1/2 -translate-y-1/2 transition-transform duration-150",
          pressed ? "scale-75" : "scale-100"
        )}
      >
        <span className="bg-primary absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <span className="border-primary/80 absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
        <span className="bg-primary/70 absolute top-1/2 -left-3 h-px w-2 -translate-y-1/2" />
        <span className="bg-primary/70 absolute top-1/2 -right-3 h-px w-2 -translate-y-1/2" />
        <span className="bg-primary/70 absolute -top-3 left-1/2 h-2 w-px -translate-x-1/2" />
        <span className="bg-primary/70 absolute -bottom-3 left-1/2 h-2 w-px -translate-x-1/2" />
      </div>
    </div>
  )
}
