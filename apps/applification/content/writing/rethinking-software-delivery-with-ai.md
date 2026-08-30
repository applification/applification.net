---
title: AI is making me rethink software delivery
date: '2026-08-30'
updated: '2026-08-30'
type: post
summary: >-
  AI has changed how I write, design, test and build software. It may also
  change the way we buy it and what ownership means.
topics:
  - ai
  - software-engineering
  - product-development
  - story-mapping
featured: false
draft: true
slug: rethinking-software-delivery-with-ai
---
This blog post started as a conversation.

I opened Codex inside the applification.net codebase, created a new Git worktree and described the idea I wanted to explore. We went back and forth over the argument, the examples from my own work and where StoryLoops fitted into it. Codex then wrote a first draft as Markdown directly inside the website.

That sounds fairly ordinary now. It would have sounded ridiculous when I built the previous version of this site.

The old applification.net stored posts in PostgreSQL on Fly.io. I built an admin interface with a Tiptap rich text editor. Tiptap produced JSON, which I stored in the database and rendered on the site.

It worked. I never enjoyed writing that way.

Every post started by logging into an admin screen and writing inside the particular box I had designed for myself. The editor could only do what I had already taught it to do. If I wanted to add a new kind of content, I first had to stop writing and become the developer of my writing tool.

The new site keeps its writing in the codebase. Manual edits are easy in any Markdown editor. More importantly, the format is no longer a practical limit on what a post can contain.

Suppose I want an interactive diagram to explain an idea. Or an animated SVG built with Motion. Or a YouTube video presented in a particular way. Previously I would have needed to add that capability to the admin panel, design a generic editing interface for it, update the JSON schema and teach the renderer about it. The result would still have been limited to the options I had anticipated.

Now I can ask for the exact thing the article needs. The AI can build it in the website, next to the article, using the same components and design system as everything else.

The difference is bigger than a nicer publishing workflow. It has made me question a lot of what I thought I knew about delivering software.

## I no longer write code by hand

I have not written code by hand since December 2025.

I still build software every day. I make architectural decisions, work through product problems, inspect behaviour and decide whether the result is good enough. But typing the implementation is no longer the valuable part of my job.

The work now sits on either side of the model.

On the way in, I need to get the idea out of my head with enough clarity that an LLM can act on it. That means explaining the user, the problem, the constraints and the behaviour I expect. On the way out, I need evidence that the result matches what I asked for and has not broken something I forgot to mention.

Prompting is only a small part of this. The real skill is creating a reliable route between intent and verified software.

I wrote about the need for that rigour in [AI-native software still needs rigour](/writing/ai-native-software-needs-rigour). Removing human typing does not remove software engineering. It moves the engineering into product definition, context, architecture and validation.

## Testing becomes a user journey

Testing used to begin with deciding what automated tests a developer should write alongside the implementation. I still want those tests, but AI allows me to approach the problem from the outside as well.

I can give Codex an embedded browser and ask it to use the product. It can work through the user journeys, inspect what appears on screen, find problems, record them as bugs and fix them. Then it can repeat the journey to prove that the behaviour changed.

The instruction is no longer only "write tests for this component". It can be "sign in, create a story map, move a story, refresh the page and check that nothing was lost".

That does not make testing automatic or infallible. I still have to describe the journeys that matter and decide what evidence is convincing. AI is very capable of declaring victory too early. The answer is stronger acceptance criteria and checks at several levels, not blind trust.

The same applies to accessibility. I can ask the agent to navigate by keyboard, inspect the accessibility tree, check focus order, test at different sizes and fix the problems it finds. Accessibility moves closer to the normal delivery loop instead of waiting for a specialist audit near the end.

## Design has become less constrained

For years I leaned heavily on Tailwind and component libraries such as shadcn/ui. I still use Tailwind, and I still value a good component library, but I no longer need them to supply most of the design thinking.

I have a UI and UX expert available whenever I want to work through an idea. We can discuss visual hierarchy, interaction patterns and the awkward cases before any implementation begins. The agent can then build several approaches and show them in the real product.

Oddly, this has pushed me towards a more old-school way of building interfaces. I use lower-level Tailwind and CSS more often now. Starting with a generic component and accepting its design compromises can take longer than describing the interface I actually want.

AI gives me more freedom to care about small details because I do not have to weigh each one against the time it will take me to type the CSS.

That freedom needs taste. AI will happily decorate a page until every card glows and every heading arrives with a gradient. The useful change is not that design decisions disappear. I can explore and implement those decisions without the old cost.

## What happens to software ownership?

The "SaaS apocalypse" has been widely predicted. I do not expect Spotify or Netflix to disappear soon, although I have started building up my vinyl collection again.

For many other categories of software, though, I think a change is coming.

Take story-mapping software. A team can pay a monthly subscription for StoriesOnBoard or Avion. They are good products. The subscription buys a maintained service, collaboration features and a roadmap someone else is responsible for.

But does that model make as much sense as it used to for every customer?

Software once came in a physical box. Later it became a digital download, but the deal remained familiar. You paid for a version and owned it for as long as you could run it. SaaS replaced the high upfront price with a smaller monthly payment. That felt attractive at first. Keep paying for several years, across every tool used by a team, and the total looks rather different.

AI makes an older model of software ownership interesting again. It also fixes one of that model's biggest weaknesses.

Owned software used to become stale. Changing it required access to scarce developers who first had to understand somebody else's code. Bespoke software was expensive to build and expensive to maintain.

An AI-native product can arrive with the code, the decisions behind it and the instructions an agent needs to change it safely. The buyer does not have to accept a generic roadmap or wait for enough other customers to request the same feature. Their agent can adapt their version to their workflow.

## StoryLoops as a product in a box

This is the idea behind [StoryLoops](/products/storyloops).

The vision is a "product in a box". Imagine paying £500 once and owning that version for life. You receive a complete story-mapping product with the source code, deploy it for your organisation and change it when your needs change.

I do not mean a generated starter kit or a pile of code that worked once in a demo. StoryLoops is designed as a product. The user experience is deliberate. The awkward cases have been worked through. Acceptance criteria, automated tests and browser validation provide the rigour needed to change it without turning every modification into a gamble.

It is also AI-native. StoryLoops includes skills that explain its architecture, setup, deployment and safe extension to a coding agent. Those instructions are specific to the product. Instead of asking a model to reverse-engineer an unfamiliar codebase, you give it the context it needs to make a controlled change.

That creates a different relationship between the maker and buyer.

I build and polish the core product. I solve the common problems and make the important technical decisions. The buyer starts with working software rather than an empty directory. From there, their version can become more specific to them without forcing every other customer down the same path.

Some customers will never want to own or operate software this way. A subscription will remain the right answer for them. Ownership comes with responsibility, even when an AI helps with the work.

For teams already using coding agents, the trade-off is changing. Paying forever for a feature set that nearly fits may feel stranger than owning software that can be adapted to fit exactly.

## The job is to design the delivery system

Writing this article, building its website, testing its journeys and deciding how to sell StoryLoops may look like separate kinds of work. AI is pulling them closer together.

They all begin with intent. They all need useful context. They all end with a result that a person must judge.

My job is increasingly to design that whole route. I need to make it easy to express what should happen, give the agent the right constraints and demand enough evidence on the other side.

That changes how I build products. It may change what a software product is, too.

StoryLoops is my attempt to find out.
