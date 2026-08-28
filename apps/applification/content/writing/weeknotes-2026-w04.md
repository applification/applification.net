---
title: 'Week 04, 2026'
date: '2026-01-25'
updated: '2026-01-25'
type: weeknote
summary: >-
  Design tooling meets AI development, agent infrastructure scales massively,
  best practices crystallize, and the skills ecosystem matures
topics:
  - weeknote
  - ai
  - design
  - claude-code
  - vercel
featured: false
draft: false
slug: weeknotes-2026-w04
legacyId: '53'
---
This week felt like a turning point. The tools I've been reading about started showing up in my actual workflowPencil for design, Conductor for multi-agent development, Skills.sh for extending Claude Code. The gap between "interesting announcement" and "thing I'm using daily" compressed to days. Meanwhile, the ecosystem continued its relentless pace: Vercel talking about "trillions of digital workers," best practices documentation finally catching up to the tooling, and the skills concept maturing into something genuinely useful.

### Design Meets AI Development

The most significant shift this week was design tooling entering the AI development workflow. **Pencil** launchedan infinite design canvas that integrates directly with Claude Code. It's essentially a lightweight Figma where you can talk through your designs and have AI generate components. I used it to build marketing website components for Plantry, and while there's a learning curve, the conversational design workflow is genuinely different from anything before.

Alongside this, **shadcn announced Figma integration** for shadcn/create, bringing theme setup and icon libraries directly into the design tool. The design-to-code pipeline is tightening. Generative UI continues to evolve too, json-render now exports production-ready source code via @json-render/codegen. Chris Tate calls it "vibe coding with guardrails," and that captures it well: AI-generated UI that's actually deployable.

### Agent Infrastructure Scales

Vercel's vision this week was breathtaking in scope. Guillermo Rauch described **Vercel Sandbox** as infrastructure for "trillions of digital AI workers" cloud computers purpose-built for AI agents that can clone and launch millions of agents with filesystem snapshots via a single API. Whether or not you believe the numbers, the direction is clear: AI agents as first-class computing citizens with dedicated infrastructure.

On the practical end, **Conductor** emerged as a standout tool. It's a Mac app for running multiple Claude Code instances in parallel with automatic git worktree management. I was initially dismissive "just multiple Claude Codes in one interface" but the experience is remarkably smooth. PR creation, workspace management, and the overall developer experience make it genuinely useful, not just a wrapper.

**Browser Mode** also landed in the open-source Coding Agent template, powered by agent-browser. AI agents can now interact with web browsers natively, opening up testing and automation workflows that weren't practical before. I've set up a Claude Code skill that has the agent verify its work in the actual browser after developing a feature, it creates a nice iterative loop where the AI can see the results and self-correct, producing much better outcomes than blind code generation.

### Best Practices Finally Crystallize

The tooling has outpaced the documentation for months, but this week saw real progress on best practices. Lydia Hallie announced **Claude Code best practices documentation**, seeking community input on effective patterns. Philipp Schmid wrote about **MCP server design best practices**, arguing that MCP itself isn't the problem, poor server implementation is.

**Factory introduced the Agent Readiness Framework**a systematic way to measure how well code repositories support autonomous AI development, with eight evaluation axes and five maturity levels. Richard Seroter highlighted Anthropic's comprehensive guide on building evaluations for AI agents. The infrastructure for actually measuring whether this stuff works is finally catching up to the ambition.

### Skills Ecosystem Matures

The **Skills.sh** ecosystem, announced last week, is proving useful faster than expected. I've been using the **Excalidraw skill** to generate architecture diagrams from my codebase, you ask Claude to analyze your app architecture and it produces diagrams that, while not perfect, are solid starting points for manual refinement. Corey Haines released marketing and copywriting skills. Remotion released Agent Skills for video generation. The pattern is clear: skills as "npm for AI agents" is becoming real infrastructure, not just a concept.

---

## What I was reading

### Design & Generative UI

- [Tom Krcha - Pencil: AI Design Canvas for Claude](https://www.pencil.dev) - Infinite design canvas with Claude Code integration, WebGL rendering, git-based workflow
- [shadcn - shadcn/create Figma Integration](https://x.com/shadcn) - Upcoming Figma plugin for theme setup and 5 icon libraries
- [Chris Tate - json-render Code Generation](https://github.com/vercel-labs/json-render) - Now exports production-ready source code, "vibe coding with guardrails"

### Agent Infrastructure

- [Guillermo Rauch - AI Agent Computing Infrastructure](https://x.com/rauchg) - Vercel Sandbox for "trillions of digital workers"
- [Conductor.build - Multi-Agent Coding Platform](https://conductor.build) - Parallel Claude Code instances with automatic git worktree management
- [Chris Tate - Browser Mode for AI Agents](https://github.com/vercel-labs/agent-browser) - Now in open-source Coding Agent template

### Best Practices & Frameworks

- [Lydia Hallie - Claude Code Best Practices Documentation](https://x.com/lydiahallie) - Seeking community input on effective patterns
- [Philipp Schmid - MCP Server Design Best Practices](https://x.com/philschmid) - Poor server implementation is the problem, not MCP itself
- [Factory - Agent Readiness Framework](https://factory.dev) - Eight evaluation axes, five maturity levels for autonomous AI development
- [Richard Seroter - Building Evaluations for AI Agents](https://x.com/rseroter) - Anthropic's comprehensive evals guide

### Skills & Productivity

- [Vercel - Skills.sh Agent Skills Ecosystem](https://skills.sh) - Open ecosystem for discovering and sharing agent skills
- [Corey Haines - Marketing Skills for Claude Code](https://x.com/coreyhainesco) - Free marketing and copywriting skills
- [Remotion - Remotion Agent Skills for Claude](https://remotion.dev) - Create videos programmatically through Claude Code
- [Chris Tate - AI Agent-Assisted Complex System Development](https://x.com/chris_tate) - Built complex production system in 3-day weekend, traditionally 1-2 years

### Development Workflow

- [Michael Truell - Building a Browser with AI in Cursor](https://x.com/mntruell) - 3+ million line browser from scratch in one week using GPT-5.2
- [Claire Vo - AI Productivity Stack](https://x.com/clairevo) - Claude Code + Obsidian + Python automations for task management
- [Daniel San - Claude Code Git Flow Workflow](https://x.com/daniel_san) - Automating Git Flow with subagent handling and hooks
- [Malte Ubl - Bash vs SQL for AI Agents](https://x.com/cramforce) - Bash for short-term memory, SQL for structured data

---

## What I worked on

### Plantry

The food planning app hit several milestones. **Convex deployment to production** finally happened, along with enhanced AI integration for how you add and manage recipes. We're now in alpha testing internally, working through bugs and refinements. The mobile app is temporarily paused while we iterate on the database structure, turns out the schema needs rethinking before we can move forward there. The Apple developer license application is in progress; we'll see where that goes next week.

The surprise addition was **Pencil.dev** for the marketing website. I read about it in Wednesday's notes and was using it by the end of the week. There's definitely a learning curve to conversational design, but I built several marketing site components through it. I could probably recreate them much faster now that I understand the workflow better. It's a genuinely fascinating way to work with designtalking through what you want rather than clicking and dragging.

### Claude Skills Exploration

**Skills.sh** has become part of my regular workflow faster than expected. The **Excalidraw skill** is particularly usefulI've been asking Claude to analyze Plantry's architecture and generate diagrams. The results aren't perfect, but they're solid starting points that I can manually refine. The skills ecosystem is starting to feel like real infrastructure rather than a novelty.

### Conductor

I was skeptical of **Conductor** at first, it seemed like just multiple Claude Code instances in one interface, not adding much value. I was wrong. The experience is remarkably smooth: responsive, great git worktree management, nice PR creation interface, easy switching between workspaces on different projects. It just makes the whole development experience feel more polished.

This stands in contrast to my experiments with **Ralph loops**. I tried Automaker and set up my own server at OVH for always-on access, but it doesn't fit how I work. The insight I keep returning to: **it's waterfall versus agile, compressed to a single user experience**. When you're in the weeds of a feature, you need to see what the AI created, have a back-and-forth, provide guidance, small iterations with quick feedback. Giving an initial spec and letting it run wild produces buggy code heading in wrong directions.

I can see Ralph loops being useful for isolated bug fixes from customer reports, smaller, well-scoped problems. But for substantial feature work, I want hands-on co-development. Matt Pocock's bash-script approach interests me for more controlled use cases, but for now, Conductor's interactive model wins.

### Monitor

A new project emerged from the **Parallel Web Systems** announcement in Wednesday's notes. I built a dashboard combining their Monitor API with **Convex** for the backend and **E2B containers** to run Python LangExtract processing in my TypeScript stack. Basic version done in a day. I won't ship this as a product, but it was a satisfying piece of work a reminder that when you pick the right architecture and flatten the layers, it's incredible what you can get done in such a short space of time.

---

## What I learned

1. **The announcement-to-usage gap is compressing** - Pencil launched Wednesday, I was using it by Friday. Conductor appeared in my notes and became my primary dev environment within days. The ecosystem moves fast enough that "reading about it" and "using it" are nearly simultaneous.
2. **Design tooling is entering AI workflows** - Pencil, shadcn Figma integration, json-render codegen. The design-to-code pipeline is tightening in ways that matter for solo developers.
3. **Best practices are finally being documented** - Claude Code docs, MCP server guidelines, Agent Readiness Framework. The infrastructure for measuring and improving AI development is catching up.
4. **Skills are becoming real infrastructure** - Skills.sh isn't just a concept anymore. I'm using Excalidraw skills for architecture diagrams as part of my regular workflow.
5. **Interactive beats autonomous for feature work** - Ralph loops and autonomous coding work for isolated tasks, but substantial features need the back-and-forth of co-development. Waterfall versus agile applies to AI collaboration too.

---

## What I'm thinking about

- The **waterfall vs agile analogy** for AI development keeps resonating. We compressed team dynamics into a single user experience, but the principles still apply. Small iterations and quick feedback beat big specs and autonomous execution. The tools that win will be the ones that enable tight feedback loops, not the ones that promise to do everything autonomously.
- **When does design tooling become essential?** Pencil feels like it might be the moment design skills become accessible to developers who've never used Figma seriously. If you can talk through what you want, the barrier drops dramatically.
- The **skills ecosystem could be as significant as npm** was for JavaScript. If agents become the primary interface to dev tools, a package manager for agent capabilities changes everything. We're still early, but the infrastructure is real now.
- **Productivity claims are getting extreme.** Chris Tate's "3-day weekend equals 1-2 years" is remarkable if true. I'm seeing compressed timelines in my own work, but I'm also wondering where the ceiling is.

---

## Links

### Tools & Platforms

- [Pencil.dev](https://www.pencil.dev) - AI design canvas with Claude integration
- [Conductor.build](https://conductor.build) - Multi-agent coding platform
- [Skills.sh](https://skills.sh) - Agent skills ecosystem
- [Vercel Sandbox](https://vercel.com/docs/sandbox) - AI agent infrastructure

### Development Resources

- [json-render](https://github.com/vercel-labs/json-render) - Generative UI framework with codegen
- [agent-browser](https://github.com/vercel-labs/agent-browser) - Browser automation for AI agents
- [Remotion Agent Skills](https://remotion.dev) - Video generation via Claude
- [E2B](https://e2b.dev) - Cloud sandboxes for AI agents and code execution

### Best Practices

- [Claude Code Best Practices](https://docs.anthropic.com/claude-code) - Official documentation
- [Factory Agent Readiness](https://factory.dev) - Framework for measuring AI-ready repositories
- [Anthropic Evals Guide](https://docs.anthropic.com/evals) - Building evaluations for AI agents

---
