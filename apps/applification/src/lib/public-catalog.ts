import { z } from "zod";
import { businessUrl, profileUrl, contentOrigin } from "./site-identity";
export { businessStructuredData as homepageStructuredData } from "./site-structured-data";
import {
  contractPositioning,
  contractPositioningDescriptions,
  personalLinkedInUrl,
} from "./contract-positioning";
import { portfolioProducts } from "./portfolio";
import { publicApiLimit, publicApiWindowSeconds } from "./public-api-policy";

export const siteUrl = businessUrl;
export const sandboxUrl = `${siteUrl}/api/v1/sandbox`;
export const catalogSections = [
  "all",
  "profile",
  "products",
  "pricing",
] as const;
export const catalogInputSchema = z.strictObject({
  section: z.enum(catalogSections).optional(),
});

const productTerms = {
  contexture: {
    model: "open_source",
    label: "MIT licensed source",
    description:
      "The source is available under the MIT licence. Hosting and third-party services may have their own costs.",
    sourceUrl: "https://github.com/applification/contexture",
  },
  voiced: {
    model: "open_source",
    label: "MIT licensed source",
    description:
      "The source is available under the MIT licence, with a direct macOS download. Third-party services may have their own costs.",
    sourceUrl: "https://github.com/applification/voiced",
  },
  astack: {
    model: "open_source",
    label: "MIT licensed source",
    description: "In development. The source is available under the MIT licence. Codex and third-party services may have their own costs.",
    sourceUrl: "https://github.com/applification/astack",
  },
  storyloops: {
    model: "not_published",
    label: "Pricing not published",
    description:
      "Archived. Its lessons shaped astack. No purchasing plan is published.",
    sourceUrl: `${siteUrl}/products/storyloops`,
  },
  loami: {
    model: "not_published",
    label: "Pricing not published",
    description: "In development. Public access and pricing have not been announced.",
    sourceUrl: `${siteUrl}/products/loami`,
  },
  plantry: {
    model: "not_published",
    label: "Pricing not published",
    description:
      "Archived. Household product development continues in Loami. No purchasing plan is published.",
    sourceUrl: `${siteUrl}/products/plantry`,
  },
} as const;

export const publicProfile = {
  name: "Dave Hudson",
  company: "Applification Ltd",
  url: profileUrl,
  businessUrl,
  projectContactUrl: `${businessUrl}/contact?route=general`,
  cvUrl: `${profileUrl}/cv/Dave-Hudson-CV.pdf`,
  description: contractPositioningDescriptions.site,
  ...contractPositioning,
  sameAs: [personalLinkedInUrl, "https://github.com/applification"],
  // About always exists and presents the available contact routes, even when
  // the optional enquiry workflow is disabled in a deployment.
  contactUrl: `${profileUrl}/about`,
  linkedInUrl: personalLinkedInUrl,
};

export const publicProducts = portfolioProducts.map(
  ({ slug, name, description, href, status }) => ({
    slug,
    name,
    description,
    status,
    url: `${siteUrl}${href}`,
    pricing: productTerms[slug],
  }),
);

export const publicPricing = {
  url: `${siteUrl}/api/v1/catalog?section=pricing`,
  contract: {
    model: "quote_on_request",
    label: "Quoted per engagement",
    description:
      "Contract rates are agreed for each engagement. No standard day rate is published on this site. Share the scope, duration, working arrangement and budget to discuss a quote.",
    publishedRate: null,
    contactUrl: publicProfile.contactUrl,
    linkedInUrl: personalLinkedInUrl,
  },
  api: {
    model: "free",
    description:
      "The public catalog API is free to read and requires no account or API key.",
    price: 0,
    freeTier: true,
    apiKeyRequired: false,
    sandboxUrl,
  },
  products: publicProducts.map(({ slug, name, pricing }) => ({
    slug,
    name,
    ...pricing,
  })),
};

// Machine-readable onboarding facts. Every claim links to a live URL so an
// agent can verify it with a single unauthenticated GET.
export const publicOnboarding = {
  humanInTheLoop: false,
  freeTier: {
    available: true,
    price: 0,
    scope: "Every endpoint under /api/v1, without time limit.",
    accountRequired: false,
    signupUrl: null,
    quota: `${publicApiLimit} requests per ${publicApiWindowSeconds} seconds per client IP on each server instance, shared across the public API. Read the RateLimit headers; on 429 wait for Retry-After. Hosting infrastructure may also limit; back off on 503.`,
    verifyUrl: `${siteUrl}/api/v1/catalog?section=pricing`,
  },
  apiKeys: {
    required: false,
    selfServe: "not_applicable",
    description:
      "No API key, token, cookie or Authorization header is read. Requests carrying credentials are treated as anonymous.",
  },
  sandbox: {
    available: true,
    url: sandboxUrl,
    environment: "shared",
    description:
      "The sandbox is the production API. Every read is side-effect free, so there is no separate test environment to request. GET the sandbox URL to confirm a first call end to end.",
  },
  firstCall: {
    method: "GET",
    url: sandboxUrl,
    expectedStatus: 200,
    curl: `curl --fail --show-error '${sandboxUrl}'`,
  },
  documentation: {
    guide: `${siteUrl}/agents`,
    openapi: `${siteUrl}/api/openapi.json`,
    llms: `${siteUrl}/llms.txt`,
  },
} as const;

const catalogData = {
  profile: publicProfile,
  products: publicProducts,
  pricing: publicPricing,
};

export function getPublicCatalog(input: unknown = {}) {
  const { section = "all" } = catalogInputSchema.parse(input);
  return {
    apiVersion: "1.0.0",
    url: siteUrl,
    section,
    data: section === "all" ? catalogData : { [section]: catalogData[section] },
  };
}

export function breadcrumbStructuredData(
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map(
      ({ name, path }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        item: `${path ? contentOrigin(path) : contentOrigin(trail.at(-1)?.path ?? "/")}${path}`,
      }),
    ),
  };
}
