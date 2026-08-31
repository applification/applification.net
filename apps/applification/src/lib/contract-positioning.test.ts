import { describe, expect, it } from "vitest";
import {
  contractPositioning,
  contractPositioningDescriptions,
} from "./contract-positioning";

describe("contract positioning", () => {
  it.each(Object.entries(contractPositioningDescriptions))(
    "keeps the approved facts in the %s metadata description",
    (_, description) => {
      expect(description).toContain(contractPositioning.role);
      expect(description).toContain(contractPositioning.stack);
      expect(description).toContain(contractPositioning.teamFit.toLowerCase());
      expect(description).toContain("remote UK");
      expect(description).toContain("Applification Ltd");
    },
  );
});
