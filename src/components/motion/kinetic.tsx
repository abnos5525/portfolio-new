"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeRise({
  children,
  className,
  delay = 0,
  y = 18,
}: Props) {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  if (!ready || reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type KineticProps = {
  text: string
  className?: string
  as?: "h1" | "p" | "span"
  delay?: number
}

export function KineticText({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
}: KineticProps) {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const chars = Array.from(text)

  useEffect(() => setReady(true), [])

  if (!ready || reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={cn("overflow-hidden", className)} aria-label={text}>
      <span aria-hidden className="inline-flex flex-wrap justify-start">
        {chars.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block whitespace-pre"
            initial={{ y: "110%", rotate: 6, opacity: 0 }}
            animate={{ y: "0%", rotate: 0, opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: delay + index * 0.028,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </Tag>
  )
}
