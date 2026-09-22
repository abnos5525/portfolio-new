import type { LocalizedString } from "./types"

/** Hiring copy for repos we know. Unknown recent repos fall back to the GitHub description. */
export const publicWorkSummaries: Record<string, LocalizedString> = {
  "portfolio-new": {
    fa: "همین پورتفولیو",
    en: "This portfolio",
  },
  "mediamtx-dynamic": {
    fa: "کار روی MediaMTX برای پیکربندی پویا",
    en: "Dynamic configuration work around MediaMTX",
  },
  cardGame1: {
    fa: "بازی کارتی",
    en: "A card game",
  },
  "chat-app": {
    fa: "اپ گفتگوی تحت وب",
    en: "A web chat application",
  },
  leave_request_nestjs: {
    fa: "سرویس درخواست مرخصی با NestJS",
    en: "Leave-request service built with NestJS",
  },
  "tic-tac-toe-AI": {
    fa: "بازی دوز",
    en: "A tic-tac-toe game",
  },
  leave_request_java: {
    fa: "همان دامنه مرخصی، این بار با Java",
    en: "The same leave domain, this time in Java",
  },
}
