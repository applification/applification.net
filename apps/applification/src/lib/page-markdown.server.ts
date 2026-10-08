import { getPublishedContent } from "./public-content.server";
import type { PublicContent } from "./content-schema";
import { publicProfile, siteUrl, sandboxUrl } from "./public-catalog";
import { hasAgentView, humanPath, markdownPath } from "./page-view";
import { agentsCopy, assistantPromptLinks, sitePageCopy } from "./content/site-pages";
import { careerTimeline, positions, profileFacts, bestFit, selectedWriting } from "./content/about";
import { publicApiUsageDescription } from "./public-api-policy";
import { publishedSkills } from "./agent-skills-public";
import { privacyCopy, privacyUpdated } from "./content/privacy";
import { businessCopy, capabilities, engagements, integrationEvidence, integrationExamples } from "./content/business";
import { businessUrl, contentOrigin, profileUrl, siteOrigin, type SiteIdentity } from "./site-identity";

export type MarkdownPage = { title: string; path: string; markdown: string };

function link(label: string, url: string) {
  return `[${label}](${url})`;
}

function contentIndex(items: PublicContent[]) {
  return items.map(item => [
    `### ${link(item.title, item.url)}`,
    item.date ? `Published: ${item.date}` : "",
    item.status ? `Status: ${item.status}` : "",
    item.summary,
    `Markdown: ${new URL(item.url).origin}${markdownPath(new URL(item.url).pathname)}`,
  ].filter(Boolean).join("\n\n")).join("\n\n");
}

function contentBody(item: PublicContent) {
  // The API bounds sections at 4,000 characters. Rejoin continuation chunks
  // exactly, including chunks inside code blocks and long paragraphs.
  const sections: { title: string; content: string }[] = [];
  for (const section of item.sections) {
    const previous = sections.at(-1);
    if (previous && section.title.replace(/ \(continued \d+\)$/, "") === previous.title) {
      previous.content += section.content;
    } else {
      sections.push({ ...section });
    }
  }
  return [
    item.date ? `Published: ${item.date}` : "",
    item.updated ? `Updated: ${item.updated}` : "",
    ...sections
      // Commercial terms remain in the public API, as on the visual pages.
      .filter(section => section.title !== "Commercial terms")
      .map(section => section.title === item.title ? section.content : `## ${section.title}\n\n${section.content}`),
    item.links.length ? `## References\n\n${item.links.map(ref => `- ${link(ref.label, ref.url)}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");
}

export function getPageMarkdown(path: string, site: SiteIdentity = "business"): MarkdownPage | null {
  if (path !== humanPath(path) || !hasAgentView(path)) return null;

  let title: string;
  let body: string;
  const content = getPublishedContent();
  const cases = content.filter(item => item.type === "client-work");
  const products = content.filter(item => item.type === "products");
  const origin = path === "/" ? siteOrigin(site) : contentOrigin(path);
  const profile = origin === profileUrl;

  if (path === "/" && site === "business") {
    title = businessCopy.title;
    body = [businessCopy.description, businessCopy.commissioning,
      ...capabilities.map(item => `## ${item.title}\n\n${item.description}`),
      `## Illustrative workflows\n\n${integrationExamples.map(item => `### ${item.label}\n\n${item.question}\n\n${item.system} → ${item.tool}\n\nAccess: ${item.access}\n\n${item.interface}\n\n${item.approval}`).join("\n\n")}`,
      `## Scoped delivery\n\n${engagements.map(item => `### ${item.title}\n\n${item.description}\n\n${item.output}`).join("\n\n")}`,
      `## Production evidence\n\nLogically: Dave co-built the production Agentic Chat during full-time employment, October 2024–May 2026. MCP tools connected threat analysts to Databricks threat-analysis and person-lookup capabilities.\n\n${link("Logically case study on Dave's site", `${profileUrl}/client-work/logically`)}`,
      ...integrationEvidence.map(item => `### ${item.name} — ${item.status}\n\n${item.description}\n\n${link(item.action, `${siteUrl}${item.href}`)}`),
      `## For agencies\n\n${businessCopy.agencyDescription}\n\n${businessCopy.proposal}`,
      `## Founded by Dave Hudson\n\n${link("Engineering profile and CV", publicProfile.url)}\n\n${link("Discuss a project", publicProfile.projectContactUrl)}`,
    ].join("\n\n");
  } else if (path === "/") {
    title = sitePageCopy.home.title.join(" ");
    body = [
      sitePageCopy.home.description,
      profileFacts.map(([label, value]) => `- ${label}: ${value}`).join("\n"),
      "North East hybrid considered. Straightforward frontend delivery, product builds and architectural resets are welcome.",
      link("Download CV (PDF)", publicProfile.cvUrl),
      `## How I work with AI\n\n${sitePageCopy.home.method}`,
      `## Client outcomes\n\n${contentIndex(cases.filter(item => new URL(item.url).pathname !== "/client-work"))}`,
      `## Founder of Applification\n\n${link("MCP integrations and MCP Apps", siteUrl)}`,
    ].join("\n\n");
  } else if (path === "/about") {
    title = sitePageCopy.about.title;
    body = [
      sitePageCopy.about.description,
      profileFacts.map(([label, value]) => `- ${label}: ${value}`).join("\n"),
      ...positions.map(position => `## ${position.title}\n\n${position.description}`),
      `## Career\n\n${careerTimeline.map(entry => `### ${entry.year}: ${entry.title}\n\n${entry.description}${"earlyClients" in entry ? `\n\nEarly clients included ${entry.earlyClients}` : ""}`).join("\n\n")}`,
      `## Best fit\n\n${bestFit.map(item => `- ${item}`).join("\n")}`,
      `## Selected writing\n\n${selectedWriting.map(item => `- ${link(item.title, `${profileUrl}${item.href}`)}: ${item.description}`).join("\n")}`,
    ].join("\n\n");
  } else if (path === "/client-work") {
    title = sitePageCopy.clientWork.title;
    body = `${sitePageCopy.clientWork.description}\n\n${contentIndex(cases)}`;
  } else if (path === "/products") {
    title = sitePageCopy.products.title;
    body = `${sitePageCopy.products.description}\n\n${contentIndex(products)}`;
  } else if (path === "/writing") {
    title = sitePageCopy.writing.title;
    body = `${sitePageCopy.writing.description}\n\n${contentIndex(content.filter(item => item.type === "writing"))}`;
  } else if (path === "/privacy") {
    title = privacyCopy.title;
    body = [
      `Updated: ${privacyUpdated}`,
      privacyCopy.description,
      ...privacyCopy.sections.map(section => `## ${section.title}\n\n${section.blocks.map(block => block.kind === "paragraph" ? block.text : block.items.map(item => `- ${item}`).join("\n")).join("\n\n")}`),
    ].join("\n\n");
  } else if (path === "/agents") {
    title = agentsCopy.title;
    body = [
      agentsCopy.description,
      `## A starting point for your conversation\n\n${agentsCopy.handoff}\n\n${agentsCopy.prompt}`,
      assistantPromptLinks.map(({ label, href }) => `- ${link(label, href)}`).join("\n"),
      agentsCopy.guidance,
      `## API docs for agents\n\nPublic site information. Read-only access. No account or key.\n\nSandbox first call: ${sandboxUrl}`,
      `- ${link("Site guide for agents", `${siteUrl}/llms.txt`)}\n- ${link("OpenAPI reference", `${siteUrl}/api/openapi.json`)}\n- ${link("Search published content", `${siteUrl}/api/v1/search`)}\n- ${link("API and WebMCP reference", `${siteUrl}/agents#reference`)}`,
      `## API usage\n\n${publicApiUsageDescription}`,
      `## Browser agents\n\nWebMCP-enabled browsers can use search_site and read_content. On the contact page, fill_contact_draft fills an editable enquiry. You review it and decide whether to send. These browser tools are separate from reading the site in a chat app.`,
      `## Agent skills\n\n${publishedSkills.map(skill => `### ${skill.name}\n\n${skill.description}\n\n${link("Source", skill.repositoryUrl)}\n\n\`${skill.installCommand}\``).join("\n\n")}`,
    ].join("\n\n");
  } else {
    const item = content.find(item => new URL(item.url).pathname === path);
    if (!item) return null;
    title = item.title;
    body = contentBody(item);
  }

  return {
    title,
    path,
    markdown: [
      `# ${title}`,
      `Source: ${origin}${path}\nMarkdown: ${origin}${markdownPath(path)}`,
      body,
      profile
        ? `## Explore Dave's profile\n\n${[
          ["Home", "/"], ["Client work", "/client-work"], ["Writing", "/writing"], ["About Dave", "/about"],
        ].map(([label, destination]) => `- ${link(label, `${profileUrl}${markdownPath(destination)}`)}`).join("\n")}\n- ${link("Download CV (PDF)", publicProfile.cvUrl)}\n- ${link("Contact Dave", publicProfile.contactUrl)}\n- ${link("LinkedIn", publicProfile.linkedInUrl)}\n\nBusiness site: ${link("Applification.net", businessUrl)}`
        : `## Explore Applification\n\n${[
          ["Home", "/"], ["Products", "/products"], ["Agents & API docs", "/agents"],
        ].map(([label, destination]) => `- ${link(label, `${businessUrl}${markdownPath(destination)}`)}`).join("\n")}\n- ${link("Discuss a project", publicProfile.projectContactUrl)}\n\nFounder profile: ${link("Dave Hudson", profileUrl)}`,
    ].join("\n\n") + "\n",
  };
}
