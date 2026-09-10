export type CaseStudy = {
  company: string;
  period: string;
  role: string;
  stack: string;
  visual?: "eruptiv";
  title: string;
  summary: string;
  metrics: Array<[value: string, label: string]>;
  pathLabel: string;
  path: string[];
  situationTitle: string;
  situation: string[];
  decisionsTitle: string;
  decisions: Array<{ title: string; copy: string }>;
  resultTitle: string;
  result: string;
  websiteLabel: string;
  websiteHref: string;
  nextLabel: string;
  nextHref: string;
};

export const eruptivCase: CaseStudy = {
  company: "ERUPTIV",
  visual: "eruptiv",
  role: "Sole frontend engineer",
  stack: "Next.js, TypeScript, Storybook",
  period: "MARCH TO AUGUST 2024",
  title: "Build the whole recruitment frontend. Put it live in four months.",
  summary:
    "Contracted through Eruptiv to build a greenfield Next.js product for Client Server against an existing API by one frontend engineer working with an API engineer and designer.",
  metrics: [
    ["3 months", "Frontend built"],
    ["4 months", "Production release"],
    ["1", "Frontend engineer"],
    ["3", "Core disciplines"],
  ],
  pathLabel: "DELIVERY PATH",
  path: ["Existing API", "Typed interface", "Storybook states", "Production"],
  situationTitle: "The backend existed. The customer product did not.",
  situation: [
    "Client Server needed a new recruitment platform around an existing API. Recruiters had to publish roles and track applicants, while candidates needed to search for jobs and apply.",
    "As the sole frontend engineer, I owned the web architecture and implementation. I worked directly with the API engineer and designer, keeping the integration boundary clear while the product took shape.",
  ],
  decisionsTitle:
    "Keep design, components and API integration independently testable.",
  decisions: [
    {
      title: "Build around the existing API contract",
      copy: "The frontend used the API already in place instead of widening the project into a backend rewrite. That kept the work focused on the recruiter and candidate journeys needed for release.",
    },
    {
      title: "Use TypeScript across the interface",
      copy: "Next.js and TypeScript gave the greenfield product one typed structure for pages, components and API integration. A single frontend engineer could change the product without chasing hidden dependencies.",
    },
    {
      title: "Put component states in Storybook",
      copy: "The designer could inspect and test interface states before they were connected to live data. Design review happened at the component boundary, where changes were cheaper to make.",
    },
    {
      title: "Use the fourth month to reach production",
      copy: "The complete frontend was ready after three months. The fourth month connected the final release work and took the recruitment platform live.",
    },
  ],
  resultTitle: "Three months to a complete frontend. Production after four.",
  result:
    "The finished product let recruiters publish jobs and track applicants, and let candidates search and apply. The component architecture also left a practical handoff: the designer could review states in Storybook and future changes had clear places to land.",
  websiteLabel: "Visit Client Server",
  websiteHref: "https://www.client-server.com/",
  nextLabel: "Read the Peppy Health case",
  nextHref: "/client-work/peppy-health",
};

export const peppyHealthCase: CaseStudy = {
  company: "PEPPY HEALTH",
  role: "Senior frontend engineer, leading a two-person team",
  stack: "React, TypeScript, Storybook, Cypress",
  period: "MARCH 2022 TO OCTOBER 2023",
  title: "Replace a zero-test clinician panel while the service scaled.",
  summary:
    "A two-person senior frontend team rebuilt Peppy Admin, the web panel clinicians used to support employees receiving Peppy's health benefit.",
  metrics: [
    ["2", "Senior frontend engineers"],
    ["100s", "Components catalogued"],
    ["Full E2E", "Cypress coverage"],
    ["£12m", "ARR during scale-up"],
  ],
  pathLabel: "RELIABILITY PATH",
  path: [
    "Inherited admin",
    "Component inventory",
    "Cypress in CI",
    "Safer releases",
  ],
  situationTitle:
    "Clinicians depended on a tightly coupled panel with no tests.",
  situation: [
    "Peppy Admin was the working interface between clinicians and employees using Peppy's employer-funded health service. Its frontend had no automated tests and tightly coupled screens made changes risky.",
    "Led a two-person senior frontend team while Peppy grew to £12 million in annual recurring revenue. We had to modernise a live clinical tool without slowing the people using it every day.",
  ],
  decisionsTitle: "Make the inherited interface visible before changing it.",
  decisions: [
    {
      title: "Catalogue the existing interface in Storybook",
      copy: "The team recorded hundreds of UI components and their states. That turned an opaque frontend into an inventory the engineers could inspect, discuss and improve.",
    },
    {
      title: "Replace screen-level coupling with components",
      copy: "Clear component boundaries reduced the reach of routine changes. Work could move through smaller units instead of reopening an entire clinician workflow for every edit.",
    },
    {
      title: "Run the complete Cypress suite in GitHub Actions",
      copy: "End-to-end checks became part of the delivery path. The team could test the clinician journeys on every change instead of relying on manual confidence.",
    },
    {
      title: "Add AI support where clinician cover stopped",
      copy: "The clinician-side Sendbird integration answered common user questions when clinicians were unavailable, including overnight. It extended support without pretending AI replaced clinical care.",
    },
  ],
  resultTitle:
    "More frequent releases, fewer bugs and a team that could change the panel safely.",
  result:
    "Storybook made the interface inspectable, Cypress put the main journeys under automated checks, and GitHub Actions ran those checks on delivery. The rebuilt frontend gave a growing healthcare service a more dependable way to ship changes.",
  websiteLabel: "Visit Peppy Health",
  websiteHref: "https://peppy.health/",
  nextLabel: "Read the Logically case",
  nextHref: "/client-work/logically",
};

export const logicallyMetrics = [
  ["6 months", "Rebuild to production"],
  ["Days to minutes", "Routine UI change time"],
  ["Several each day", "Production releases"],
];

export const logicallyDecisions = [
  {
    title: "Replace the unsupported frontend without replacing the platform",
    copy: "The team rebuilt the Create React App frontend as a multi-page Next.js product while keeping the existing backend services in place. That limited the migration boundary and let the old product continue serving customers.",
  },
  {
    title: "Move report rules behind typed APIs",
    copy: "A contract-driven path moved report construction out of React and through backend APIs to Databricks. Orval-generated clients and Zod validation removed duplicated frontend rules and made failures visible at the boundary.",
  },
  {
    title: "Connect the AI interface to production tools",
    copy: "The production Agentic Chat used the Vercel AI SDK to call Databricks threat-analysis and person-lookup capabilities through MCP tools and the typed application API.",
  },
  {
    title: "Instrument model calls before tuning the interface",
    copy: "Call logging exposed a React effect that triggered thousands of unintended model calls at a cost of about £500. The team could trace the source and stop the waste because each call had evidence attached.",
  },
];

export const logicallyCopy = {
  titles: [
    "Rebuild the product. Then connect AI to production.",
    "A live platform that could not pause for a rewrite.",
    "Make each boundary testable before adding more intelligence.",
    "Six months to production, then several releases a day.",
  ],
  paragraphs: [
    "Two roles, one product path: rebuild an unsupported intelligence frontend, make its reporting contracts explicit, then ship an AI interface used by threat analysts.",
    "Logically Intelligence depended on an unsupported Create React App frontend with product rules embedded in the interface. The team still had to support the existing platform while building its replacement.",
    "As Principal Frontend Engineer, I architected and built most of the v2 frontend with one other engineer. I led five frontend engineers and coordinated the architecture with three backend engineers and five data scientists. I later moved into the Principal AI Product Engineer role and co-built the production Agentic Chat experience.",
    "Routine interface changes fell from days to minutes. Every pull request received a Vercel preview and automated GitHub Actions checks, and merging released the application. The same product later carried a production LLM interface connected to the organisation’s threat-analysis tools.",
  ],
  role: "Principal Frontend Engineer, then Principal AI Product Engineer",
  engagement: "Full-time at Logically",
  stack: "Next.js, TypeScript, Vercel AI SDK, MCP",
  period: "October 2024 to May 2026",
};

export const supportingCases = [
  {
    company: "PANDO  /  65,000+ USERS",
    title: "Rebuilt a clinician app used across the NHS and MoD",
    copy: "Replaced effect-heavy god components with routed React UI. Built a white-label React Native proof of concept in four weeks.",
  },
  {
    company: "SUREVINE  /  SECURITY CLEARED",
    title: "Shipped secure email across Cabinet Office boundaries",
    copy: "Worked under government security clearance as the sole frontend engineer in small teams. Story maps turned policy requirements into agreed scope.",
  },
  {
    company: "HMRC  /  £1BN REPAID",
    title: "Found the release path in a 1.7m-user tax service",
    copy: "A story map showed the team could release without new feature-flag code. The service repaid £1bn and cut phone demand by £4.5m.",
  },
];
