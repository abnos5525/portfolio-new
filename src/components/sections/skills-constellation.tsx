"use client"

import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import type { Skill } from "@/content"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  tag: string
  skills: Skill[]
}

/** Scatter constellation of skills — soft float + hover lift. */
export function SkillsConstellation({ title, tag, skills }: Props) {
  const reduce = useReducedMotion()

  return (
    <section
      id="skills"
      className="scroll-mt-28 relative mt-24 mb-24 overflow-hidden sm:mt-28 sm:mb-28"
    >
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          {title}
        </h2>
        <span
          aria-hidden
          className="text-primary/40 font-mono text-[0.65rem] tracking-[0.2em]"
        >
          {tag}
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 h-64 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--surface-glow), transparent 65%)",
        }}
      />

      <ul className="relative flex flex-wrap content-start gap-2.5 sm:gap-3">
        {skills.map((skill, index) => (
          <motion.li
            key={skill.id}
            initial={reduce ? false : { opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: Math.min(index * 0.02, 0.4),
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reduce ? undefined : { scale: 1.08, y: -4 }}
            className={cn(
              "origin-center",
              !reduce && (index % 2 === 0 ? "motion-safe:animate-float-a" : "motion-safe:animate-float-b")
            )}
            style={
              reduce
                ? undefined
                : { animationDelay: `${(index % 7) * 0.15}s` }
            }
          >
            <Badge
              variant="secondary"
              className="border-border/50 hover:border-primary/50 hover:text-primary cursor-default px-3 py-1.5 font-mono text-[0.75rem] transition-colors"
            >
              {skill.name}
            </Badge>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
