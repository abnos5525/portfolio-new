import type { Education } from "./types"

export const education: Education[] = [
  {
    id: "masters",
    school: {
      fa: "دانشگاه آزاد تهران مرکز",
      en: "Islamic Azad University — Tehran Central",
    },
    degree: {
      fa: "کارشناسی ارشد نرم‌افزار",
      en: "M.Sc. Software Engineering",
    },
    start: { fa: "۱۴۰۴", en: "2025" },
    end: { fa: "در حال تحصیل", en: "Present" },
    current: true,
  },
  {
    id: "bachelors",
    school: {
      fa: "دانشگاه آزاد اسلامشهر",
      en: "Islamic Azad University — Islamshahr",
    },
    degree: {
      fa: "کارشناسی مهندسی کامپیوتر — نرم‌افزار",
      en: "B.Sc. Computer Software Engineering",
    },
    start: { fa: "۱۴۰۰", en: "2021" },
    end: { fa: "۱۴۰۴", en: "2025" },
  },
]
