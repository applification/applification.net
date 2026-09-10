import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["applification.localhost", "rufus.tail12a0a0.ts.net"],
  outputFileTracingIncludes: {
    "/design.md": ["./design.md"],
    "/[...notFound]": ["./.next/server/app/_not-found.html"],
  },
};

export default withWorkflow(withBotId(nextConfig));
