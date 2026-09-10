// Authored product copy shared by the pages and public agent reads.

export const contextureContractSteps = [
  {
    accent: "text-[#cba6f7]",
    detail: ".contexture.json",
    line: "bg-[#cba6f7]",
    number: "01",
    title: "Model",
  },
  {
    accent: "text-[#89dceb]",
    detail: "Convex schema",
    line: "bg-[#89dceb]",
    number: "02",
    title: "Generate",
  },
  {
    accent: "text-[#a6e3a1]",
    detail: "Zod + JSON Schema",
    line: "bg-[#a6e3a1]",
    number: "03",
    title: "Validate",
  },
  {
    accent: "text-[#fab387]",
    detail: "MCP tools + AI contracts",
    line: "bg-[#fab387]",
    number: "04",
    title: "Describe",
  },
];

export const contextureBuildRows = [
  {
    label: "Desktop editor",
    value: "Electron · React · TypeScript · React Flow",
  },
  {
    label: "Application stack",
    value: "Convex · Zod · JSON Schema",
  },
  {
    label: "Distribution",
    value: "Open source · MIT · GitHub releases",
  },
];

export const voicedCaptureRoutes = [
  {
    shortcut: "Hold ⌘",
    shortcutLabel: "Hold Command",
    title: "Speak and paste",
    description: "Transcribe into the previously focused editor.",
  },
  {
    shortcut: "⇧ + ⌘",
    shortcutLabel: "Shift plus Command",
    title: "Save quietly",
    description: "Record, release and send the capture to Inbox.",
  },
  {
    shortcut: "Shift ×2",
    shortcutLabel: "Shift twice",
    title: "Capture selection",
    description: "Take the selected text without changing tools.",
  },
  {
    shortcut: "⌥ Space",
    shortcutLabel: "Option Space",
    title: "Open the shelf",
    description: "Search, edit, export or move saved captures.",
  },
];

export const voicedBuildRows = [
  {
    label: "Native application",
    value: "Swift 6 · SwiftUI · macOS 14+",
  },
  {
    label: "Speech and storage",
    value: "Local Whisper · readable JSON · atomic writes",
  },
  {
    label: "Distribution",
    value: "Developer ID · Hardened Runtime · notarised",
  },
];

export const storyloopsOwnershipSteps = [
  {
    number: "01",
    title: "Purchase V1",
    description:
      "Receive the complete working application and the source code for the version you bought.",
  },
  {
    number: "02",
    title: "Open with your agent",
    description:
      "Ask your preferred coding agent to install StoryLoops for your organisation.",
  },
  {
    number: "03",
    title: "Deploy your instance",
    description:
      "The agent provisions services, configures the app, deploys it and runs smoke tests.",
  },
  {
    number: "04",
    title: "Make it yours",
    description:
      "Change the brand, roles, estimates, workflow or integrations in your owned version.",
  },
];

export const storyloopsBuildPrinciples = [
  {
    title: "Production core",
    description:
      "Next.js, React, TypeScript, Convex and WorkOS form an opinionated collaborative stack.",
  },
  {
    title: "Agent-native installation",
    description:
      "The playbook covers provisioning, environment setup, deployment and verification.",
  },
  {
    title: "Safe to customise",
    description:
      "Predictable modules, documented invariants and tests help an unfamiliar agent change it correctly.",
  },
];

export const plantryPlanningSteps = [
  {
    number: "01",
    title: "Read the household",
    description:
      "Preferences, available effort, seasonality and food that needs using.",
  },
  {
    number: "02",
    title: "Propose 2–7 days",
    description: "Build a plan short enough to stay realistic and useful.",
  },
  {
    number: "03",
    title: "Hand off shopping",
    description: "Put the resulting list into Apple Reminders.",
  },
  {
    number: "04",
    title: "Learn what happened",
    description:
      "Use cooked, skipped and changed meals to shape the next plan.",
  },
];

export const plantryBuildPrinciples = [
  {
    title: "Household first",
    description:
      "Preferences and constraints belong to the people, not a generic meal plan.",
  },
  {
    title: "Native handoff",
    description:
      "Shopping moves into Reminders instead of becoming another list to maintain.",
  },
  {
    title: "Feedback over streaks",
    description:
      "Cooked, skipped and changed are useful signals, not failure states.",
  },
];

export const productPageCopy = {
  contexture: {
    availability: {
      title: "Inspect the model editor or start with the source.",
      paragraphs: [
        "Contexture is MIT licensed. The web site explains the model, and GitHub has the desktop app, runtime packages and generators.",
      ],
    },
    specifications: {
      title: "A source file first, then editors and generators around it.",
      paragraphs: [
        "The centre is a readable domain model under version control. The desktop editor helps people shape it, while the runtime and generators turn it into the typed surfaces the app needs.",
      ],
    },
    rationale: {
      title: "A schema change should not leave five different truths behind.",
      paragraphs: [
        "In an agent-built app, drift compounds quickly. The database accepts one shape, forms accept another, and the agent works from old assumptions. Contexture turns the reviewed model into generated contracts that can be checked before code ships.",
        "One model is reviewed. Every generated surface can prove it matches.",
      ],
    },
    contractFlow: {
      title: "Change the model. Regenerate. Check the drift is gone.",
      paragraphs: [
        "Derived fields can declare who writes them, so forms and agent tools do not accept backend-owned values.",
      ],
    },
    hero: {
      title: "Design the domain once. Generate the contracts.",
      description:
        "A source-of-truth domain model for Convex apps built with agents. The schema, validators and agent context come from the same reviewed structure.",
    },
  },
  voiced: {
    availability: {
      title: "Download the notarised Mac app or build it yourself.",
      paragraphs: [
        "Voiced is MIT licensed and distributed directly for macOS 14 or newer. The source includes local build, packaging and smoke-test guides.",
      ],
    },
    build: {
      title: "A native Mac utility built around recoverable actions.",
      paragraphs: [
        "Voiced uses one CaptureItem across voice, selection and typed input. Clipboard writes restore the previous value when safe, storage is atomic, and corrupt data gets a recovery copy before the shelf starts clean.",
      ],
    },
    captureRoutes: {
      title: "Voice, selection and typed notes all land in the same shelf.",
      paragraphs: [
        "Quick captures paste straight back. Anything worth keeping can stay in Inbox until it is edited, copied or moved to Done.",
      ],
    },
    rationale: {
      title: "Good thoughts often arrive while the cursor is somewhere else.",
      paragraphs: [
        "Most dictation tools ask you to move into their interface. Voiced works from the editor already in focus, then gives longer captures a quiet place to wait. Nothing needs an account or a cloud transcript.",
        "Local Whisper transcription. No account, telemetry, cloud storage or server.",
      ],
    },
    hero: {
      title: "Capture the thought. Keep your hands on the work.",
      paragraphs: [
        "A local capture layer for macOS. Speak, select or type, then paste it, queue it or keep it on a shelf you control.",
      ],
    },
  },
  storyloops: {
    availability: {
      title: "One purchase. The product and source are yours.",
      paragraphs: [
        "V1 is in preparation. Buyers receive the working app, source code, deployment configuration and agent playbooks. There is no hosted SaaS subscription.",
      ],
    },
    buildPrinciples: {
      paragraphs: [
        "The application favours obvious architecture, explicit domain concepts and typed boundaries. Agent documentation is part of the product, not an appendix added before release.",
      ],
    },
    ownership: {
      title: "Purchase. Give it to your agent. Receive a production URL.",
      paragraphs: [
        "The installation playbook tells the agent what to provision, how to deploy and what to verify before handover.",
      ],
    },
    rationale: {
      title: "Start with a production product, not an empty directory.",
      paragraphs: [
        "An agent can generate code, but starting from zero still means hundreds of architecture, security, data and product decisions. StoryLoops gives the agent a coherent application that already works.",
        "You are buying the decisions, implementation and debugging already done, plus the source to take it further.",
      ],
    },
    hero: {
      title: "Stop renting story-mapping software. Own it.",
      paragraphs: [
        "Buy a complete collaborative story-mapping application, deploy it with your coding agent, and own the source for the version you purchase.",
      ],
    },
  },
  plantry: {
    availability: {
      title: "Plantry is still in product development.",
      paragraphs: [
        "The current iPhone prototype is testing the household planning loop before a wider release. Follow the build for availability and test invitations.",
      ],
    },
    buildPrinciples: {
      title: "The household model comes before recipe volume.",
      paragraphs: [
        "The first prototypes focus on the decisions that make a plan usable: who is eating, how much effort is available, what should be used soon and what changed last time. The recipe catalogue can grow after that loop earns trust.",
      ],
    },
    rationale: {
      title: "A technically perfect meal plan can still be useless by Tuesday.",
      paragraphs: [
        "Meal planning breaks when it ignores energy, leftovers and the people around the table. Plantry treats the plan as a short household forecast, then learns from what was cooked, skipped or changed.",
        "A useful plan adapts to the household instead of asking the household to obey it.",
      ],
    },
    hero: {
      title: "Plan meals around the household you actually have.",
      paragraphs: [
        "A meal planner for the next two to seven days. It accounts for preferences, effort, what needs using and what is in season, then hands the shopping list to Reminders.",
      ],
    },
  },
};

export const productLinks = {
  contexture: [
    {
      label: "Product website",
      url: "https://contexture.applification.net/",
    },
    {
      label: "Source code",
      url: "https://github.com/applification/contexture",
    },
  ],
  voiced: [
    {
      label: "Product website",
      url: "https://voiced.applification.net/",
    },
    {
      label: "Source code",
      url: "https://github.com/applification/voiced",
    },
  ],
  storyloops: [],
  plantry: [],
};
