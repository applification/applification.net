import { contractPositioning } from "../contract-positioning";

export const careerTimeline = [
  {
    year: "2003",
    title: "Founded Applification Ltd",
    description: "Founded in 2003, Applification is still the business through which I deliver my contract work.",
    earlyClients: "bet365, Department of Health, Newcastle Business School, University of York, Sunderland Council and Entrepreneurs Forum.",
  },
  {
    year: "2013",
    title: "Mobile product teams",
    description:
      "Mobile engineering and delivery leadership for TUI, Le Boat, Chubb Travel and the British Army. Appcelerator Titanium and Node.js APIs, with React Native later.",
  },
  {
    year: "2016–2017",
    title: "Scrum Master at HMRC",
    description:
      "Scrum Master for a co-located team of 17 delivering tax repayments, company car, medical benefits and tax estimation services. Introduced mob programming, user story mapping, ATDD/BDD and example mapping to improve delivery.",
  },
  {
    year: "2018–2019",
    title: "Secure government work",
    description:
      "Security-cleared frontend delivery for Cabinet Office, MoD and other government agencies. Senior Engineer, then Scrum Master and Tech Lead at Surevine.",
  },
  {
    year: "2021–2023",
    title: "Health tech",
    description:
      "Built Pando Access and rebuilt Peppy Admin to support clinicians’ day-to-day work. Delivered the Pando Access prototype in four weeks, then architected its Next.js application. At Peppy, replaced tightly coupled screens with reusable components, a Storybook design system and automated tests.",
  },
  {
    year: "2024",
    title: "Recruitment platform",
    description:
      "Sole frontend ownership of Client Server’s recruitment platform, building it in three months and taking it to production after four.",
  },
  {
    year: "2024–2026",
    title: "Principal Engineer",
    description:
      "Full-time at Logically from October 2024 to May 2026. Rebuilt the frontend in Next.js, then co-built Agentic Chat for threat analysts with AI SDK UI, MCP and Databricks tools.",
  },
  {
    year: "2026",
    title: "Released products and AI research",
    description:
      "Contexture and Voiced are live, open-source products. StoryLoops remains in development, alongside AI product research at Applification.",
    current: true,
  },
] as const;

export const positions = [
  {
    number: "01",
    title: "Frontend by instinct.",
    description:
      "React, TypeScript and Tailwind are where I move fastest. I care about composition, interaction quality and the architecture beneath both.",
  },
  {
    number: "02",
    title: "Full-stack in practice.",
    description:
      "I use Node.js and Convex when the product needs a complete vertical slice, especially in small teams and greenfield work.",
  },
  {
    number: "03",
    title: "AI-native.",
    description:
      "Claude Code and Codex speed up the work. Product context, narrow scope, tests, visible checks and human-controlled MCP workflows keep it honest.",
  },
] as const;

export const profileFacts = [
  ["Availability", contractPositioning.availability],
  ["Role", contractPositioning.role],
  ["Stack", contractPositioning.stack],
  ["Location", contractPositioning.location],
  ["Fit", contractPositioning.teamFit],
  ["Contract", contractPositioning.contractBasis],
] as const;

export const bestFit = [
  "Greenfield or architectural reset",
  "React, TypeScript and Tailwind",
  "AI product interfaces and agent workflows",
  "Direct access to product decisions",
] as const;

export const selectedWriting = [
  {
    title: "AI-native software still needs rigour",
    description:
      "What old and new codebases taught me about building with AI without surrendering control or quality.",
    href: "/writing/ai-native-software-needs-rigour",
  },
  {
    title: "AI is making me rethink software delivery",
    description:
      "How AI has changed the way I write, design, test and build software, and what that means for ownership.",
    href: "/writing/rethinking-software-delivery-with-ai",
  },
] as const;
