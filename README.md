# applification.net

Bun workspace for the Applification website and future services.

## Structure

```text
apps/
  applification/   Next.js website
packages/          Shared packages when the project needs them
```

## Commands

```bash
bun install
bun run dev
bun run build
bun run lint
bun run typecheck
```

## Railway

Connect Railway to the repository root. The root `build` and `start` scripts run the website workspace. Railway supplies `PORT` to `next start`.

The site shell is intentionally small. Product sections and page content will be planned and delivered through StoryLoops.
