import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { PointerField } from "@/components/effects/pointer-field"
import { SmoothScroll } from "@/components/motion/smooth-scroll"

type Props = {
  children: React.ReactNode
}

export function SiteShell({ children }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SmoothScroll />
      <PointerField />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_80%_-8%,var(--surface-glow),transparent_58%)]" />
        <div className="forge-spotlight absolute inset-0 opacity-70" />
        <div className="absolute -start-40 top-[20%] size-[36rem] rounded-full bg-[radial-gradient(circle,var(--surface-glow),transparent_70%)] opacity-50 blur-3xl" />
        <div className="grain-overlay absolute inset-0 opacity-[0.09]" />
      </div>

      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  )
}
