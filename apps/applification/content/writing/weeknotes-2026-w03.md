---
title: 'Week 03, 2026'
date: '2026-01-18'
updated: '2026-01-18'
type: weeknote
summary: >-
  Vercel's AI agent ecosystem push, generative UI patterns, Claude Code
  workflows, and MCP Tool Search solving context pollution
topics:
  - weeknote
  - next.js
  - ai
  - react
  - claude-code
featured: false
draft: false
slug: weeknotes-2026-w03
legacyId: '52'
---
This week painted a clear picture of what AI Engineering is shaping up to look like in 2026. The pace of change is relentless, with Vercel leading the charge on multiple fronts while the agentic development workflow continues to mature.

### Vercel is Everywhere

Vercel had an extraordinary week of releases that collectively define the emerging AI engineering stack. They shipped **Agent Skills**—essentially "npm for AI agents"—packaging a decade of React and Next.js best practices into installable capabilities for coding agents. Alongside this came **Agent Browser** (faster than Playwright, purpose-built for AI automation), **AI Elements Voice** components, and updates to the **Workflow DevKit** with durable execution and improved observability.

But the bigger story is their push into **Generative UI**. The JSON-to-UI pattern is crystallizing: AI outputs constrained JSON, which renders deterministically through a defined component catalog. This could fundamentally change how we think about frontends—interfaces that adapt to each user, generated on the fly. Rauch's vision of fully generative interfaces feels less like science fiction and more like a near-term roadmap.

The "holy trinity" of agentic UI design resources also emerged this week: rams.ai, ui-skills.com, and Vercel's own design guidelines (now installable as agent skills). Vercel isn't just building tools—they're building the ecosystem.

### Claude Code & Ralph Loops Are Changing Delivery

The software delivery process continues to evolve around agentic workflows. **Claude Code** and **Ralph loops** are becoming the default way to ship code, with humans increasingly acting as reviewers and orchestrators rather than authors.

This shift is spawning new patterns: **markdown plans** accompanying pull requests to preserve intent, and the more radical concept of **"prompt requests"** replacing pull requests entirely. Maintainers receive prompts they can re-execute rather than diffs to review. When AI writes the code, the prompt becomes the artifact that matters.

Rauch's call to return to engineering fundamentals (Unix, CLIs, tests, types, markdown) resonates here. These are the primitives that work well for both humans and AI agents. The tooling is converging on simplicity.

### MCP Context Issues: Solved?

A quiet but significant development: **MCP Tool Search** addresses the context pollution problem that's been limiting MCP adoption. Previously, connecting multiple MCP servers flooded context windows with tool definitions. The new tool search capability enables connecting to hundreds of servers without overwhelming the model—the infrastructure is finally catching up to the ambition.

This feels like a turning point for the MCP ecosystem. The ability to dynamically discover and use tools from a massive library of servers opens up workflows that weren't practical before.

---

## What I was reading

### Production AI Agents

- [vas - Building Production AI Agents at Scale](https://x.com/vasuman/status/2010473638110363839) - Guide from a founder running $3M ARR AI agents company on the differences between demo agents and production-ready systems

### Vercel's AI Ecosystem Push

- [jonathan padilla - Vercel Agent Skills React Best Practices](https://github.com/vercel-labs/agent-skills) - GitHub repo with React best practices rules for AI agents
- [@JohnPhamous - Vercel Design Guidelines as Agent Skills](https://x.com/johnphamous/status/2010777566085595357) - Design guidelines installable as agent skills
- [@vercel\_dev - Vercel Workflow DevKit Updates](https://x.com/vercel_dev/status/2011100123757953383) - Framework integrations, durable execution, observability improvements
- [Josh Pigford - Vercel Agent Browser for AI Automation](https://github.com/vercel-labs/agent-browser) - Faster than Playwright, optimized for AI agent browser automation
- [Hayden Bleasel - Vercel AI Elements Voice Components](https://github.com/vercel/ai-elements) - Components for voice agents and transcription

### Generative UI

- [@bruvimtired - Generative UI with v0-sdk](https://x.com/bruvimtired/status/1951456427945632254) - Dynamic page generation for each visitor
- [Chris Tate - JSON-Render: AI-Generated UI Framework](https://github.com/vercel-labs/json-render) - Framework for deterministic, constrained AI-generated UIs

### Development Workflow Evolution

- [Steinberger - Prompt Requests vs Pull Requests](https://x.com/i/trending/2010745948943663386) - Replacing PRs with prompts maintainers can re-execute

### Tools and Techniques

- [Ryan Carson - Automated Browser User Testing with Ralph](https://x.com/ryancarson/status/2010467429177237534) - Using Ralph for automated browser testing
- [Tenobrus - Multi-Model Council Pattern for AI](https://x.com/tenobrus/status/2010428123310129487) - Cross-model verification using multiple AI providers
- [Ben Williams - Ralph-TUI: AI Development Engine with E2E Observability](https://github.com/subsy/ralph-tui) - All-in-one AI development engine
- [Eric Hu - QMD CLI Tool for Knowledge Base Search](https://github.com/tobi/qmd) - CLI search for Obsidian knowledge bases
- [nader dabit - Claude's Programmatic Tool Calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) - Beta feature for reduced latency and token consumption
- [Simon Willison - MCP Tool Search Solves Context Pollution](https://www.atcyrus.com/stories/mcp-tool-search-claude-code-context-pollution-guide) - MCP Tool Search enabling connection to hundreds of MCPs
- [shadcn - Shadcn Registry for AI Agent Distribution](https://x.com/shadcn/status/2011826149932912831) - Using shadcn registry for distributing AI skills

### Announcements

- [Claude - Introducing Cowork for Non-Technical Tasks](https://simonwillison.net/2026/Jan/12/claude-cowork/) - Anthropic's Cowork brings Claude Code capabilities to non-technical workflows
- [Kevin Rose - Building Apps in 8 Hours with AI Tools](https://x.com/kevinrose/status/2010415973778771989) - Building complete apps rapidly with AI tools (v0, Cursor, Claude)

### UI/UX Resources

- [Charm - Terminal UI Development Tools and Libraries](https://charm.land/) - Ecosystem for modern terminal UIs

---

## What I worked on

### Food Planning & Cooking App

Finally tackled a long-time pain point: meal planning and cooking workflow. Started with **v0.app** which proved to be an inspiring jumping-off point. It made a great effort at one-shot of the initial app from a simple prompt and got surprisingly far. The credit model ran dry faster than expected though.

Transitioned to **Claude Code** and had a working app within a few hours. The v0 → Claude Code handoff is becoming a pattern: use v0 for rapid visual prototyping, then move to Claude Code for the deeper implementation work.

The bulk of the week went into integrating **Vercel Voice & Persona** for hands-free cooking—the idea being you can ask the app to read out instructions while your hands are covered in flour. Getting AI voice generation working was straightforward enough.

**Safari on iOS** is where things got painful. The Web Speech API support is inconsistent at best, and the combination of voice input + output + keeping the app responsive while cooking proved frustrating. This continues into next week. The irony of struggling with mobile browser support while reading about Vercel's voice components isn't lost on me.

---

## What I learned

1. **Vercel is building the AI agent ecosystem** - Skills as "npm for agents", design guidelines as installable skills, Agent Browser for automation, Voice components. They're betting heavily on agents being the next platform.
2. **Generative UI is gaining momentum** - The JSON-to-UI pattern seems to be crystallizing. Define component catalogs, have AI output constrained JSON, render deterministically. Could fundamentally change how we think about frontends.
3. **Code review is being reinvented** - Markdown plans alongside PRs, "prompt requests" instead of pull requests. When AI writes the code, the prompt becomes the artifact that matters.
4. **Multi-model verification** - Using a "council" of models to review outputs adds robustness. Cross-provider validation as a pattern.
5. **MCP ecosystem maturing** - Tool search solving context pollution, ability to connect hundreds of servers. The infrastructure is catching up to the ambition.

---

## What I'm thinking about

- The Vercel "skills" concept feels significant. If agents become the primary way we interact with dev tools, a package manager for agent capabilities could be as important as npm was for JavaScript.
- Generative UI raises questions about testing, accessibility, consistency. How do you QA an interface that's different for every user?
- The return to fundamentals (@rauchg) resonates. Markdown, CLI, types, tests. The things that work well with both humans and AI.

---

## Links

### Tools & Frameworks

- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) - React best practices for AI agents
- [json-render](https://github.com/chris-tate/json-render) - AI-generated UI framework
- [Charm](https://charm.sh) - Terminal UI development ecosystem
- [FxEmbed](https://fxembed.com) - Enhanced social media embed service
- [QMD CLI](https://github.com/tobi/qmd) - Knowledge base search tool

### API & Infrastructure

- [BLACKBOX Agents API](https://www.useblackbox.io/agents) - Unified API for coding agents on remote VMs
- [Vercel Workflow DevKit](https://vercel.com/docs/workflow) - Durable execution and workflow tools

### Design Resources

- [rams.ai](https://rams.ai) - Agentic UI design
- [ui-skills.com](https://ui-skills.com) - UI skills for agents
- [Vercel Design Guidelines](https://vercel.com/design) - Design system as agent skills

---
