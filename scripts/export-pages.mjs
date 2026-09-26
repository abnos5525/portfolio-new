import { access, mkdir, rename, rm } from "node:fs/promises"
import { spawn } from "node:child_process"

const parked = [
  ["src/proxy.ts", ".pages-hold/proxy.ts"],
  ["src/app/api", ".pages-hold/api"],
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function park() {
  for (const [from, to] of parked) {
    if (await exists(from)) await rename(from, to)
  }
}

async function restore() {
  for (const [from, to] of parked) {
    if (await exists(to)) await rename(to, from)
  }
}

await rm(".next", { recursive: true, force: true })
await mkdir(".pages-hold", { recursive: true })

await park().catch(async (error) => {
  await restore()
  throw error
})

try {
  const code = await new Promise((resolve) => {
    const child = spawn("pnpm", ["build"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        GITHUB_PAGES: "true",
        NEXT_PUBLIC_BASE_PATH: "/portfolio-new",
      },
    })
    child.on("exit", (status) => resolve(status ?? 1))
  })
  if (code !== 0) {
    process.exitCode = code
  }
} finally {
  await restore()
  await rm(".pages-hold", { recursive: true, force: true })
}
