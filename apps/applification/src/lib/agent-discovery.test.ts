import { describe, expect, it } from "vitest";
import { ardCatalog } from "./agent-discovery";
import { agentSkillsIndex, siteSkillPath } from "./agent-skills";
import { mcpEndpoint, mcpServerCard, mcpTools } from "./mcp-metadata";
import { siteUrl } from "./public-catalog";
import { GET as getArd } from "@/app/.well-known/ard.json/route";
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

  it("points the ARD skill entry at the published Agent Skills artifact", () => {
    const skill = ardCatalog.entries.find(
      (entry) => entry.type === "application/ai-skill+md",
    )!;
    const [indexed] = agentSkillsIndex.skills;
    expect(skill.url).toBe(`${siteUrl}${siteSkillPath}`);
    expect(skill.url).toBe(indexed.url);
    expect(skill.description).toBe(indexed.description);
    expect(skill.metadata).toEqual({ digest: indexed.digest });
  });

  it("never leaks private routes or contact details", () => {
    const text = JSON.stringify([ardCatalog, mcpServerCard]);
    expect(text).not.toMatch(/mailto:|[\w.+-]+@applification\.net/i);
    expect(text).not.toMatch(/\/contact\/review|\/writing\/preview|\/api\/contact/);
  });
});
