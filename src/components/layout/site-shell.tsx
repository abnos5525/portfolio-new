import { ForgeCursor } from "@/components/effects/forge-cursor"
import { PointerField } from "@/components/effects/pointer-field"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

type Props = {
  children: React.ReactNode
}

export function SiteShell({ children }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <PointerField />
      <ForgeCursor />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,var(--surface-glow),transparent_60%)]" />
        <div className="forge-spotlight absolute inset-0" />
        <div className="absolute -start-24 top-1/4 size-[28rem] rounded-full bg-[radial-gradient(circle,var(--surface-glow),transparent_70%)] opacity-60 blur-2xl" />
        <div className="absolute -end-16 bottom-0 size-[22rem] rounded-full bg-[radial-gradient(circle,var(--surface-glow),transparent_70%)] opacity-40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent)",
          }}
        />
        <div className="forge-scanlines absolute inset-0 opacity-[0.04]" />
        <div className="border-primary/20 pointer-events-none absolute inset-3 rounded-sm border sm:inset-5" />
        <div className="bg-primary/50 absolute top-3 start-3 size-2 sm:top-5 sm:start-5" />
        <div className="bg-primary/50 absolute top-3 end-3 size-2 sm:top-5 sm:end-5" />
        <div className="bg-primary/50 absolute bottom-3 start-3 size-2 sm:bottom-5 sm:start-5" />
        <div className="bg-primary/50 absolute bottom-3 end-3 size-2 sm:bottom-5 sm:end-5" />
      </div>

      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  )
}
