---
title: Let the agent be the application
date: 2026-09-30
updated: 2026-09-30
type: post
summary: "Agent applications such as ChatGPT are taking on more of the work we used to build into every product. Trying its meal-planning feature with Loami's saved recipes made me question how much of the surrounding application I still need to build."
topics: [ai, mcp, software-engineering]
featured: false
draft: false
slug: let-the-agent-be-the-application
---

In the Scheduled tab of the ChatGPT app, meal planning was offered as a feature I should try. I was already building Loami, a household assistant that holds the recipes my family likes, so I gave it a go.

ChatGPT asked questions and produced a plan. The conversation worked, but the recipes were generic. They were not what we wanted to eat.

Then I asked it to use Loami. With access to our saved recipes through MCP, ChatGPT could organise a plan around food we actually like. The same conversation became useful once it had our household's information.

The presentation still needed work. I wanted a view of the week, recipe cards and cooking steps that were easy to follow. But ChatGPT had already handled the questions and reasoning that I would otherwise have built into Loami's own chat.

That left me wondering how much application I needed to build around the recipes.

## What belongs to Loami?

For years, a new product has usually meant a new web app or mobile app. We build navigation, screens, account flows and notifications. More recently, we have started adding our own AI chat, with its own conversation history, streaming responses, attachments and model orchestration.

The meal-planning experiment showed a different arrangement. The agent application handled the conversation; Loami supplied the recipes. By "agent application", I mean something like ChatGPT or Codex, including its models, tools and surrounding services.

I want to build for that arrangement deliberately. Loami should own the household data and business rules, expose useful capabilities through MCP, and provide the interfaces that make recipes and plans easy to use. The agent can handle the conversation and coordination around them.

For Loami, the next step is an MCP App inside ChatGPT. The recipe tools already exist. Bringing richer recipe and planning interfaces into the conversation is the part I want to explore next.

## Dots could be the way in

The meal-planning conversation showed me what this could do for one request. [OpenAI's announcement of dots](https://openai.com/index/introducing-dots/) makes me think about what happens when that relationship continues.

Dots are persistent agents with their own cloud computer. They can work through connected apps, learn from feedback and keep working between conversations. The user chooses which apps they can access.

[Meta's Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), [xAI's Grok Bot](https://x.ai/bot/guides/grok-bot-101) and [Anthropic's Claude Cowork](https://claude.com/product/cowork) also take on work for the user. Their integrations and UI capabilities differ, but the broader shift is towards agents that can carry work beyond a single exchange.

I think persistent agents will become a consumer doorway into many of the domains I am talking about. Someone wants to sort out dinner, choose a film or organise a family trip. They ask the dot they already use, which can bring together the relevant services and household context. A product like Loami supplies the recipes and controlled actions that make its part of the request useful.

That changes where I expect people to begin. They may reach Loami through an ongoing relationship with their dot, rather than opening a separate application each time. I want Loami to work well in that arrangement. This is the direction I expect to develop.

## The agent can come back later

An ongoing relationship needs ways for the agent to return to work. [ChatGPT supports scheduled work](https://learn.chatgpt.com/docs/automations), including returning to an existing chat and using connected tools where the environment supports them.

The newer [MCP Events support](https://developers.openai.com/plugins/build/mcp-events) points towards an ongoing interaction loop. The user tells the agent what to watch and how to respond. A service reports a relevant change, and the agent returns to the conversation with that context.

For Loami, that could eventually mean a change to household food preferences prompting the agent to revisit a proposed plan. Loami would report what changed and supply the current data; the agent would follow the household's instructions about what to do next.

## What I would build instead

That leaves a concrete question for the product architecture. What does Loami need to own so that an agent can use it well?

The database holds households, saved recipes and preferences. As meal planning develops, it should hold the agreed plans too. Domain code defines who can access them and which changes are valid. A saved meal plan must survive a conversation ending or someone switching devices. The agent's recollection of a plan cannot be the authoritative record.

The MCP server exposes useful operations over that domain. Find saved recipes and retrieve their details. As planning develops, retrieve a plan and save an agreed change. These should be understandable capabilities with explicit inputs and results, backed by the same business rules whichever client calls them.

Designed UI components make those results usable. I can ask for a week of meals in a sentence, but comparing that week is easier in a visual plan. Replacing Tuesday's dinner may be easier with a recipe picker. When I am cooking, I want readable steps. The agent can bring in the interface when it helps, with controls designed for the task.

Storybook is where I would develop and review those components, including loading, empty and failed states. [OpenAI's MCP UI documentation](https://developers.openai.com/plugins/build/chatgpt-ui) describes how to bundle them and connect them to tools so they can render inside ChatGPT through the MCP Apps standard.

Skills can provide workflow guidance where it helps, such as how to assemble a weekly plan using Loami's capabilities. The server must still enforce permissions and valid changes itself. Household access and saved decisions need to remain correct even when an agent misunderstands a request.

## Why build another chat?

Once I look at Loami this way, its own chat becomes a candidate for removal.

Maintaining a chat interface means maintaining conversation storage, streaming, tool orchestration, attachments, memory and potentially voice. Each has its own implementation work and failure cases. The agent application is already investing in those experiences.

I want to test how much of the real meal-planning workflow works through the agent, then build what is missing. If a dedicated chat earns its place through a user need, I can keep it. Adding a chat box does not have to be the starting assumption.

## A dedicated app becomes a choice

A standalone website, perhaps built with ChatGPT Sites, may still be the right place for a persistent view of the week. A native app may earn its place through offline use or device-specific behaviour. Either should use the same authoritative data and operations as the conversational interface.

I want to choose the client after understanding the job. A bespoke Next.js application is a useful option when the workflow needs it. It does not have to be the starting point for every idea.

## What this means for astack

This informs [astack](https://astack.applification.net), the approach I'm developing for building software with agents. It covers how a task moves from intent through implementation, verification and review. For an agent-native product, I want that process to focus on the domain, its capabilities and the interfaces people need to use them.

For my current work, that means Convex for persistence and domain functions, an MCP layer for agent access, and components developed in Storybook. Loami is where I want to test how much of the surrounding application ChatGPT can provide.

I expect more household tasks to start with the agent a person already uses. Loami's job is to make our recipes available, preserve our decisions and give us good controls when we need them. That is the product I want to build around, with the conversation and coordination increasingly supplied by the agent application.
