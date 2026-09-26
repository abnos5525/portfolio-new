"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

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
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

/** One-shot scroll reveal — for career chapters, not every card on the site. */
export function ScrollReveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type NameProps = {
  text: string
  className?: string
}

/** Reveal the whole name as one connected string — never split Persian glyphs. */
export function MonumentName({ text, className }: NameProps) {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  if (!ready || reduce) {
    return <h1 className={className}>{text}</h1>
  }

  return (
    <h1 className={className}>
      <motion.span
        className="block overflow-visible pb-[0.12em]"
        initial={{ clipPath: "inset(0 0 100% 0)", y: 20 }}
        animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </h1>
  )
}
