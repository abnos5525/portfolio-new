"use client"

import { useEffect, useState } from "react"

import { VerseSkeleton } from "@/components/sections/page-skeleton"
import { hafezFallback, type HafezCouplet } from "@/lib/ganjoor"

function isCouplet(value: unknown): value is HafezCouplet {
  if (!value || typeof value !== "object") return false
  const row = value as Record<string, unknown>
  return (
    Array.isArray(row.lines) &&
    row.lines.length === 2 &&
    typeof row.lines[0] === "string" &&
    typeof row.lines[1] === "string" &&
    typeof row.title === "string" &&
    typeof row.href === "string"
  )
}

export function HafezVerse() {
  const [verse, setVerse] = useState<HafezCouplet | null>(null)

  useEffect(() => {
    try {
      localStorage.removeItem("hafez-couplet")
    } catch (error) {
      console.error("Hafez couplet clear failed", error)
    }

    const controller = new AbortController()
    let active = true

    fetch("/api/hafez", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Hafez route returned ${response.status}`)
        }
        const payload: unknown = await response.json()
        if (!isCouplet(payload)) {
          throw new Error("Hafez route returned an unexpected shape")
        }
        if (active) setVerse(payload)
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return
        console.error("Hafez verse refresh failed", error)
        setVerse(hafezFallback)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  if (!verse) return <VerseSkeleton />

  return (
    <section className="page-gutter mx-auto w-full max-w-6xl pt-6 sm:pt-8">
      <figure>
        <blockquote className="border-0 p-0">
          <p className="font-verse overflow-x-auto text-[0.95rem] leading-8 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] sm:text-base lg:text-lg [&::-webkit-scrollbar]:hidden">
            <span>{verse.lines[0]}</span>
            <span className="text-primary/70 mx-2.5 sm:mx-3" aria-hidden>
              ·
            </span>
            <span className="text-foreground/85">{verse.lines[1]}</span>
          </p>
        </blockquote>
        <figcaption className="mt-2">
          <a
            href={verse.href}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            {verse.title}
          </a>
        </figcaption>
      </figure>
    </section>
  )
}
