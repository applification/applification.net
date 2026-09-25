import { describe, expect, it } from "vitest";
import { redactAnalyticsUrl } from "./analytics-redaction";

describe("analytics URL redaction", () => {
  it("removes owner review capabilities from the path", () => {
    expect(redactAnalyticsUrl("https://www.applification.net/contact/review/eyJhbGciOi.abc123?x=1#top")).toBe(
      "https://www.applification.net/contact/review/[capability]",
    );
  });

  it("removes attachment download tokens from the query", () => {
    expect(redactAnalyticsUrl("https://www.applification.net/api/contact/attachment/download?token=secret")).toBe(
      "https://www.applification.net/api/contact/attachment/download",
    );
  });

  it("leaves public pages untouched", () => {
    for (const url of [
      "https://www.applification.net/contact?route=contract",
      "https://www.applification.net/contact/review/complete",
      "https://www.applification.net/writing/remix",
    ]) {
      expect(redactAnalyticsUrl(url)).toBe(url);
    }
  });
});
