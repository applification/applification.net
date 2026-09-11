import { contractPositioning } from "../contract-positioning";

// Authored introductions shared by the visual pages and their Markdown views.
export const sitePageCopy = {
  home: {
    title: ["React and Next.js products.", "Production AI that earns its place."],
    description: "I join product teams to build web applications, modernise existing frontends and put AI into production. Senior engineering, from the first technical decision through to release.",
    method: "I use agents to shape scope, gather context, implement, test and review. The work still ships on evidence and human approval.",
  },
  about: {
    title: "I build software, shape the work and stay close to the product.",
    description: `A ${contractPositioning.role} with a frontend bias, full-stack depth and more than twenty years of experience turning uncertain product ideas into working software.`,
  },
  clientWork: {
    title: "Production work, with the decisions and outcomes attached.",
    description: "More than 20 years building greenfield products and rebuilding brittle frontends for startups, scale-ups and public services, close to both product decisions and code.",
  },
  products: {
    title: "Products built around real work.",
    description: "A small portfolio of tools for clearer agent collaboration, shared domain context and useful everyday software.",
  },
  writing: {
    title: "Notes from agent loops, product builds and real constraints.",
    description: "Practical notes on working with coding agents, shipping my own products and revisiting older technical posts that still hold up.",
  },
} as const;

export const agentsCopy = {
  title: "Explore my work with your AI.",
  description: "Prefer a conversation? Explore this site with your favourite AI assistant. Ask about my experience, explore a product, or find work relevant to your project.",
  handoff: "Make the prompt your own, then choose an assistant to open a new chat. For Gemini, paste the copied prompt into the new chat. You may need to sign in; if the prompt does not carry over, copy and paste it.",
  guidance: "Enable web access so your assistant can read the linked pages. If it cannot open a page, use Agent view to copy its Markdown into your conversation.",
  prompt: "Read https://www.applification.net and help me understand Dave Hudson’s experience. Ask me about my project, then find relevant examples from his client work and writing. Include links to your sources.",
} as const;

// Default deep links are also published in Markdown. The prompt editor uses
// these destinations in native GET forms to pass the current field value.
export const assistantPromptLinks = [
  { id: "chatgpt", name: "ChatGPT", label: "Open in ChatGPT", href: `https://chatgpt.com/?q=${encodeURIComponent(agentsCopy.prompt)}` },
  { id: "claude", name: "Claude", label: "Open in Claude", href: `https://claude.ai/new?q=${encodeURIComponent(agentsCopy.prompt)}` },
  { id: "perplexity", name: "Perplexity", label: "Open in Perplexity", href: `https://www.perplexity.ai/search/new?q=${encodeURIComponent(agentsCopy.prompt)}` },
  { id: "grok", name: "Grok", label: "Open in Grok", href: `https://grok.com/?q=${encodeURIComponent(agentsCopy.prompt)}` },
  { id: "gemini", name: "Gemini", label: "Open in Gemini", href: "https://gemini.google.com/app" },
] as const;
