import path from "node:path";
import { fileURLToPath } from "node:url";
import { workflow } from "@workflow/vitest";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [workflow()],
  resolve: {
    alias: { "@": path.join(dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.workflow.test.ts"],
    setupFiles: [path.join(dirname, "vitest.workflow.setup.mjs")],
    testTimeout: 60_000,
  },
});
