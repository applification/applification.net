import { register } from "node:module";

// @workflow/vitest loads the pre-built step bundle with Node's native ESM
// loader. Workflow's build discovery follows next.config.ts and this config
// into @workflow/builders, whose serde checker imports the `builtin-modules`
// JSON file without `with { type: "json" }`. Node rejects that import, so no
// step could run in tests. This resolve hook supplies the missing attribute
// for JSON modules only; imports that already declare one are left alone.
const hook = `
export async function resolve(specifier, context, nextResolve) {
  const result = await nextResolve(specifier, context);
  if (result.url.endsWith(".json") && !context.importAttributes?.type) {
    return { ...result, importAttributes: { ...context.importAttributes, type: "json" } };
  }
  return result;
}
`;

register(`data:text/javascript,${encodeURIComponent(hook)}`);
