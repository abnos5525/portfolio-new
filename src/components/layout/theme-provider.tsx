"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"

type ThemeName = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeValue = {
  theme: ThemeName
  setTheme: (theme: string) => void
  resolvedTheme: ResolvedTheme
}

const ThemeContext = createContext<ThemeValue | null>(null)
const storageKey = "theme"

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function asTheme(value: string | null): ThemeName {
  if (value === "light" || value === "dark" || value === "system") return value
  return "dark"
}

function resolveTheme(theme: ThemeName): ResolvedTheme {
  if (theme === "system") return systemTheme()
  return theme
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

function applyWithoutTransition(theme: ResolvedTheme) {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important}"
    )
  )
  document.head.appendChild(style)
  applyTheme(theme)
  window.getComputedStyle(document.body)
  window.setTimeout(() => style.remove(), 1)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark")

  useLayoutEffect(() => {
    const stored = asTheme(window.localStorage.getItem(storageKey))
    const resolved = resolveTheme(stored)
    setThemeState(stored)
    setResolvedTheme(resolved)
    applyTheme(resolved)

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onScheme = () => {
      if (window.localStorage.getItem(storageKey) !== "system") return
      const next = systemTheme()
      setResolvedTheme(next)
      applyTheme(next)
    }
    media.addEventListener("change", onScheme)
    return () => media.removeEventListener("change", onScheme)
  }, [])

  const setTheme = useCallback((next: string) => {
    const themeName = asTheme(next)
    const resolved = resolveTheme(themeName)
    setThemeState(themeName)
    setResolvedTheme(resolved)
    window.localStorage.setItem(storageKey, themeName)
    applyWithoutTransition(resolved)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return value
}
