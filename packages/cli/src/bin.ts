#!/usr/bin/env node
import { run } from "./main.js";

run(process.argv.slice(2), {
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
}).then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    process.stderr.write(`${(error as Error).stack ?? error}\n`);
    process.exitCode = 1;
  },
);
