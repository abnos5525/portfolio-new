import { GithubPulseLive } from "@/components/sections/github-pulse-live"
import type { Locale } from "@/content"
import { getGithubPulse } from "@/lib/github-pulse"

type Props = {
  locale: Locale
  title: string
  support: string
  weekLabel: string
  lastLabel: string
  unavailable: string
  liveLabel: string
  activityLabel: string
  languagesLabel: string
  latestLabel: string
}

export async function GithubPulse(props: Props) {
  const pulse = await getGithubPulse()
  return <GithubPulseLive initial={pulse} {...props} />
}
