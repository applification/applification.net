import { describe, expect, it } from "vitest";
import {
  deriveReadingTime,
  getWriting,
  getWritingTopics,
  parseWritingDocument,
} from "./writing";

const validFrontmatter = `---
title: A useful note
date: 2026-08-28
type: post
summary: A short summary.
topics:
  - React
featured: false
draft: false
---

Body copy.`;

describe("parseWritingDocument", () => {
  it("derives the slug and reading time", () => {
    const entry = parseWritingDocument("useful-note.md", validFrontmatter);

    expect(entry.slug).toBe("useful-note");
    expect(entry.readingTime).toBe(1);
    expect(entry.body).toBe("Body copy.");
  });

  it("reports the filename and invalid field", () => {
    expect(() =>
      parseWritingDocument(
        "broken.md",
        validFrontmatter.replace("type: post", "type: dispatch"),
      ),
    ).toThrow(
      "Invalid writing frontmatter in broken.md: type: Invalid option: expected one of",
    );
  });
});

describe("deriveReadingTime", () => {
  it("uses 220 words per minute and always returns at least one minute", () => {
    expect(deriveReadingTime("")).toBe(1);
    expect(deriveReadingTime(Array.from({ length: 221 }, () => "word").join(" "))).toBe(
      2,
    );
  });
});

describe("the migrated writing collection", () => {
  it("contains the 31 published posts and 7 published weeknotes", () => {
    const entries = getWriting({ includeDrafts: false });

    expect(entries).toHaveLength(38);
    expect(entries.filter((entry) => entry.type === "post")).toHaveLength(31);
    expect(entries.filter((entry) => entry.type === "weeknote")).toHaveLength(7);
    expect(new Set(entries.map((entry) => entry.slug)).size).toBe(38);
    const topics = getWritingTopics({ includeDrafts: false });
    expect(topics).toContain("react");
    expect(topics).not.toContain("weeknote");
  });
});
