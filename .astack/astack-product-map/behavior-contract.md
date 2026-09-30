# astack product map

A technical reader should see how astack routes a task without leaving the Applification product page. The original hero overview remains. A separate map below it adapts the supplied astack website diagram into a smaller, static overview.

- A1. The map branches from one task into the seven engineering routes and a separately identified project setup path.
- A2. Each route shows two representative steps. Investigation ends with an answer; kept repository changes proceed through proof, review and a pull request.
- A3. The desktop map fits the page. Smaller screens scroll within a labelled, keyboard-focusable map region without overflowing the document.
- A4. The repository action uses the shared site blue in light and dark themes. Contexture keeps its own product colour.

Pencil is not selected. The supplied website screenshot defines the branching composition; the remaining question is legibility and fit in the existing page, checked in Storybook and the running app. Storybook is selected for theme, viewport, accessibility and keyboard states. The diagram has no animation, so reduced motion retains the same map.

Stories: `products-astack-full-page--desktop-light`, `--desktop-dark`, `--mobile-light`, `--mobile-dark`, `--tablet-light`, `--laptop-light`.

- A5. Selecting one of eight representative eval requests highlights only its route and announces the expected decision. On small screens the selected route scrolls into the map viewport. Show all routes clears the selection.

The examples paraphrase the upstream routing evals and link to their source. They demonstrate expected routing, not evaluation results generated here.

## Proof and review

Working tree based on `c0489d59427c548125a8bbdd3f1f391e03f1a9e4`, checked on 30 September 2026 in the local Next.js development app at `http://localhost:4755` and Chromium Storybook.

- A1–A3: pass. Eight paths render, including the seven work routes and project setup. Investigation stops at its answer. Desktop and mobile stories report no document overflow and verify keyboard focus on the map.
- A4: pass. The default availability action now uses the shared palette. Contexture's dedicated variant keeps its colours. The affected product page stories pass accessibility checks in both themes.
- A5: pass. Stories select Bug fix and Investigation, confirm a single highlighted route and its expected decision, and reset to all routes. Running-app selection of the lost-edit request showed the Bug fix line highlighted with its explanation.
- Directory: pass. Loami is first, StoryLoops has a thumbnail, and both archive cards are below 360px in the desktop/mobile stories. Running-app inspection confirmed the shorter image and one-sentence summaries.
- First failures retained in the chat: the diagram originally skipped a heading level, corrected with its own heading; repeated dropdown clicks initially raced its closing animation, corrected by waiting for the menu to release pointer events.
- Lint, typecheck and focused browser checks pass. The map changes state without animation, including under reduced motion. No server or persistence behaviour changes here.

The screenshots shown in the chat record the local visual review. The owner has now requested one PR containing all uncommitted changes, including work from other chats. Review found the shared secondary-action colours were the only cross-product style change in the map work; the Contexture variant preserves its existing colour roles. Later product navigation changes place archives last and keep card heights aligned.
