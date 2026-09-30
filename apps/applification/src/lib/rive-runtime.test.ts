import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { version } from "@rive-app/canvas-lite/package.json";

const packageRoot = path.dirname(
  fileURLToPath(import.meta.resolve("@rive-app/canvas-lite")),
);

describe("self-hosted Rive runtime", () => {
  it("ships WebAssembly matching the installed dependency", () => {
    const name = "rive.wasm";
    const served = readFileSync(
      path.resolve(
        import.meta.dirname,
        `../../public/vendor/rive/${version}/${name}`,
      ),
    );
    const installed = readFileSync(path.join(packageRoot, name));
    expect(served.equals(installed)).toBe(true);
  });
});
