// Run after upgrading @rive-app/canvas-lite, then commit the versioned assets.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { version } from "@rive-app/canvas-lite/package.json";

const packageRoot = path.dirname(
  fileURLToPath(import.meta.resolve("@rive-app/canvas-lite")),
);
const target = path.resolve(import.meta.dirname, `../public/vendor/rive/${version}`);
await mkdir(target, { recursive: true });
await copyFile(
  path.join(packageRoot, "rive.wasm"),
  path.join(target, "rive.wasm"),
);
console.log(`Synced Rive ${version} runtime assets`);
