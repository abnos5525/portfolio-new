import type { Skill } from "./types"

export const skills: Skill[] = [
  // Frontend — core
  {
    id: "typescript",
    name: "TypeScript",
    icon: "/images/icons/typescript.png",
    category: "frontend",
    level: "core",
    projectIds: ["iziran", "ariko"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "/images/icons/javascript.png",
    category: "frontend",
    level: "core",
    projectIds: [
      "coffee-app",
      "portfolio-app",
      "top-movies",
      "segal-rayane",
      "iziran",
    ],
  },
  {
    id: "react",
    name: "React",
    icon: "/images/icons/reactjs.png",
    category: "frontend",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    level: "core",
    projectIds: [],
  },
  {
    id: "redux",
    name: "Redux Toolkit",
    icon: "/images/icons/redux.png",
    category: "frontend",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "tanstack-query",
    name: "TanStack Query",
    category: "frontend",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: "/images/icons/tailwind.png",
    category: "frontend",
    level: "core",
    projectIds: [],
  },
  {
    id: "html",
    name: "HTML5",
    icon: "/images/icons/html.png",
    category: "frontend",
    level: "core",
    projectIds: ["coffee-app", "portfolio-app", "top-movies"],
  },
  {
    id: "css",
    name: "CSS3",
    icon: "/images/icons/css.png",
    category: "frontend",
    level: "core",
    projectIds: ["coffee-app", "portfolio-app", "top-movies"],
  },
  {
    id: "angular",
    name: "Angular",
    category: "frontend",
    level: "proficient",
    projectIds: ["ariko"],
  },
  {
    id: "mui",
    name: "Material UI",
    category: "frontend",
    level: "proficient",
    projectIds: [],
  },
  {
    id: "antd",
    name: "Ant Design",
    category: "frontend",
    level: "proficient",
    projectIds: [],
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: "/images/icons/bootstrap.png",
    category: "frontend",
    level: "proficient",
    projectIds: [],
  },

  // Backend — core
  {
    id: "nestjs",
    name: "NestJS",
    category: "backend",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: "/images/icons/nodejs.png",
    category: "backend",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "spring-boot",
    name: "Spring Boot",
    category: "backend",
    level: "core",
    projectIds: ["iziran", "ariko"],
  },
  {
    id: "java",
    name: "Java",
    category: "backend",
    level: "core",
    projectIds: ["iziran", "ariko", "segal"],
  },
  {
    id: "rest",
    name: "RESTful API",
    category: "backend",
    level: "core",
    projectIds: ["iziran", "ariko"],
  },
  {
    id: "keycloak",
    name: "Keycloak / JWT",
    category: "backend",
    level: "core",
    projectIds: ["iziran"],
  },

  // Data
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "data",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "data",
    level: "proficient",
    projectIds: [],
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    category: "data",
    level: "proficient",
    projectIds: [],
  },

  // DevOps / infra
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    level: "core",
    projectIds: ["iziran"],
  },
  {
    id: "kafka",
    name: "Kafka",
    category: "devops",
    level: "proficient",
    projectIds: ["iziran"],
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    category: "devops",
    level: "proficient",
    projectIds: [],
  },
  {
    id: "linux",
    name: "Linux",
    category: "devops",
    level: "proficient",
    projectIds: [],
  },
  {
    id: "git",
    name: "Git",
    icon: "/images/icons/git.png",
    category: "other",
    level: "core",
    projectIds: ["iziran", "ariko", "segal-rayane"],
  },
  {
    id: "python",
    name: "Python",
    icon: "/images/icons/python.png",
    category: "other",
    level: "familiar",
    projectIds: [],
  },
  {
    id: "rust",
    name: "Rust",
    category: "other",
    level: "familiar",
    projectIds: [],
  },
]

export const skillLevelLabel = {
  core: { fa: "اصلی", en: "Core" },
  proficient: { fa: "مسلط", en: "Proficient" },
  familiar: { fa: "آشنا", en: "Familiar" },
} as const

export function getCoreSkills(limit = 10) {
  return skills.filter((skill) => skill.level === "core").slice(0, limit)
}
