// Browser-safe skill descriptions and links. Digests stay in agent-skills.ts.
export const siteSkillName = "applification-site";
export const siteSkillPath = `/.well-known/agent-skills/${siteSkillName}/SKILL.md`;
export const siteSkillDescription =
  "Read public information about Dave Hudson and Applification Ltd, who provide senior contract AI product engineering (React, Next.js, TypeScript) for small product teams on remote UK contracts, plus the open-source products Contexture and Voiced. Use when a user asks whether Dave Hudson is available, what he has delivered, how contracts are priced, or how to prepare an enquiry. Reads the free public JSON API; never sends enquiries.";

// Skills self-published on skills.sh (https://skills.sh), the public directory
// the skills CLI installs from. skills.sh indexes SKILL.md files in public
// GitHub repositories, so each entry names the repository and path that the
// CLI reads. The site skill's repository copy at skills/<name>/SKILL.md is
// generated from siteSkillMarkdown by `bun run skills:sync`; a unit test fails
// when the two drift.
export const githubOwner = "applification";
export const siteRepository = `${githubOwner}/applification.net`;
export const skillsShUrl = "https://skills.sh";

export type PublishedSkill = {
  name: string;
  description: string;
  repository: string;
  path: string;
  repositoryUrl: string;
  rawUrl: string;
  skillsShUrl: string;
  installCommand: string;
  productSlug?: string;
};

function publishedSkill({
  name,
  description,
  repository,
  productSlug,
}: Pick<PublishedSkill, "name" | "description" | "repository" | "productSlug">): PublishedSkill {
  const path = `skills/${name}/SKILL.md`;
  return {
    name,
    description,
    repository,
    path,
    repositoryUrl: `https://github.com/${repository}`,
    rawUrl: `https://raw.githubusercontent.com/${repository}/main/${path}`,
    skillsShUrl: `${skillsShUrl}/${repository}/${name}`,
    installCommand: `npx skills add ${repository} --skill ${name}`,
    ...(productSlug ? { productSlug } : {}),
  };
}

export const publishedSkills: PublishedSkill[] = [
  publishedSkill({
    name: siteSkillName,
    description: siteSkillDescription,
    repository: siteRepository,
  }),
  publishedSkill({
    name: "storyloop",
    description:
      "Use StoryLoop MCP to inspect story maps, select or resume work, keep durable lifecycle state current, and draft owner-reviewed map improvements. Apply when a request names StoryLoop, supplies a StoryLoop story or session ID, or uses StoryLoop MCP tools.",
    repository: `${githubOwner}/storyloop-skill`,
    productSlug: "storyloops",
  }),
];

export const siteRepositorySkillsShUrl = `${skillsShUrl}/${siteRepository}`;
