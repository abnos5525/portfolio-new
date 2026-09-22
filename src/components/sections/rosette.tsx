"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type RefObject } from "react"

type Props = {
  label: string
}

function petals(count: number, cy: number, rx: number, ry: number, solid: boolean) {
  return Array.from({ length: count }, (_, index) => (
    <ellipse
      key={`${cy}-${index}`}
      cx="100"
      cy={cy}
      rx={rx}
      ry={ry}
      transform={`rotate(${(360 / count) * index} 100 100)`}
      fill={solid ? "currentColor" : "none"}
      stroke="var(--primary)"
      strokeWidth="1.15"
    />
  ))
}

function Mark({
  solid,
  groupRef,
}: {
  solid: boolean
  groupRef: RefObject<SVGGElement | null>
}) {
  return (
    <svg viewBox="0 0 200 200" className="h-full max-h-full w-auto" aria-hidden>
      <g ref={groupRef}>
        <circle cx="100" cy="100" r="78" fill="none" stroke="var(--primary)" strokeWidth="1.15" />
        <circle cx="100" cy="100" r="28" fill="none" stroke="var(--primary)" strokeWidth="1.15" />
        {petals(8, 58, 11, 30, solid)}
        {petals(8, 70, 6, 16, solid)}
        <circle cx="100" cy="100" r="3.5" fill="var(--primary)" />
      </g>
    </svg>
  )
}

function splitFromPointer(clientX: number, rect: DOMRect) {
  const ratio = (clientX - rect.left) / rect.width
  return Math.min(88, Math.max(12, ratio * 100))
}

export function Rosette({ label }: Props) {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGGElement>(null)
  const solidRef = useRef<SVGGElement>(null)
  const angle = useRef(0)
  const [split, setSplit] = useState(54)

  useEffect(() => {
    if (reduce) return
    let frame = 0
    const tick = () => {
      angle.current += 0.15
      const turn = `rotate(${angle.current} 100 100)`
      lineRef.current?.setAttribute("transform", turn)
      solidRef.current?.setAttribute("transform", turn)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  function move(clientX: number) {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setSplit(splitFromPointer(clientX, rect))
  }

  return (
    <section className="page-gutter mx-auto mt-16 w-full max-w-6xl sm:mt-24">
      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={12}
        aria-valuemax={88}
        aria-valuenow={Math.round(split)}
        className="relative h-64 w-full cursor-col-resize touch-none select-none sm:h-80 lg:h-96"
        onPointerDown={(event) => {
          move(event.clientX)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          move(event.clientX)
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
          event.preventDefault()
          const delta = event.key === "ArrowRight" ? 6 : -6
          setSplit((current) => Math.min(88, Math.max(12, current + delta)))
        }}
      >
        <div
          className="text-primary absolute inset-0 flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <Mark solid={false} groupRef={lineRef} />
        </div>
        <div
          className="text-primary absolute inset-0 flex items-center justify-center"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        >
          <Mark solid groupRef={solidRef} />
        </div>
        <div
          aria-hidden
          className="bg-primary absolute inset-y-6 w-px"
          style={{ left: `${split}%` }}
        >
          <span className="bg-primary absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </section>
  )
}
