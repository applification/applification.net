import { businessDescription } from "../site-identity";

export const businessCopy = {
  title: "Your systems and data, usable through AI assistants.",
  description: businessDescription,
  commissioning:
    "Bring us an existing system, a useful workflow and the people who need access. We agree a scope, build the integration and take responsibility for delivery through deployment and handover.",
  agency: "Bring specialist MCP delivery into your client project.",
  agencyDescription:
    "Involve Applification when your client wants AI access to existing systems, an MCP integration or an interactive app inside an assistant. Dave works alongside your team, helping shape the proposal and owning an agreed part of delivery.",
  proposal:
    "Design and deliver an MCP integration for an agreed business workflow, including scoped access, an assistant interface where useful, deployment, documentation and handover.",
} as const;

export const capabilities = [
  {
    title: "MCP integrations",
    description:
      "Connect existing APIs, operational systems and valuable data. Design tools around business capabilities, with clear inputs, useful results and predictable failure behaviour.",
  },
  {
    title: "Controlled access",
    description:
      "Connect authentication to the system’s permission model. Scope what each user can read or change, and add human approval where a workflow needs it.",
  },
  {
    title: "MCP Apps & generative UI",
    description:
      "Give people an interactive interface inside an assistant: inspect results, compare options and act. Use generated UI where it makes information easier to understand.",
  },
] as const;

export const engagements = [
  {
    title: "Scope the opportunity",
    description:
      "Start with one valuable workflow. Review the API, users, access rules and target assistant. Agree what success looks like, the delivery boundary and the acceptance checks.",
    output: "An agreed scope and integration plan.",
  },
  {
    title: "Build the integration",
    description:
      "Implement the MCP tools, authentication and permission checks. Add an MCP App where interaction helps. Verify the workflow in the agreed assistant and deployment environment.",
    output: "A tested integration for the agreed workflow.",
  },
  {
    title: "Deploy and hand over",
    description:
      "Deliver the deployment, operational guidance and documentation. Walk your team through the integration, how access works and how to extend or support it.",
    output: "A working deployment with an informed owner.",
  },
] as const;

export const integrationExamples = [
  {
    id: "information",
    label: "Staff information",
    question: "What does our policy say about overseas travel?",
    system: "Company knowledge API",
    tool: "Search approved information",
    access: "Staff sign-in · permitted documents only",
    interface: "Read the answer alongside its source documents.",
    approval: "Read-only access; no system changes.",
  },
  {
    id: "operations",
    label: "Operational system",
    question: "Which open support cases need our attention?",
    system: "Existing support API",
    tool: "Find and inspect cases",
    access: "Team sign-in · assigned accounts only",
    interface: "Compare cases in an MCP App and open the relevant record.",
    approval:
      "Start with inspection; agree separately which actions to expose.",
  },
  {
    id: "approval",
    label: "An approved change",
    question: "Prepare an update to this customer record.",
    system: "Customer records API",
    tool: "Prepare a scoped update",
    access: "User sign-in · permitted records and fields",
    interface: "Inspect the proposed change before acting.",
    approval: "The user reviews and approves before the integration writes.",
  },
] as const;

export const integrationEvidence = [
  {
    name: "Loami",
    status: "In development",
    title: "One permission model across app and agent.",
    description:
      "Recipe and film tools use the same household access rules as the web and iPhone apps. An embedded MCP interface covers a smaller set of interactions. Public access has not been announced.",
    href: "/products/loami",
    action: "Explore Loami",
  },
  {
    name: "Contexture",
    status: "Released · open source",
    title: "Structured models that agents can work with.",
    description:
      "A reviewed domain model becomes shared code contracts. MCP tools let coding agents propose model changes for review before generated contracts change.",
    href: "/products/contexture",
    action: "Explore Contexture",
  },
  {
    name: "StoryLoops",
    status: "Archived experiment",
    title: "Agent proposals with visible human review.",
    description:
      "The story-mapping experiment explored people and coding agents working on shared plans, with proposed changes reviewed by a person. Its lessons informed astack; StoryLoops is no longer in active development.",
    href: "/products/storyloops",
    action: "Read the StoryLoops experiment",
  },
] as const;
