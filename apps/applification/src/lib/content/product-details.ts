export const astackRoutes = [
  { title: "Feature", description: "Add or change user behaviour." },
  { title: "Bug fix", description: "Reproduce a defect and verify the fix." },
  { title: "Refactor", description: "Change structure while preserving behaviour." },
  { title: "Performance", description: "Measure slowness, then compare the result." },
  { title: "Investigation", description: "Answer a question from evidence." },
  { title: "Pull request", description: "Review or finish an existing change." },
  { title: "App control", description: "Make a running app controllable for verification." },
];

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
  astack: {
    hero: {
      title: "Outcome first. Proof built in.",
      paragraphs: ["astack gives Codex one entry point for engineering work. Describe the outcome. It chooses a route, follows the relevant guidance, checks what happened, and brings kept code to a pull request."],
    },
    method: {
      title: "Give the model room to do the work.",
      paragraphs: ["A clear outcome, project guardrails and a verification loop let the model take on larger tasks. astack selects checks that can catch the relevant failure and records what was actually observed.", "A substantial behaviour change keeps a short contract with observable acceptance cases. Existing projects keep their working stack and tools."],
    },
    project: {
      title: "Your project owns its decisions.",
      paragraphs: ["The Applification plugin supplies the workflow. Your project supplies its commands, environments and product decisions. A project profile records the local proof routes; a project-owned control CLI and feature map help the agent drive a running product."],
    },
    availability: {
      title: "Open source. In development.",
      paragraphs: ["astack is available as the Applification plugin for Codex under the MIT licence. The workflow is still in development. The website explains the routes and installation; the repository holds the current skill and guidance."],
    },
  },
  storyloops: {
    hero: {
      title: "StoryLoops is archived. The direction is now astack.",
      paragraphs: ["StoryLoops explored collaborative story mapping for people and coding agents. I archived it because it was slowing me down, bringing too much traditional agile process into how I developed."],
    },
    rationale: {
      title: "More trust in the model. A clearer verification loop.",
      paragraphs: ["I had to learn to trust the model more. Give it an outcome, the right guardrails and a verification loop, then let it take on bigger tasks. That delivered better results than forcing the work through a story map.", "That change in approach led to astack. StoryLoops remains here as a record of the experiment and what I learned."],
    },
    availability: {
      title: "Archived product",
      paragraphs: ["StoryLoops is no longer in active development. Explore astack for the current approach to agent-led engineering."],
    },
  },
  loami: {
    hero: {
      title:
        "A household assistant that knows what you like.",
      paragraphs: [
        "Loami brings your household’s recipes, tastes and film choices together. Talk to Loami in its own chat, or work with your preferred agent using the same household context. Use the app to review recipes and make choices together, with everyone’s preferences close at hand.",
      ],
    },
    recipes: {
      title: "Start with the food you actually cook.",
      paragraphs: [
        "Capture a recipe from a public website or Markdown note, review what Loami retained, and explicitly save your household version. Find it through the app or your agent. Adjust supported quantities for a different yield, with unresolved quantities left visible for review.",
      ],
    },
    movies: {
      title: "Choose the next family film.",
      paragraphs: [
        "Keep a shared watchlist, record who is interested, and remember what everyone thought after watching. Movie Night combines discovery, ratings, comments and a household Hall of Fame.",
      ],
    },
    engineering: {
      title: "One household, shared across interfaces.",
      paragraphs: [
        "Web, SwiftUI iPhone and MCP clients use the same Convex domain and household permission rules. Shared web components are developed in Storybook; the native client has its own renderer. Loami also has its own chat. The embedded MCP interface covers a smaller set of interactions than the full component library.",
      ],
    },
    availability: {
      title: "Building towards household planning.",
      paragraphs: [
        "Loami is in development. Meal planning and shopping are planned workflows, with component examples rather than persistent planning or shopping services. Public access has not been announced.",
        "Loami continues the household work that began with Plantry.",
      ],
    },
  },
  plantry: {
    availability: {
      title: "Plantry is archived. The work continues in Loami.",
      paragraphs: [
        "Plantry was an iPhone prototype exploring household meal planning. It is retained here as the starting point for Loami, which now includes household recipes and Movie Night.",
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
        "An archived iPhone meal-planning prototype exploring short plans, household preferences, available effort and food that needed using. This page records the original product direction.",
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
  astack: [
    { label: "Product website", url: "https://astack.applification.net/" },
    { label: "Source code", url: "https://github.com/applification/astack" },
  ],
  storyloops: [{ label: "astack", url: "https://applification.net/products/astack" }],
  loami: [
    {
      label: "Brand and component Storybook",
      url: "https://loami-storybook.vercel.app/?path=/docs/foundations-brand--docs",
    },
    {
      label: "Plantry archive",
      url: "https://applification.net/products/plantry",
    },
  ],
  plantry: [
    { label: "Loami", url: "https://applification.net/products/loami" },
  ],
};
