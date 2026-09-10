import { z } from "zod";
import {
  contractPositioning,
  contractPositioningDescriptions,
  personalLinkedInUrl,
} from "./contract-positioning";
import { portfolioProducts } from "./portfolio";

export const siteUrl = "https://www.applification.net";
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
  },
  products: publicProducts.map(({ slug, name, pricing }) => ({
    slug,
    name,
    ...pricing,
  })),
};

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
