"use client"

type Props = {
  items: string[]
}

export function StackMarquee({ items }: Props) {
  const loop = [...items, ...items]

  return (
    <div className="relative mt-14 -mx-4 overflow-hidden sm:-mx-6">
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r to-transparent rtl:bg-gradient-to-l"
      />
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l to-transparent rtl:bg-gradient-to-r"
      />
      <div className="border-border/40 border-y py-3">
        <ul className="animate-marquee flex w-max gap-10 pe-10" translate="no">
          {loop.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="text-muted-foreground font-heading text-sm tracking-[0.18em] uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
