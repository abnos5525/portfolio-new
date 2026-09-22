import { Skeleton } from "@/components/ui/skeleton"

export function ClockSkeleton() {
  return (
    <div className="border-border flex items-end justify-between gap-4 border-b pt-5 pb-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-10 sm:py-16">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-14 w-4/5 max-w-xl sm:h-20" />
      <Skeleton className="mx-auto size-40 rounded-full sm:size-48" />
      <Skeleton className="h-5 w-full max-w-md" />
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-12 w-full sm:w-40" />
        <Skeleton className="h-12 w-full sm:w-40" />
      </div>
    </div>
  )
}

function AboutSkeleton() {
  return (
    <div className="mt-10 flex max-w-3xl flex-col gap-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-full max-w-xl" />
    </div>
  )
}

function ProofSkeleton() {
  return (
    <div className="page-gutter mx-auto mt-10 w-full max-w-6xl sm:mt-14">
      <div className="border-border divide-border divide-y border-y">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ExperienceSkeleton() {
  return (
    <div className="page-gutter mx-auto mt-16 w-full max-w-6xl sm:mt-24">
      <Skeleton className="h-9 w-40 sm:h-12" />
      <div className="mt-8 flex flex-col gap-8 sm:mt-12">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border-border flex flex-col gap-4 border-t px-4 py-8 sm:px-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsSkeleton() {
  return (
    <div className="border-border bg-card/50 mt-20 border-y">
      <div className="page-gutter mx-auto flex w-full max-w-6xl flex-col gap-6 py-12 sm:py-16">
        <Skeleton className="h-9 w-32 sm:h-12" />
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EducationSkeleton() {
  return (
    <div className="page-gutter mx-auto mt-16 w-full max-w-6xl sm:mt-24">
      <Skeleton className="h-9 w-28 sm:h-12" />
      <div className="mt-8 flex flex-col gap-8">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HireSkeleton() {
  return (
    <div className="bg-muted mt-20">
      <div className="page-gutter mx-auto flex w-full max-w-6xl flex-col gap-5 py-14 sm:py-20">
        <Skeleton className="bg-background/40 h-12 w-64" />
        <Skeleton className="bg-background/40 h-16 w-full max-w-xl" />
        <Skeleton className="bg-background/40 h-12 w-full sm:w-40" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <main aria-busy="true" className="w-full flex-1">
      <div className="page-gutter mx-auto w-full max-w-6xl">
        <ClockSkeleton />
        <HeroSkeleton />
        <AboutSkeleton />
      </div>
      <ProofSkeleton />
      <ExperienceSkeleton />
      <SkillsSkeleton />
      <EducationSkeleton />
      <HireSkeleton />
    </main>
  )
}
