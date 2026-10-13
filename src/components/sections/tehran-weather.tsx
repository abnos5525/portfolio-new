import { TehranWeatherLive } from "@/components/sections/tehran-weather-live"
import type { Locale } from "@/content"
import { getTehranWeather } from "@/lib/weather"

type Props = {
  locale: Locale
  title: string
  liveLabel: string
  tempUnit: string
  humidityLabel: string
  windLabel: string
  windUnit: string
  dayLabel: string
  unavailable: string
  lowLabel: string
  highLabel: string
}

export async function TehranWeather(props: Props) {
  const initial = await getTehranWeather()
  return <TehranWeatherLive initial={initial} {...props} />
}
