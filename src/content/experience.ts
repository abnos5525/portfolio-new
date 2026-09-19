import type { Experience } from "./types"

export const experience: Experience[] = [
  {
    id: "iziran",
    company: { fa: "ایزیران", en: "Iziran" },
    role: {
      fa: "برنامه‌نویس فول‌استک وب",
      en: "Full-Stack Web Developer",
    },
    start: { fa: "فروردین ۱۴۰۳", en: "Mar 2024" },
    end: { fa: "اکنون", en: "Present" },
    current: true,
    highlights: [
      {
        fa: "مدیریت کاربران با React، Spring Boot و Keycloak",
        en: "User management with React, Spring Boot, and Keycloak",
      },
      {
        fa: "مدیریت اخبار با React و NestJS",
        en: "News management with React and NestJS",
      },
      {
        fa: "سامانه VMS با React (Fuse)، NestJS و Kafka",
        en: "VMS platform with React (Fuse), NestJS, and Kafka",
      },
    ],
    stack: [
      "React",
      "NestJS",
      "Spring Boot",
      "Keycloak",
      "Kafka",
      "Fuse",
    ],
  },
  {
    id: "ariko",
    company: { fa: "اریکو", en: "Ariko" },
    role: {
      fa: "برنامه‌نویس ارشد Spring Boot و Angular",
      en: "Senior Spring Boot & Angular Developer",
    },
    start: { fa: "اردیبهشت ۱۴۰۵", en: "Apr 2026" },
    end: { fa: "شهریور ۱۴۰۵", en: "Sep 2026" },
    highlights: [
      {
        fa: "پروژه‌های زیرساختی با Spring Boot، Angular، Kong و SpiceDB",
        en: "Infrastructure work with Spring Boot, Angular, Kong, and SpiceDB",
      },
    ],
    stack: ["Spring Boot", "Angular", "Kong", "SpiceDB"],
  },
  {
    id: "segal",
    company: { fa: "سگال رایانه", en: "Segal Rayane" },
    role: {
      fa: "مدرس برنامه‌نویسی فرانت‌اند و Java",
      en: "Frontend & Java Programming Instructor",
    },
    start: { fa: "فروردین ۱۳۹۹", en: "Mar 2020" },
    end: { fa: "مهر ۱۴۰۲", en: "Oct 2023" },
    highlights: [
      {
        fa: "آموزش فرانت‌اند و Java به صورت پروژه‌محور",
        en: "Project-based teaching of frontend and Java",
      },
    ],
    stack: ["JavaScript", "Java", "Frontend"],
  },
]
