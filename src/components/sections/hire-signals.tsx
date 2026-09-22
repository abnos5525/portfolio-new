import { education, site, socials, t, type Locale } from "@/content"

type Proof = {
  label: string
  value: string
}

export function ProofStrip({ proofs }: { proofs: Proof[] }) {
  return (
    <section className="page-gutter mx-auto mt-10 w-full max-w-6xl sm:mt-14">
      <ul className="border-border divide-border divide-y border-y">
        {proofs.map((proof, index) => (
          <li
            key={proof.label}
            className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-3.5 sm:grid-cols-[2.75rem_7.5rem_1fr] sm:gap-x-6 sm:py-4"
          >
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-primary text-xs font-medium sm:text-sm">
              {proof.label}
            </span>
            <span className="col-start-2 text-sm font-medium text-balance sm:col-start-3 sm:text-base">
              {proof.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function EducationSection({
  locale,
  title,
}: {
  locale: Locale
  title: string
}) {
  return (
    <section
      id="education"
      className="page-gutter scroll-mt-24 mx-auto mt-16 w-full max-w-6xl sm:mt-24 md:scroll-mt-28"
    >
      <h2 className="font-heading text-2xl font-semibold sm:text-4xl">{title}</h2>
      <ol className="border-primary/35 relative mt-8 border-s ps-6 sm:mt-10 sm:ps-8">
        {education.map((item) => (
          <li key={item.id} className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="bg-primary ring-background absolute top-1.5 -start-[1.85rem] size-2.5 rounded-full ring-4 sm:-start-[2.35rem]"
            />
            <p className="text-muted-foreground font-mono text-xs tabular-nums">
              {t(item.start, locale)}
              <span className="mx-1.5 opacity-50">—</span>
              {t(item.end, locale)}
            </p>
            <p className="font-heading mt-2 text-xl leading-snug font-semibold text-balance sm:text-3xl">
              {t(item.degree, locale)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {t(item.school, locale)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function HireBand({
  title,
  body,
  linkedinLabel,
  resumeLabel,
}: {
  title: string
  body: string
  linkedinLabel: string
  resumeLabel: string
}) {
  const linkedin = socials.find((item) => item.id === "linkedin")

  return (
    <section id="hire" className="scroll-mt-24 bg-primary text-primary-foreground mt-20 md:scroll-mt-28">
      <div className="page-gutter mx-auto flex w-full max-w-6xl flex-col gap-6 py-14 sm:py-20">
        <h2 className="font-heading max-w-3xl text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.15] font-semibold text-balance">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-8 text-pretty opacity-85 sm:text-lg">
          {body}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="bg-primary-foreground text-primary focus-visible:ring-primary-foreground inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none sm:w-auto"
            >
              {linkedinLabel}
            </a>
          ) : null}
          <a
            href={site.resumePath}
            download
            className="border-primary-foreground/45 focus-visible:ring-primary-foreground inline-flex min-h-12 w-full items-center justify-center rounded-lg border px-5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none sm:w-auto"
          >
            {resumeLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
