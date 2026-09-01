<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI and design changes

Before changing any user-visible interface in this app, read `design.md`.

Use `../../applification.pen` for visual intent, composition references, and design history. Some frames lag behind production, so do not treat the pen document as a mechanical source of truth or edit its JSON by hand.

Use `src/app/globals.css`, `src/app/fonts.ts`, established components, and Storybook for exact runtime values and supported states. If these sources disagree, preserve accessible production behaviour, report the mismatch, and keep the correction inside the requested scope.

For material UI changes, add or update the nearest Storybook story. Verify the applicable light, dark, desktop, mobile, keyboard, focus, accessibility, and reduced-motion states.
