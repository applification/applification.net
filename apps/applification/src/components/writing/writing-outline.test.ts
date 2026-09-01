import { describe, expect, it } from "vitest";
import { extractWritingOutline } from "./writing-outline";

describe("extractWritingOutline", () => {
  it("creates stable unique ids for article section headings", () => {
    expect(
      extractWritingOutline(`
## Design & delivery
Body.
## **Design & delivery**
### Nested detail
`),
    ).toEqual([
      { id: "design-and-delivery", label: "Design & delivery" },
      { id: "design-and-delivery-2", label: "Design & delivery" },
    ]);
  });

  it("ignores headings inside fenced code", () => {
    expect(
      extractWritingOutline(`
\`\`\`md
## Not a section
\`\`\`
## A real section
`),
    ).toEqual([{ id: "a-real-section", label: "A real section" }]);
  });
});
