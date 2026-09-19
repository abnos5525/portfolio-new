export default function Home() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1f3a3a_0%,_#0b1212_55%,_#070a0a_100%)]"
      />
      <div className="relative z-10 max-w-2xl text-center text-zinc-100">
        <p className="text-sm tracking-[0.2em] text-teal-300/80 uppercase">
          Scaffold ready · قدم 3/32
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Hossein Heidary
        </h1>
        <p className="mt-4 text-base text-zinc-300 sm:text-lg">
          Frontend engineer — React, TypeScript, modern UI systems.
        </p>
        <p className="mt-8 text-sm text-zinc-500">
          Next.js 16 · React 19 · TypeScript · Tailwind CSS v4
        </p>
      </div>
    </main>
  );
}
