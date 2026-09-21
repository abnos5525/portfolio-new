import { buttonVariants } from "@/components/ui/button"
import { education, site, socials, t, type Locale } from "@/content"
import { cn } from "@/lib/utils"

type Proof = {
  label: string
  value: string
}

export function ProofStrip({ proofs }: { proofs: Proof[] }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:mt-10 sm:px-6">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {proofs.map((proof) => (
          <li
            key={proof.label}
            className="border-primary/20 bg-card rounded-xl border px-3 py-3 sm:px-4 sm:py-4"
          >
            <p className="text-primary font-mono text-[0.65rem] tracking-wide">
              {proof.label}
            </p>
            <p className="mt-1 text-sm font-medium text-balance sm:text-[0.95rem]">
              {proof.value}
            </p>
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
      className="scroll-mt-24 mx-auto mt-16 w-full max-w-6xl px-4 sm:mt-24 sm:px-6 md:scroll-mt-28"
    >
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <ul className="mt-6 flex flex-col gap-4 sm:mt-8">
        {education.map((item) => (
          <li
            key={item.id}
            className="border-primary/20 bg-card flex flex-col gap-1 rounded-xl border px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <p className="font-heading text-base font-semibold sm:text-lg">
                {t(item.degree, locale)}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t(item.school, locale)}
              </p>
            </div>
            <p className="text-muted-foreground font-mono text-xs tabular-nums sm:text-sm">
              {t(item.start, locale)}
              <span className="mx-1.5 opacity-50">—</span>
              {t(item.end, locale)}
            </p>
          </li>
        ))}
      </ul>
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
    <section
      id="hire"
      className="scroll-mt-24 mx-auto mt-16 mb-8 w-full max-w-6xl px-4 sm:mt-24 sm:mb-16 sm:px-6 md:scroll-mt-28"
    >
      <div className="border-primary/30 from-primary/12 rounded-2xl border bg-gradient-to-br to-transparent p-5 sm:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6 text-pretty sm:text-base sm:leading-7">
          {body}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-12 w-full justify-center sm:w-auto"
              )}
            >
              {linkedinLabel}
            </a>
          ) : null}
          <a
            href={site.resumePath}
            download
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "min-h-12 w-full justify-center sm:w-auto"
            )}
          >
            {resumeLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
