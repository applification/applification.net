// Writes the repository copy of the site skill that skills.sh indexes from
// GitHub, so it stays byte-identical to the SKILL.md served under
// /.well-known/agent-skills. Run with `bun run skills:sync` from the repo root.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteSkillMarkdown, siteSkillName } from "../src/lib/agent-skills";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const target = path.join(repoRoot, "skills", siteSkillName, "SKILL.md");

await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, siteSkillMarkdown, "utf8");
console.log(`Wrote ${path.relative(repoRoot, target)}`);
