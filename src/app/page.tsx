import { ArrowLeftIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--surface-glow),transparent_55%)]"
      />

      <div className="relative z-10 w-full max-w-lg space-y-8 text-center">
        <div className="space-y-3">
          <Badge variant="secondary">shadcn/ui · قدم 4/32</Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Hossein Heidary
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Frontend engineer — React, TypeScript, modern UI systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            مشاهده پروژه‌ها
            <ArrowLeftIcon data-icon="inline-end" className="rtl:rotate-180" />
          </Button>
          <Button size="lg" variant="outline">
            دانلود رزومه
          </Button>
        </div>

        <Separator />

        <Card className="text-start">
          <CardHeader>
            <CardTitle>Design tokens</CardTitle>
            <CardDescription>
              Trust accent فعال است. Energy و Focus در قدم تم‌ها وصل می‌شوند.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Trust (active)</Badge>
            <Badge variant="outline">Energy</Badge>
            <Badge variant="secondary">Focus</Badge>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
