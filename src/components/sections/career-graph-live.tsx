"use client"

import { useEffect, useRef, useState } from "react"

import type { CareerGraphData, GraphNode } from "@/content/career-graph"
import { cn } from "@/lib/utils"

type Props = {
  data: CareerGraphData
  title: string
  support: string
  companyLegend: string
  skillLegend: string
  hint: string
}

type SimNode = GraphNode & {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

type SimEdge = { source: number; target: number }

function preferReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function readAccent(): string {
  if (typeof window === "undefined") return "#5eead4"
  return (
    getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() ||
    "#5eead4"
  )
}

export function CareerGraphLive({
  data,
  title,
  support,
  companyLegend,
  skillLegend,
  hint,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const dragRef = useRef<{ index: number; dx: number; dy: number } | null>(null)
  const hoverRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap || data.nodes.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let alive = true
    const reduce = preferReducedMotion()

    const nodes: SimNode[] = data.nodes.map((node, index) => {
      const angle = (index / data.nodes.length) * Math.PI * 2
      const isCompany = node.kind === "company"
      return {
        ...node,
        x: Math.cos(angle) * (isCompany ? 90 : 160),
        y: Math.sin(angle) * (isCompany ? 90 : 160),
        vx: 0,
        vy: 0,
        r: isCompany ? 22 : 14,
      }
    })

    const indexOf = new Map(nodes.map((node, index) => [node.id, index]))
    const edges: SimEdge[] = data.edges
      .map((edge) => {
        const source = indexOf.get(edge.source)
        const target = indexOf.get(edge.target)
        if (source == null || target == null) return null
        return { source, target }
      })
      .filter((edge): edge is SimEdge => edge !== null)

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      width = Math.max(320, rect.width)
      height = Math.max(360, Math.min(520, rect.width * 0.55))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const step = () => {
      const cx = width / 2
      const cy = height / 2

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!
          const b = nodes[j]!
          let dx = b.x - a.x
          let dy = b.y - a.y
          let dist = Math.hypot(dx, dy) || 0.01
          const min = a.r + b.r + 28
          if (dist < min) {
            const push = ((min - dist) / dist) * 0.08
            dx *= push
            dy *= push
            a.vx -= dx
            a.vy -= dy
            b.vx += dx
            b.vy += dy
          } else {
            const force = 220 / (dist * dist)
            dx = (dx / dist) * force
            dy = (dy / dist) * force
            a.vx -= dx
            a.vy -= dy
            b.vx += dx
            b.vy += dy
          }
        }
      }

      for (const edge of edges) {
        const a = nodes[edge.source]!
        const b = nodes[edge.target]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 0.01
        const target = 120
        const pull = ((dist - target) / dist) * 0.02
        a.vx += dx * pull
        a.vy += dy * pull
        b.vx -= dx * pull
        b.vy -= dy * pull
      }

      const drag = dragRef.current
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        if (drag?.index === i) continue
        node.vx += (cx - node.x) * 0.004
        node.vy += (cy - node.y) * 0.004
        node.vx *= 0.86
        node.vy *= 0.86
        node.x += node.vx
        node.y += node.vy
        node.x = Math.min(width - node.r - 8, Math.max(node.r + 8, node.x))
        node.y = Math.min(height - node.r - 8, Math.max(node.r + 8, node.y))
      }
    }

    const draw = () => {
      const accent = readAccent()
      const styles = getComputedStyle(document.documentElement)
      const fg = styles.getPropertyValue("--foreground").trim() || "#f5f5f4"
      const muted = styles.getPropertyValue("--muted-foreground").trim() || "#a8a29e"
      const border = styles.getPropertyValue("--border").trim() || "#292524"

      ctx.clearRect(0, 0, width, height)

      const hover = hoverRef.current
      const linked = new Set<number>()
      if (hover != null) {
        linked.add(hover)
        for (const edge of edges) {
          if (edge.source === hover || edge.target === hover) {
            linked.add(edge.source)
            linked.add(edge.target)
          }
        }
      }

      for (const edge of edges) {
        const a = nodes[edge.source]!
        const b = nodes[edge.target]!
        const active = hover == null || linked.has(edge.source)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = accent
        ctx.globalAlpha = active ? 0.35 : 0.08
        ctx.lineWidth = active ? 1.5 : 1
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!
        const active = hover == null || linked.has(i)
        const company = node.kind === "company"

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        if (company) {
          ctx.fillStyle = accent
          ctx.globalAlpha = active ? 0.92 : 0.25
          ctx.fill()
        } else {
          ctx.fillStyle = border
          ctx.globalAlpha = active ? 1 : 0.25
          ctx.fill()
          ctx.strokeStyle = accent
          ctx.lineWidth = 1.25
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        ctx.font = company
          ? "600 12px var(--font-sans), system-ui, sans-serif"
          : "500 11px var(--font-sans), system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = company ? fg : active ? fg : muted
        if (company) {
          ctx.fillStyle = styles.getPropertyValue("--primary-foreground").trim() || "#0c0a09"
        }
        const label =
          node.label.length > 14 ? `${node.label.slice(0, 13)}…` : node.label
        if (company) {
          ctx.fillText(label, node.x, node.y)
        } else {
          ctx.fillStyle = active ? fg : muted
          ctx.fillText(label, node.x, node.y + node.r + 12)
        }
      }
    }

    const hitTest = (x: number, y: number) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]!
        if (Math.hypot(node.x - x, node.y - y) <= node.r + 6) return i
      }
      return null
    }

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const index = hitTest(x, y)
      if (index == null) return
      const node = nodes[index]!
      dragRef.current = { index, dx: node.x - x, dy: node.y - y }
      canvas.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const drag = dragRef.current
      if (drag) {
        const node = nodes[drag.index]!
        node.x = x + drag.dx
        node.y = y + drag.dy
        node.vx = 0
        node.vy = 0
      } else {
        hoverRef.current = hitTest(x, y)
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      dragRef.current = null
      try {
        canvas.releasePointerCapture(event.pointerId)
      } catch {
        /* already released */
      }
    }

    const onPointerLeave = () => {
      if (!dragRef.current) hoverRef.current = null
    }

    resize()
    if (reduce) {
      for (let i = 0; i < 180; i++) step()
      draw()
    } else {
      const loop = () => {
        if (!alive) return
        step()
        draw()
        raf = window.requestAnimationFrame(loop)
      }
      raf = window.requestAnimationFrame(loop)
    }

    setReady(true)

    const observer = new ResizeObserver(() => {
      resize()
      if (reduce) draw()
    })
    observer.observe(wrap)

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerup", onPointerUp)
    canvas.addEventListener("pointercancel", onPointerUp)
    canvas.addEventListener("pointerleave", onPointerLeave)

    return () => {
      alive = false
      window.cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", onPointerUp)
      canvas.removeEventListener("pointercancel", onPointerUp)
      canvas.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [data])

  return (
    <section
      id="career-graph"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <div className="max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold sm:text-5xl">{title}</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-7 text-pretty sm:text-base">
          {support}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:mt-8">
        <span className="inline-flex items-center gap-2">
          <span className="bg-primary size-2.5 rounded-full" aria-hidden />
          {companyLegend}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="border-primary size-2.5 rounded-full border" aria-hidden />
          {skillLegend}
        </span>
        <span className="text-muted-foreground">{hint}</span>
      </div>

      <div
        ref={wrapRef}
        className={cn(
          "border-border bg-card/30 mt-5 overflow-hidden border",
          !ready && "min-h-[360px]"
        )}
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          aria-label={title}
        />
      </div>
    </section>
  )
}
