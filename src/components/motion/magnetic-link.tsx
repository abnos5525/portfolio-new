"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  className?: string
  href: string
  download?: boolean | string
}

export function MagneticLink({
  children,
  className,
  href,
  download,
}: Props) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18 })
  const springY = useSpring(y, { stiffness: 260, damping: 18 })

  if (reduce) {
    return (
      <a href={href} download={download} className={className}>
        {children}
      </a>
    )
  }

  return (
    <motion.a
      href={href}
      download={download}
      className={cn("inline-flex", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        x.set(dx * 0.28)
        y.set(dy * 0.28)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.a>
  )
}
