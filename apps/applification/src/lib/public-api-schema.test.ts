import { describe, expect, it } from "vitest";
import { publicOpenApi } from "./public-api-schema";

describe("public OpenAPI document", () => {
  const deliver = publicOpenApi.paths["/api/contact/deliver"];

  it("declares an Idempotency-Key header on the write operation", () => {
    expect(deliver.post.parameters).toEqual([
      { $ref: "#/components/parameters/IdempotencyKey" },
    ]);
    const parameter = publicOpenApi.components.parameters.IdempotencyKey;
    expect(parameter.name).toBe("Idempotency-Key");
    expect(parameter.in).toBe("header");
    expect(parameter.required).toBe(true);
  });

  it("documents the async job pattern with 202, Location and a job id to poll", () => {
    const accepted = deliver.post.responses["202"];
    expect(accepted.headers.Location.required).toBe(true);
    const body = publicOpenApi.components.schemas.ContactDeliveryAccepted as {
      required?: string[];
    };
    expect(body.required).toEqual(
      expect.arrayContaining(["runId", "statusUrl", "status"]),
    );
    expect(deliver.get.operationId).toBe("getContactDeliveryStatus");
  });

  it("publishes a versioning and deprecation policy with Sunset and Deprecation headers", () => {
    const policy = publicOpenApi["x-versioning-policy"];
    expect(policy.url).toBe("https://www.applification.net/agents#versioning");
    expect(policy.minimumDeprecationWindowDays).toBe(180);
    expect(publicOpenApi.info.description).toMatch(/Deprecation and Sunset/);
    for (const path of ["/api/v1/search", "/api/v1/content", "/api/v1/catalog"] as const) {
      const headers = publicOpenApi.paths[path].get.responses["200"].headers;
      expect(headers.Deprecation).toEqual({ $ref: "#/components/headers/Deprecation" });
      expect(headers.Sunset).toEqual({ $ref: "#/components/headers/Sunset" });
    }
  });

  it("types every error response with code, message and hint", () => {
    const error = publicOpenApi.components.schemas.PublicContentError as unknown as {
      properties: { error: { required: string[] } };
    };
    expect(error.properties.error.required).toEqual(
      expect.arrayContaining(["code", "message", "hint", "docs"]),
    );
  });
});
