# Rive runtime

The versioned WebAssembly file is copied without modification from the pinned `@rive-app/canvas-lite` dependency, published under the MIT licence by Rive. The demo serves it locally and disables the runtime's default CDN fallback. If it cannot load, the static Loami artwork remains visible.

After upgrading the dependency, run `bun run rive:sync` in `apps/applification`, commit the new version directory and remove the old directory. The demo derives its asset URL from the installed package version. A unit test checks that the served binary matches that package.
