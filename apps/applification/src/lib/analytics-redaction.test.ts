import { describe, expect, it } from "vitest";
import { redactAnalyticsUrl } from "./analytics-redaction";

describe("analytics URL redaction", () => {
  it("removes owner review capabilities from the path", () => {
    expect(redactAnalyticsUrl("https://applification.net/contact/review/eyJhbGciOi.abc123?x=1#top")).toBe(
      "https://applification.net/contact/review/[capability]",
    );
  });

  it("removes attachment download tokens from the query", () => {
    expect(redactAnalyticsUrl("https://applification.net/api/contact/attachment/download?token=secret")).toBe(
      "https://applification.net/api/contact/attachment/download",
    );
  });

  it("leaves public pages untouched", () => {
    for (const url of [
      "https://applification.net/contact?route=contract",
      "https://applification.net/contact/review/complete",
      "https://applification.net/writing/remix",
    ]) {
      expect(redactAnalyticsUrl(url)).toBe(url);
    }
  });
});
