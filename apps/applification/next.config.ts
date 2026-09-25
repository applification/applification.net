import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["applification.localhost", "rufus.tail12a0a0.ts.net"],
  poweredByHeader: false,
  // The production build type-checks application code only. Test and
  // Storybook tooling is checked by `bun run typecheck` (tsconfig.json) in CI;
  // including it here let a stale install cache with duplicate vitest copies
  // fail Vercel builds on unrelated config types.
  typescript: { tsconfigPath: "tsconfig.build.json" },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          development: process.env.NODE_ENV === "development",
          preview: process.env.VERCEL_ENV === "preview",
        }),
      },
    ];
  },
  outputFileTracingIncludes: {
    "/design.md": ["./design.md"],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Runs only after every page, route handler, static file and dynamic
      // route has failed to match. Browsers (Accept: text/html) fall through
      // to app/not-found.tsx; everything else gets a Markdown 404.
      fallback: [
        {
          source: "/:path*",
          missing: [{ type: "header", key: "accept", value: ".*text/html.*" }],
          destination: "/api/not-found/:path*",
        },
      ],
    };
  },
};

export default withWorkflow(withBotId(nextConfig));
