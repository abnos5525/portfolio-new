"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

const ORBIT = [
  "React",
  "Next.js",
  "NestJS",
  "Spring Boot",
  "TypeScript",
  "PostgreSQL",
] as const

type Props = {
  className?: string
}

/** Techs travel on an ellipse — craft, not a fake product widget. */
export function OrbitStack({ className }: Props) {
  const reduce = useReducedMotion()
  const itemsRef = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    if (reduce) return

    const nodes = itemsRef.current.filter(Boolean) as HTMLLIElement[]
    if (!nodes.length) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = (now - start) / 18000
      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2 + t * Math.PI * 2
        const x = Math.cos(angle) * 42
        const y = Math.sin(angle) * 28
        const depth = (Math.sin(angle) + 1) / 2
        node.style.transform = `translate(${x}%, ${y}%) scale(${0.86 + depth * 0.22})`
        node.style.opacity = String(0.45 + depth * 0.55)
        node.style.zIndex = String(Math.round(depth * 10))
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  return (
    <div
      aria-hidden
      className={className}
    >
      <div className="relative mx-auto aspect-square w-[min(100%,26rem)]">
        <div className="border-primary/25 absolute inset-[18%] rounded-full border" />
        <div className="border-primary/15 absolute inset-[8%] rounded-[45%] border" />
        <div className="bg-primary/20 absolute top-1/2 start-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_24px_var(--primary)]" />
        <ul className="absolute inset-0">
          {ORBIT.map((item, index) => (
            <li
              key={item}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              translate="no"
              className="bg-card/80 text-foreground absolute top-1/2 start-1/2 -ms-[4.5rem] -mt-4 w-36 rounded-full border px-3 py-1.5 text-center text-sm font-medium backdrop-blur-md"
              style={
                reduce
                  ? {
                      transform: `translate(${Math.cos((index / ORBIT.length) * Math.PI * 2) * 42}%, ${Math.sin((index / ORBIT.length) * Math.PI * 2) * 28}%)`,
                    }
                  : undefined
              }
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
