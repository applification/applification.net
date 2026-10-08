import {
  businessDescription,
  businessUrl,
  profileDescription,
  profileUrl,
} from "./site-identity";
import {
  contractPositioning,
  personalLinkedInUrl,
} from "./contract-positioning";
import { portfolioProducts } from "./portfolio";

const person = {
  "@type": "Person",
  "@id": `${profileUrl}/#person`,
  name: "Dave Hudson",
  url: profileUrl,
  description: profileDescription,
  jobTitle: contractPositioning.role,
  sameAs: [personalLinkedInUrl, "https://github.com/applification"],
  worksFor: { "@id": `${businessUrl}/#organization` },
};
const organization = {
  "@type": "Organization",
  "@id": `${businessUrl}/#organization`,
  name: "Applification",
  legalName: "Applification Ltd",
  url: businessUrl,
  description: businessDescription,
  foundingDate: "2003",
  founder: { "@id": person["@id"] },
  logo: `${businessUrl}/brand/applification-mark-light.svg`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "project and contract enquiries",
      url: `${profileUrl}/about`,
      availableLanguage: "en",
    },
  ],
  address: { "@type": "PostalAddress", addressCountry: "GB" },
};

export const businessStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    organization,
    {
      "@type": "Service",
      "@id": `${businessUrl}/#mcp-integrations`,
      name: "MCP integration and MCP App delivery",
      serviceType: "Software integration",
      description: businessDescription,
      provider: { "@id": organization["@id"] },
      url: `${businessUrl}/#services`,
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Businesses and agencies",
      },
    },
    ...portfolioProducts
      .filter((product) =>
        ["contexture", "astack", "voiced"].includes(product.slug),
      )
      .map((product) => ({
        "@type": "SoftwareApplication",
        name: product.name,
        description: product.description,
        url: `${businessUrl}${product.href}`,
        license: "https://opensource.org/license/mit",
        applicationCategory: "DeveloperApplication",
        author: { "@id": person["@id"] },
      })),
    {
      "@type": "FAQPage",
      mainEntity: [
        ["What can I commission?", businessDescription],
        [
          "Can agencies involve Applification?",
          "Applification works alongside agency teams to scope and deliver MCP integrations and interactive apps for their clients.",
        ],
        [
          "Who owns delivery?",
          "Founder Dave Hudson stays involved from agreed scope through deployment, documentation and handover.",
        ],
        [
          "Where is Dave’s contract profile?",
          `Dave’s engineering experience, availability and downloadable CV are at ${profileUrl}.`,
        ],
      ].map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
    {
      "@type": "WebSite",
      name: "Applification",
      url: businessUrl,
      description: businessDescription,
      publisher: { "@id": organization["@id"] },
    },
  ],
};

export const profileStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    organization,
    {
      "@type": "WebSite",
      name: "Dave Hudson",
      url: profileUrl,
      description: profileDescription,
      author: { "@id": person["@id"] },
    },
    {
      "@type": "Service",
      name: contractPositioning.role,
      serviceType: "Contract software engineering",
      description: profileDescription,
      provider: { "@id": organization["@id"] },
      url: profileUrl,
      areaServed: "GB",
    },
  ],
};
