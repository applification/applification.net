---
title: Claude Code from my phone
date: '2026-01-09'
updated: '2026-01-09'
type: weeknote
summary: >-
  Becoming a Claude Code convert after months of lukewarm Cursor usage. Building
  a frictionless publishing pipeline, running AI from my phone, and
  experimenting with agents that code while I sleep.
topics:
  - ai
  - weeknote
  - claude-code
  - productivity
  - obsidian
featured: false
draft: false
slug: weeknotes-2026-w02
legacyId: '51'
---
Over Christmas, Anthropic gave everyone double API usage as a gift. My X feed lit up with developers shipping increasingly wild projects, and I found myself watching from the sidelines feeling like I was missing out on something.

I'd been using Cursor at work for over six months by this point. It was... fine? The results were mixed, though my year-in-review stats showed I was definitely using it more over time. But something always felt off. Like the outcomes weren't quite within my control, along for the ride rather than driving.

I'd been experimenting with Claude Code for a few days when this image stopped my scroll:

![Claude Code meme comparing IDE vs CLI](/images/writing/weeknotes-2026-w02-01-93995ffaac.jpg)
*Source: **[@skeptrune on X](https://x.com/skeptrune/status/2007441928779116663)*

That's genuinely how it feels. With Cursor, I'd prompt and hope for the best. With Claude Code, I feel like I can craft any system I want to produce exactly the outcomes I'm after. The difference is hard to articulate until you experience it.

What caught me off guard was how much I'd underappreciated the CLI aspect. I'd assumed an IDE integration would always be superior, but being able to interact directly with the filesystem and any CLI tool you have installed? That's incredibly powerful. No IDE constraints, just pure terminal freedom.

That realisation sent me down a rabbit hole. If it's just a terminal, I could run it from anywhere. A few hours later I had Tailscale connecting my devices over a private VPN, Termius on my iPhone for SSH access, and tmux keeping sessions alive on my Mac. Now I can kick off a task, walk away from my desk, and approve tool calls from my phone while making coffee. Completely unnecessary. Absolutely delightful.

The pricing model flipped my expectations too. The bundled usage in Claude actively *encourages* you to use it more. Two weeks in and I'm somehow a Max subscriber, paying triple what I ever would've paid for Cursor, and I don't regret it for a second. I've got about five projects on the go already.

This weeknote is actually proof of one of them. My aging personal website had made publishing a real chore, so I connected Claude Code up to Obsidian. Now I write in markdown (often with Claude's help), use a custom skill that converts my markdown to Tiptap JSON (which my website's editor uses), and run a script that publishes directly to my database. I never have to touch my website's admin interface. An insanely simple publishing workflow I never would have attempted before.

Claude wrote all the code for it. I just architected the system and told it what I wanted.

## What I was reading

I spent a lot of time in the [Claude Agent SDK docs](https://platform.claude.com/docs/en/agent-sdk/typescript) this week, comparing the V1 async generator pattern with V2's simpler session-based approach. The SDK exposes the same engine powering Claude Code as a library, which opens up some interesting possibilities for custom tooling.

Anthropic's engineering blog had a fascinating piece on [effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Their two-agent architecture (an initializer that sets up artifacts, a coder that works incrementally) feels like the kind of pattern that'll become standard practice.

The mobile setup I mentioned came from [this post by qu8n](https://www.qu8n.com/posts/running-claude-code-from-my-phone). Simple idea, but it completely changed how I think about when and where I can work with Claude.

Also got into swyx's [Agent Labs thesis](https://www.latent.space/p/agent-labs) on Latent Space. His distinction between Model Labs and Agent Labs crystallized something I'd been sensing: the next AI giants might never train a model from scratch.

## What I worked on

The publishing pipeline for this site was the main event. Obsidian for writing, Claude Code for conversion, straight into the database. No admin panel, no friction. It's the kind of setup that makes you wonder why you tolerated the old way for so long.

I also built a 3D model creator in Python with Claude. Feed it a prompt, get geometry. Still early days, but watching it generate shapes from natural language feels like magic.

Most of my time went into crafting Claude Code skills. These little instruction files that shape how Claude approaches specific tasks. I'm slowly building out my entire delivery process this way, one skill at a time.

The most ambitious experiment: a Ralph Wiggum loop that picks items off my kanban board and writes code while I sleep. It's not reliable yet, but when it works? I wake up to pull requests. That's the future I want to live in.

## What I learned

Opus 4.5 is remarkably reliable for writing code. Not perfect, but consistent in a way that builds trust. You start giving it harder problems because you expect it to handle them.

The real unlock is wrapping it properly. Good skills, a solid agent harness, clear boundaries. The model is the engine, but the harness is what makes it drive straight.

Even "dumb" approaches work when implemented well. The Ralph Wiggum loop sounds almost too simple to be effective. But simplicity, it turns out, is a feature. Fewer moving parts means fewer failure modes.

The biggest lesson: invest in your PRDs and acceptance criteria. The quality of your output is directly proportional to the clarity of your input. Garbage in, garbage out. Precision in, precision out.

## What I'm thinking about

I've barely scratched the surface with Claude Code. Two weeks in and I'm already rebuilding how I work, but it feels like I'm still in the tutorial level. There's so much more to understand about skills, harnesses, and agent orchestration.

The bigger question keeps nagging at me: what happens to software delivery when AI can code overnight and write PRDs on par with a senior engineer? The volume of PRs, the speed of iteration, the ability to explore multiple approaches in parallel. Everything I learned about delivery over the past twenty years might need rethinking.

And if AI can build software this fast, what even constitutes a moat anymore? How will people use software when anyone can spin up a custom tool in an afternoon? I don't have answers yet, but I suspect the companies figuring this out first will define the next decade.

The [Agent Labs thesis](https://www.latent.space/p/agent-labs) keeps rattling around my head. The shift from Model Labs to Agent Labs means engineering matters more than data science again. Building products on top of models, not training them from scratch. That's a game I know how to play.

## Links

- [Claude Agent SDK docs](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) - Anthropic Engineering
- [Running Claude Code from my phone](https://www.qu8n.com/posts/running-claude-code-from-my-phone) - qu8n
- [Agent Labs: Welcome to GPT Wrapper Summer](https://www.latent.space/p/agent-labs) - swyx on Latent Space
- [@skeptrune on X](https://x.com/skeptrune/status/2007441928779116663) - the meme that started it all
