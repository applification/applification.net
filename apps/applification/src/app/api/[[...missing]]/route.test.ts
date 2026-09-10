import { describe, expect, it } from "vitest";
import { publicContentErrorSchema } from "@/lib/content-schema";
import { DELETE, GET, POST } from "./route";

describe("unknown API paths", () => {
  it.each([
    ["GET", GET],
    ["POST", POST],
    ["DELETE", DELETE],
  ])("returns a JSON 404 with recovery hints for %s", async (method, handler) => {
    const response = handler(
      new Request("https://example.com/api/v2/anything", { method }),
    );
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(publicContentErrorSchema.safeParse(body).success).toBe(true);
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.message).toContain("/api/v2/anything");
    expect(body.error.hint).toContain("/api/openapi.json");
  });
});
