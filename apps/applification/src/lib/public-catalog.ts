import { z } from "zod";
import {
  contractPositioning,
  contractPositioningDescriptions,
  personalLinkedInUrl,
} from "./contract-positioning";
import { portfolioProducts } from "./portfolio";
import { publicApiLimit, publicApiWindowSeconds } from "./public-api-policy";

export const siteUrl = "https://www.applification.net";
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
  storyloops: {
    model: "not_published",
    label: "Pricing not published",
    description:
      "In development. No public price or purchasing plan is published on this site.",
    sourceUrl: `${siteUrl}/products/storyloops`,
  },
  plantry: {
    model: "not_published",
    label: "Pricing not published",
    description:
      "Research and development. No public price or purchasing plan is published on this site.",
    sourceUrl: `${siteUrl}/products/plantry`,
  },
} as const;

export const publicProfile = {
  name: "Dave Hudson",
  company: "Applification Ltd",
  url: siteUrl,
  description: contractPositioningDescriptions.site,
  ...contractPositioning,
  sameAs: [personalLinkedInUrl, "https://github.com/applification"],
  // About always exists and presents the available contact routes, even when
  // the optional enquiry workflow is disabled in a deployment.
  contactUrl: `${siteUrl}/about`,
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

export const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: publicProfile.name,
      url: `${siteUrl}/about`,
      description: publicProfile.description,
      jobTitle: contractPositioning.role,
      sameAs: publicProfile.sameAs,
      worksFor: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Applification",
      legalName: publicProfile.company,
      url: siteUrl,
      description:
        "The business through which Dave Hudson delivers senior contract AI product engineering for small product teams.",
      logo: `${siteUrl}/brand/applification-mark-light.svg`,
      foundingDate: "2003",
      founder: { "@id": `${siteUrl}/#person` },
      sameAs: publicProfile.sameAs,
      // No email address or phone number is published on this site. Contact
      // routes are presented on the about page and, when enabled, the
      // reviewed enquiry workflow.
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "contract enquiries",
          url: publicProfile.contactUrl,
          availableLanguage: "en",
          areaServed: "GB",
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
      },
      areaServed: "GB",
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#contract-engineering`,
      name: contractPositioning.role,
      serviceType: "Contract software engineering",
      description: `${contractPositioning.stack} product development, frontend modernisation and production AI features for ${contractPositioning.teamFit.toLowerCase()}, delivered on ${contractPositioning.location.toLowerCase()} contracts ${contractPositioning.contractBasis.toLowerCase()}.`,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "GB",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: publicProfile.contactUrl,
        availableLanguage: "en",
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: contractPositioning.teamFit,
      },
      url: `${siteUrl}/about`,
    },
    ...publicProducts
      .filter((product) => product.pricing.model === "open_source")
      .map((product) => ({
        "@type": "SoftwareApplication",
        "@id": `${product.url}#software`,
        name: product.name,
        description: product.description,
        url: product.url,
        applicationCategory: "DeveloperApplication",
        ...(product.slug === "voiced" ? { operatingSystem: "macOS" } : {}),
        license: "https://opensource.org/license/mit",
        sameAs: [product.pricing.sourceUrl],
        author: { "@id": `${siteUrl}/#person` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
          description: product.pricing.description,
        },
      })),
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What does Dave Hudson build?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "React and Next.js products, and production AI that earns its place. Dave joins product teams to build web applications, modernise existing frontends and put AI into production, from the first technical decision through to release.",
          },
        },
        {
          "@type": "Question",
          name: "Is Dave Hudson available for contracts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `${contractPositioning.availability}, ${contractPositioning.location.toLowerCase()}, ${contractPositioning.contractBasis.toLowerCase()}. Best fit: ${contractPositioning.teamFit.toLowerCase()} building ${contractPositioning.stack} products or AI product interfaces.`,
          },
        },
        {
          "@type": "Question",
          name: "How are contracts priced?",
          acceptedAnswer: {
            "@type": "Answer",
            text: publicPricing.contract.description,
          },
        },
        {
          "@type": "Question",
          name: "Which products does Applification publish?",
          acceptedAnswer: {
            "@type": "Answer",
            text: publicProducts
              .map(
                (product) =>
                  `${product.name}: ${product.description} ${product.status.toLowerCase()}, ${product.pricing.label.toLowerCase()}.`,
              )
              .join(" "),
          },
        },
        {
          "@type": "Question",
          name: "How can an AI agent read information about Applification?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Read ${siteUrl}/llms.txt, the OpenAPI reference at ${siteUrl}/api/openapi.json, or the Agent Skills index at ${siteUrl}/.well-known/agent-skills/index.json. The public catalog, search and content endpoints are free, read-only and need no account or key.`,
          },
        },
        {
          "@type": "Question",
          name: "How do I contact Dave Hudson?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Use the contact routes on ${publicProfile.contactUrl} or LinkedIn at ${publicProfile.linkedInUrl}. Enquiries prepared on the contact page are reviewed by the visitor before they are sent.`,
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Applification",
      url: siteUrl,
      description: publicProfile.description,
      inLanguage: "en-GB",
      author: { "@id": `${siteUrl}/#person` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

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
        item: `${siteUrl}${path}`,
      }),
    ),
  };
}
