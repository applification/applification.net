import { describe, expect, it } from "vitest";
import { GET } from "@/app/.well-known/ard.json/route";
import { ardContext, ardEntries, ardIdentifierPattern } from "./ard";
import { agentSkillsIndex } from "./agent-skills";

describe("agentic resource discovery manifest", () => {
  it("serves a JSON manifest with an entries array", async () => {
    const response = GET();
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    const manifest = await response.json();
    expect(manifest["@context"]).toBe(ardContext);
    expect(Array.isArray(manifest.entries)).toBe(true);
    expect(manifest.entries).toHaveLength(ardEntries.length);
  });

  it("gives every entry the required fields and a domain-anchored identifier", () => {
    const identifiers = new Set<string>();
    for (const entry of ardEntries) {
      expect(entry.identifier).toMatch(ardIdentifierPattern);
      expect(entry.identifier.startsWith("urn:air:applification.net:")).toBe(
        true,
      );
      expect(identifiers.has(entry.identifier)).toBe(false);
      identifiers.add(entry.identifier);
      expect(entry.displayName.length).toBeGreaterThan(0);
      expect(entry.type).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/);
      expect(entry.url).toMatch(/^https:\/\/www\.applification\.net\//);
      expect("data" in entry).toBe(false);
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("points the skill entry at the artifact listed in the Agent Skills index", () => {
    const skill = ardEntries.find((entry) =>
      entry.identifier.startsWith("urn:air:applification.net:skill:"),
    );
    expect(skill?.url).toBe(agentSkillsIndex.skills[0].url);
    expect(skill?.description).toBe(agentSkillsIndex.skills[0].description);
  });
});
