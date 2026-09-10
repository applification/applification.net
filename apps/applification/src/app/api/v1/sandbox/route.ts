import { z } from "zod";
import { publicOnboarding, siteUrl } from "@/lib/public-catalog";
import { publicRead, publicReadOptions } from "@/lib/public-content-http";

const sandboxInputSchema = z.strictObject({});

// A live, anonymous first call. The response confirms the free tier and
// sandbox claims made in llms.txt, the OpenAPI document and /agents.
export function getSandbox() {
  return {
    apiVersion: "1.0.0",
    url: siteUrl,
    environment: "sandbox",
    status: "ok",
    message:
      "First call succeeded without an account, API key or sales contact. The sandbox is the production read-only API; every endpoint below is free and side-effect free.",
    onboarding: publicOnboarding,
    tryNext: [
      {
        url: `${siteUrl}/api/v1/catalog?section=profile`,
        description: "Public profile and contract fit.",
      },
      {
        url: `${siteUrl}/api/v1/search?type=client-work`,
        description: "List published client work.",
      },
      {
        url: `${siteUrl}/api/v1/content?type=client-work&slug=logically`,
        description: "Read a case study section by section.",
      },
    ],
  };
}

export function GET(request: Request) {
  return publicRead(request, sandboxInputSchema, getSandbox);
}
export const OPTIONS = publicReadOptions;
