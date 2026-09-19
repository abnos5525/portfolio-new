import type { Experience } from "./types"

export const experience: Experience[] = [
  {
    id: "iziran",
    company: { fa: "ایزیران", en: "Isiran" },
    role: {
      fa: "برنامه‌نویس فول‌استک وب",
      en: "Full-Stack Web Developer",
    },
    start: { fa: "فروردین ۱۴۰۳", en: "Mar 2024" },
    end: { fa: "اکنون", en: "Present" },
    current: true,
    projects: [
      {
        name: { fa: "مدیریت کاربران", en: "User Management" },
        stack: ["React", "Spring Boot", "Keycloak"],
      },
      {
        name: { fa: "مدیریت اخبار", en: "News Management" },
        stack: ["React", "NestJS"],
      },
      {
        name: { fa: "VMS", en: "VMS" },
        stack: ["React", "Fuse Skeleton", "NestJS", "Kafka"],
      },
    ],
  },
  {
    id: "ariko",
    company: { fa: "اریکو", en: "Erico" },
    role: {
      fa: "برنامه‌نویس فول‌استک وب",
      en: "Full-Stack Web Developer",
    },
    start: { fa: "اردیبهشت ۱۴۰۵", en: "Apr 2026" },
    end: { fa: "شهریور ۱۴۰۵", en: "Sep 2026" },
    projects: [
      {
        name: {
          fa: "سرویس‌های زیرساختی",
          en: "Infrastructure Services",
        },
        stack: ["Spring Boot", "Angular", "Kong", "SpiceDB"],
      },
    ],
  },
  {
    id: "arnitex",
    company: { fa: "آرنیتکس", en: "Arnitex" },
    role: {
      fa: "برنامه‌نویس فول‌استک وب",
      en: "Full-Stack Web Developer",
    },
    start: { fa: "آبان ۱۴۰۴", en: "Nov 2025" },
    end: { fa: "بهمن ۱۴۰۴", en: "Feb 2026" },
    projects: [
      {
        name: {
          fa: "صرافی دیجیتال",
          en: "Digital Exchange",
        },
        stack: ["Java", "Spring Boot", "React.js", "Next.js"],
      },
    ],
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
    projects: [
      {
        name: {
          fa: "آموزش فرانت‌اند",
          en: "Frontend Instruction",
        },
        stack: ["JavaScript", "Frontend"],
      },
      {
        name: {
          fa: "آموزش Java",
          en: "Java Instruction",
        },
        stack: ["Java"],
      },
    ],
  },
]
