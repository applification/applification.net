import { getPublishedContent } from "./public-content.server";
import type { PublicContent } from "./content-schema";
import { publicProfile, siteUrl, sandboxUrl } from "./public-catalog";
import { hasAgentView, humanPath, markdownPath } from "./page-view";
import { agentsCopy, sitePageCopy } from "./content/site-pages";
import { careerTimeline, positions, profileFacts, bestFit, selectedWriting } from "./content/about";
import { publicApiUsageDescription } from "./public-api-policy";
import { publishedSkills } from "./agent-skills-public";
import { privacyCopy, privacyUpdated } from "./content/privacy";

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
    `Markdown: ${siteUrl}${markdownPath(new URL(item.url).pathname)}`,
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

export function getPageMarkdown(path: string): MarkdownPage | null {
  if (path !== humanPath(path) || !hasAgentView(path)) return null;

  let title: string;
  let body: string;
  const content = getPublishedContent();
  const cases = content.filter(item => item.type === "client-work");
  const products = content.filter(item => item.type === "products");

  if (path === "/") {
    title = sitePageCopy.home.title.join(" ");
    body = [
      sitePageCopy.home.description,
      profileFacts.map(([label, value]) => `- ${label}: ${value}`).join("\n"),
      `## How I work with AI\n\n${sitePageCopy.home.method}`,
      `## Client outcomes\n\n${contentIndex(cases.filter(item => new URL(item.url).pathname !== "/client-work"))}`,
      `## Products\n\n${contentIndex(products)}`,
    ].join("\n\n");
  } else if (path === "/about") {
    title = sitePageCopy.about.title;
    body = [
      sitePageCopy.about.description,
      profileFacts.map(([label, value]) => `- ${label}: ${value}`).join("\n"),
      ...positions.map(position => `## ${position.title}\n\n${position.description}`),
      `## Career\n\n${careerTimeline.map(entry => `### ${entry.year}: ${entry.title}\n\n${entry.description}${"earlyClients" in entry ? `\n\nEarly clients included ${entry.earlyClients}` : ""}`).join("\n\n")}`,
      `## Best fit\n\n${bestFit.map(item => `- ${item}`).join("\n")}`,
      `## Selected writing\n\n${selectedWriting.map(item => `- ${link(item.title, `${siteUrl}${item.href}`)}: ${item.description}`).join("\n")}`,
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
      agentsCopy.guidance,
      `## A starting point for your conversation\n\n${agentsCopy.prompt}`,
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
      `Source: ${siteUrl}${path}\nMarkdown: ${siteUrl}${markdownPath(path)}`,
      body,
      `## Explore Applification\n\n${[
        ["Home", "/"], ["About Dave", "/about"], ["Client work", "/client-work"],
        ["Products", "/products"], ["Writing", "/writing"], ["Agents & API docs", "/agents"],
      ].map(([label, destination]) => `- ${link(label, `${siteUrl}${markdownPath(destination)}`)}`).join("\n")}\n- ${link("Contact routes", publicProfile.contactUrl)}\n- ${link("LinkedIn", publicProfile.linkedInUrl)}`,
    ].join("\n\n") + "\n",
  };
}
