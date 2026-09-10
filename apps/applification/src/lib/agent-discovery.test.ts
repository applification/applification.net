import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  agentSkillsIndex,
  applificationSkill,
  ardCatalog,
  skillDigest,
} from "./agent-discovery";
import { mcpEndpoint, mcpServerCard, mcpTools } from "./mcp-server";
import { siteUrl } from "./public-catalog";
import { GET as getArd } from "@/app/.well-known/ard.json/route";
import { GET as getSkillsIndex } from "@/app/.well-known/agent-skills/index.json/route";
import { GET as getSkill } from "@/app/.well-known/agent-skills/applification/SKILL.md/route";
import { GET as getServerCard } from "@/app/.well-known/mcp/server-card.json/route";
import { GET as getWellKnownMcp } from "@/app/.well-known/mcp/route";

describe("agent discovery documents", () => {
  it("publishes an MCP server card describing the Streamable HTTP endpoint", async () => {
    const response = getServerCard();
    const body = await response.json();
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(body.url).toBe(mcpEndpoint);
    expect(body.url).toBe(`${siteUrl}/api/mcp`);
    expect(body.transport).toBe("streamable-http");
    expect(body.authentication).toEqual({ type: "none" });
    expect(body.tools.map((tool: { name: string }) => tool.name)).toEqual(
      mcpTools.map((tool) => tool.name),
    );
    for (const tool of body.tools) {
      expect(tool.description.length).toBeGreaterThan(40);
      expect(tool.annotations.readOnlyHint).toBe(true);
    }
    expect(await getWellKnownMcp().json()).toEqual(body);
  });

  it("publishes an ARD catalog whose entries all point at same-origin resources", async () => {
    const response = getArd();
    const body = await response.json();
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body.entries.length).toBeGreaterThanOrEqual(4);
    for (const entry of body.entries) {
      expect(entry.identifier).toMatch(/^urn:air:applification\.net:/);
      expect(entry.displayName).toBeTruthy();
      expect(entry.type).toBeTruthy();
      expect(entry.url.startsWith(siteUrl)).toBe(true);
      expect(entry.description.length).toBeGreaterThan(20);
    }
    const mcp = body.entries.find(
      (entry: { type: string }) => entry.type === "application/mcp-server-card+json",
    );
    expect(mcp.url).toBe(`${siteUrl}/.well-known/mcp/server-card.json`);
    expect(mcp.capabilities).toEqual(mcpTools.map((tool) => tool.name));
    expect(mcp.representativeQueries.length).toBeGreaterThanOrEqual(2);
    expect(mcp.description).toBe(mcpServerCard.description);
    expect(ardCatalog).toEqual(body);
  });

  it("publishes an Agent Skills index whose digest matches the served SKILL.md", async () => {
    const index = await getSkillsIndex().json();
    expect(index.skills).toHaveLength(1);
    const [skill] = index.skills;
    expect(skill.name).toBe("applification");
    expect(skill.description.length).toBeGreaterThan(40);
    expect(skill.url).toBe("/.well-known/agent-skills/applification/SKILL.md");

    const response = getSkill();
    expect(response.headers.get("content-type")).toContain("text/markdown");
    const markdown = await response.text();
    expect(markdown).toBe(applificationSkill);
    expect(markdown.startsWith("---\nname: applification\n")).toBe(true);
    expect(markdown).toContain(mcpEndpoint);
    expect(markdown).toContain("## When to use");
    expect(skill.digest).toBe(skillDigest);
    expect(skill.digest).toBe(
      `sha256:${createHash("sha256").update(markdown).digest("hex")}`,
    );
    expect(agentSkillsIndex).toEqual(index);
  });

  it("never leaks private routes or contact details", () => {
    const text = JSON.stringify([ardCatalog, mcpServerCard, applificationSkill]);
    expect(text).not.toMatch(/mailto:|[\w.+-]+@applification\.net/i);
    expect(text).not.toMatch(/\/contact\/review|\/writing\/preview|\/api\/contact/);
  });
});
