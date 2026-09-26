import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const pages = process.env.GITHUB_PAGES === "true"

const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export",
        basePath: "/portfolio-new",
        trailingSlash: true,
      }
    : {}),
}

export default withNextIntl(nextConfig)
