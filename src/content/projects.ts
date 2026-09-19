import type { Project } from "./types"

export const projects: Project[] = [
  {
    id: "coffee-app",
    title: { fa: "اپلیکیشن کافی‌شاپ", en: "Coffee App" },
    summary: {
      fa: "رابط کاربری فروشگاهی برای سفارش و نمایش محصولات کافی‌شاپ.",
      en: "Storefront UI for browsing and ordering coffee products.",
    },
    image: "/images/projects/coffee.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "live",
    liveUrl: "https://abnos5525.github.io/coffee-app/",
    featured: true,
  },
  {
    id: "portfolio-app",
    title: { fa: "پورتفولیو شخصی", en: "Personal Portfolio" },
    summary: {
      fa: "نسخه قبلی پورتفولیو با تمرکز روی معرفی و پروژه‌ها.",
      en: "Earlier portfolio focused on intro and project showcase.",
    },
    image: "/images/projects/portfolio1.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "live",
    liveUrl: "https://abnos5525.github.io/portfolio-app/",
    featured: true,
  },
  {
    id: "portfolio-v1",
    title: { fa: "پورتفولیو نسخه یک", en: "Portfolio v1" },
    summary: {
      fa: "نسخه آزمایشی پورتفولیو با چیدمان متفاوت.",
      en: "Experimental portfolio layout iteration.",
    },
    image: "/images/projects/portfolio2.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "live",
    liveUrl: "https://abnos5525.github.io/portfolio1/",
    featured: false,
  },
  {
    id: "top-movies",
    title: { fa: "تاپ موویز", en: "Top Movies" },
    summary: {
      fa: "ویترین فیلم‌ها با کارت‌ها و مرور سریع محتوا.",
      en: "Movie showcase with card-based browsing UI.",
    },
    image: "/images/projects/movie.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "live",
    liveUrl: "https://abnos5525.github.io/top-movies/",
    featured: true,
  },
  {
    id: "restaurant",
    title: { fa: "رستوران", en: "Restaurant" },
    summary: {
      fa: "صفحه معرفی رستوران با منو و بخش‌های محتوایی.",
      en: "Restaurant landing page with menu-style sections.",
    },
    image: "/images/projects/restaurant.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "repo",
    repoUrl: "https://github.com/abnos5525/restaurant",
    featured: false,
  },
  {
    id: "headphone-shop",
    title: { fa: "فروشگاه هدفون", en: "Headphone Shop" },
    summary: {
      fa: "قالب فروشگاهی برای محصولات صوتی و هدفون.",
      en: "E-commerce style template for audio products.",
    },
    image: "/images/projects/headphone.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "repo",
    repoUrl: "https://github.com/abnos5525/headphone-shop",
    featured: false,
  },
  {
    id: "segal-rayane",
    title: { fa: "سگال رایانه", en: "Segal Rayane" },
    summary: {
      fa: "وب‌سایت شرکتی برای معرفی خدمات و برند.",
      en: "Company website for brand and service presentation.",
    },
    image: "/images/projects/segal.PNG",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "repo",
    repoUrl: "https://github.com/abnos5525/segalrayane",
    featured: true,
  },
]

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured)
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id)
}
