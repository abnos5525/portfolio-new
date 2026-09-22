import { BitcoinChartLive } from "@/components/sections/bitcoin-chart-live"
import type { Locale } from "@/content"
import type { BtcRange } from "@/lib/btc"
import { getBtcSeries } from "@/lib/btc-feed"

type Props = {
  locale: Locale
  title: string
  unit: string
  unavailable: string
  lowLabel: string
  highLabel: string
  rangesLabel: string
  ranges: Record<BtcRange, string>
}

export async function BitcoinChart(props: Props) {
  const series = await getBtcSeries()
  return <BitcoinChartLive initial={series} {...props} />
}
