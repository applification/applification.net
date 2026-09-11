import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { GET as getIndex } from "@/app/.well-known/agent-skills/index.json/route";
import { GET as getSkill } from "@/app/.well-known/agent-skills/applification-site/SKILL.md/route";
import {
  agentSkillsSchemaUrl,
  publishedSkills,
  siteRepository,
  siteSkillMarkdown,
  siteSkillName,
} from "./agent-skills";

describe("agent skills discovery", () => {
  it("publishes a v0.2.0 index whose digest matches the served SKILL.md bytes", async () => {
    const index = await getIndex().json();
    const skillResponse = getSkill();
    const bytes = Buffer.from(await skillResponse.arrayBuffer());

    expect(index.$schema).toBe(agentSkillsSchemaUrl);
    expect(index.skills).toHaveLength(1);
    const [skill] = index.skills;
    expect(skill).toMatchObject({
      name: siteSkillName,
      type: "skill-md",
      url: `https://www.applification.net/.well-known/agent-skills/${siteSkillName}/SKILL.md`,
    });
    expect(skill.description.length).toBeGreaterThan(0);
    expect(skill.description.length).toBeLessThanOrEqual(1024);
    expect(skill.digest).toBe(
      `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
    );
    expect(skillResponse.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
  });

  it("serves SKILL.md frontmatter with a spec-compliant name and when-to-use guidance", async () => {
    const text = await getSkill().text();
    const frontmatter = text.match(/^---\n([\s\S]+?)\n---\n/)?.[1] ?? "";
    expect(frontmatter).toMatch(new RegExp(`^name: ${siteSkillName}$`, "m"));
    expect(siteSkillName).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(siteSkillName.length).toBeLessThanOrEqual(64);
    expect(frontmatter).toMatch(/^description: .+/m);
    // No YAML parser is bundled, so guard the plain scalars by hand: a
    // top-level value containing ": " or starting with a quote or special
    // character would change meaning or fail to parse.
    for (const line of frontmatter.split("\n")) {
      const scalar = line.match(/^[a-z-]+: (.*)$/)?.[1];
      if (scalar === undefined) continue;
      expect(scalar).not.toMatch(/: /);
      expect(scalar).not.toMatch(/^["'{[&*!|>%@`#]/);
      expect(scalar).not.toMatch(/ #/);
    }
    expect(text).toContain("## When to use this skill");
    expect(text).toContain("## When not to use this skill");
    expect(text).toContain("/api/v1/catalog");
    expect(text).not.toMatch(/mailto:|[\w.+-]+@applification\.net/i);
  });

  it("keeps the repository copy that skills.sh indexes identical to the served SKILL.md", async () => {
    // Regenerate with `bun run skills:sync` when the served skill changes.
    const repositoryCopy = await readFile(
      new URL(`../../../../skills/${siteSkillName}/SKILL.md`, import.meta.url),
      "utf8",
    );
    expect(repositoryCopy).toBe(siteSkillMarkdown);
  });

  it("describes each skills.sh listing with a GitHub source and an install command", () => {
    const siteSkill = publishedSkills.find(
      (skill) => skill.name === siteSkillName,
    );
    expect(siteSkill?.repository).toBe(siteRepository);
    expect(siteSkill?.path).toBe(`skills/${siteSkillName}/SKILL.md`);
    for (const skill of publishedSkills) {
      expect(skill.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(skill.repository).toMatch(/^applification\/[A-Za-z0-9._-]+$/);
      expect(skill.skillsShUrl).toBe(
        `https://skills.sh/${skill.repository}/${skill.name}`,
      );
      expect(skill.rawUrl).toBe(
        `https://raw.githubusercontent.com/${skill.repository}/main/${skill.path}`,
      );
      expect(skill.installCommand).toBe(
        `npx skills add ${skill.repository} --skill ${skill.name}`,
      );
      expect(skill.description.length).toBeLessThanOrEqual(1024);
    }
  });
});
