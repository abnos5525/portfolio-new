import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { MobileDock } from "@/components/layout/mobile-dock"
import { PointerField } from "@/components/effects/pointer-field"
import { SmoothScroll } from "@/components/motion/smooth-scroll"

type Props = {
  children: React.ReactNode
}

export function SiteShell({ children }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col pb-24 md:pb-0">
      <SmoothScroll />
      <PointerField />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,var(--surface-glow),transparent_58%)]" />
        <div className="engineering-grid absolute inset-0" />
        <div className="forge-spotlight absolute inset-0 hidden opacity-60 lg:block" />
        <div className="grain-overlay absolute inset-0 opacity-[0.07]" />
      </div>

      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
      <MobileDock />
    </div>
  )
}
