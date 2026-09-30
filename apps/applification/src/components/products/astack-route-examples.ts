// A small, paraphrased selection from applification/astack/evals/routing.md.
// These illustrate expected routing decisions, not evaluations run in this page.
export const astackRouteExamples = [
  {
    id: "feature",
    route: "Feature",
    request: "Correct a typo in an account button",
    decision:
      "A small web feature. Inspect the affected page, choose useful UI checks and verify the label in the running app.",
  },
  {
    id: "bug",
    route: "Bug fix",
    request: "An edit disappears after saving and reopening",
    decision:
      "Reproduce the lost edit before changing code. Rerun that exact path after the fix and confirm the saved data with a fresh read.",
  },
  {
    id: "refactor",
    route: "Refactor",
    request: "Put the document parser behind a smaller interface",
    decision:
      "Pin the existing outputs, move the parser and compare the results. The interface changes; the outputs must stay the same.",
  },
  {
    id: "performance",
    route: "Performance",
    request: "Cut report generation from four seconds to two",
    decision:
      "Measure the same user path before and after the change. Report the result and any limits on the comparison.",
  },
  {
    id: "investigation",
    route: "Investigation",
    request: "Why does the tenant check live in the backend?",
    decision:
      "Inspect the code and decision history, then answer from evidence. This read-only investigation ends with an answer.",
  },
  {
    id: "pr",
    route: "Pull request",
    request: "Review a PR and fix its confirmed regression",
    decision:
      "Review against the intended outcome and proof, fix the confirmed regression and update the existing PR.",
  },
  {
    id: "control",
    route: "App control",
    request: "Set up astack to verify our existing web app",
    decision:
      "Create or adopt a project-owned control CLI and feature map. Prove one real user path while keeping the project's working stack.",
  },
  {
    id: "setup",
    route: "Project setup",
    request: "Adopt astack in an existing pnpm app",
    decision:
      "Inspect the scripts and CI, keep pnpm and the current layout, and record working proof commands. Add app control where repeatable driving helps.",
  },
] as const;
