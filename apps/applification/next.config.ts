import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/design.md": ["./design.md"],
  },
};

export default withWorkflow(nextConfig);
