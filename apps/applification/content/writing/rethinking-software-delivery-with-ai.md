---
title: AI is making me rethink software delivery
date: '2026-08-30'
updated: '2026-08-31'
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
draft: false
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

The difference is bigger than a nicer publishing workflow. The publishing system changed because the way I build software changed. Since the end of 2025, I have had to rethink much of what I thought I knew about coding.

## I no longer write code by hand

I have not written code by hand since December 2025.

I still build software every day. I make architectural decisions, work through product problems, inspect behaviour and decide whether the result is good enough. But typing the implementation is no longer the valuable part of my job.

The work now sits on either side of the model.

On the way in, I need to get the idea out of my head with enough clarity that an LLM can act on it. That means explaining the user, the problem, the constraints and the behaviour I expect. On the way out, I need evidence that the result matches what I asked for and has not broken something I forgot to mention.

Prompting is only a small part of this. The real skill is creating a reliable route between intent and verified software.

I wrote about the need for that rigour in [AI-native software still needs rigour](/writing/ai-native-software-needs-rigour). Removing human typing does not remove software engineering. It moves the engineering into product definition, context, architecture and validation.

Validation deserves more than a passing mention. It still includes automated tests, but I no longer think of testing as something that happens only inside the codebase.

## Testing becomes a user journey

Testing used to begin with deciding what automated tests a developer should write alongside the implementation. I still want those tests, but AI allows me to approach the problem from the outside as well.

I can give Codex an embedded browser and ask it to use the product. It can work through the user journeys, inspect what appears on screen, find problems, record them as bugs and fix them. Then it can repeat the journey to prove that the behaviour changed.

The instruction is no longer only "write tests for this component". It can be "sign in, create a story map, move a story, refresh the page and check that nothing was lost".

That does not make testing automatic or infallible. I still have to describe the journeys that matter and decide what evidence is convincing. AI is very capable of declaring victory too early. The answer is stronger acceptance criteria and checks at several levels, not blind trust.

The same applies to accessibility. I can ask the agent to navigate by keyboard, inspect the accessibility tree, check focus order, test at different sizes and fix the problems it finds. Accessibility moves closer to the normal delivery loop instead of waiting for a specialist audit near the end.

## Design becomes a conversation with working software

For most of my career, the cost of testing a design rose sharply with its fidelity. A sketch was cheap. A second production-quality interface, with real data, navigation, loading states, responsive behaviour and accessibility, was not. By the time an idea reached the product, implementation cost had already narrowed the options.

Tools such as [pen.dev](https://www.pen.dev/) and [Paper](https://paper.design/) already make this better. Both connect to Codex through MCP, so the agent can inspect and change a structured design instead of guessing from a screenshot and a paragraph of instructions. That is much better context for the agent.

But a design canvas is still a model of the interface. It is not the product running with real data, navigation, loading and failure states, responsive behaviour and accessibility. The gap matters.

AI lets me cross that gap much earlier. I can describe the user, the job and the awkward cases, then ask an agent to build several approaches inside the real application. I can click through each one, compare them at different sizes and throw away the ones that fail.

This is more than rapid prototyping. When a prototype uses the product's real components and behaviour, design and engineering become one conversation. Real content can break a hierarchy that looked convincing in a mock-up. An interaction can expose a missing product decision. Building an alternative can reveal that the data model is wrong.

That experience is not unique to me. [A 2024 study of 14 professional designers](https://research.google/pubs/promptinfuser-how-tightly-coupling-ai-and-ui-design-impacts-designers-workflows/) found that working on interface and behaviour together helped them anticipate UI problems and technical constraints. It turned their process into a back and forth in which each side improved the other.

Speed creates another problem. A model can turn a vague prompt into a polished screen so quickly that plausible gets mistaken for considered. [A 2026 study of generative UI tools](https://arxiv.org/abs/2606.13843) found that exploring several directions challenged people's assumptions and revealed possibilities they had overlooked. The same participants overwhelmingly preferred high-fidelity results. That tension feels right. I want to work with the real thing early, but I do not want the first attractive answer to end the discussion.

I still use Tailwind and shadcn/ui. They give the agent established rules and help keep the product coherent. I no longer need the component library to be a menu of what I am allowed to design. It is a set of constraints I can work within while exploring the interface I actually want.

The bottleneck has moved from producing an interface to choosing one. AI will happily make every card glow and every heading arrive with a gradient. My job is to understand why the interface exists, compare real alternatives and say no to most of them.

## Story mapping holds the work together

As implementation became faster, the danger changed. An idea was less likely to get stuck waiting for somebody to build it. I was more likely to build a great deal before discovering that I had misunderstood something important.

[Plantry](/products/plantry) made that real for me. AI helped me build a private-alpha kitchen-planning app with recipe import, meal planning and a substantial SwiftData and CloudKit model. Evaluation datasets and testing on a real iPhone exposed unreliable AI recipe imports when a site did not provide Schema.org data. I paused before a public release. Building faster would not solve that. I needed to rethink what the product could promise and what evidence I would need before asking people to trust it.

Chat is useful for working through a thought, but a transcript is a poor product model. A conventional backlog breaks the work into tickets and quickly loses the shape of the experience. I kept coming back to story mapping because it arranges the work as a user journey rather than a list.

User story mapping has always helped human teams build alignment, shared understanding and a view of the whole product. I need those same things when one collaborator is an AI. The map gives us a common reference. I can see whether a change belongs in the journey. The agent can see the surrounding stories and agreed outcomes instead of treating my latest prompt as the whole product.

Before implementation, the agent can propose a change on the map for me to inspect. Afterwards, the journey becomes the route through the product that the agent must test. Product definition, design, implementation and validation stay connected to the behaviour the user should experience.

That is why I built [StoryLoops](/products/storyloops). I wanted a place where a person and a coding agent could work on the same product model without handing control of scope to the agent. It began as me scratching my own itch, not as a theory about how software should be sold.

Once StoryLoops began to work for me, I started wondering whether it could help other people work this way too.

## What happens to software ownership?

The obvious answer was to run StoryLoops as a service and charge a monthly subscription. It was also the answer I had learned to give without thinking very hard about it.

Then I noticed the contradiction. I was building a product around the idea that coding agents make software easier to understand, test and change, while planning to keep the software on my side of a monthly payment.

I do not expect subscriptions to disappear. I do not expect Spotify or Netflix to disappear soon either, although I have started building up my vinyl collection again. A maintained service, shared infrastructure and a roadmap somebody else is responsible for can be exactly what a customer wants.

A team can already pay a monthly subscription for story-mapping products such as StoriesOnBoard or Avion. They are good products, and for many teams that model will remain a good deal.

But does it make as much sense as it used to for every customer?

Software once came in a physical box. Later it became a digital download, but the deal remained familiar. You paid for a version and owned it for as long as you could run it. SaaS replaced the high upfront price with a smaller monthly payment. That felt attractive at first. Keep paying for several years, across every tool used by a team, and the total looks rather different.

AI makes an older model of software ownership interesting again. It also fixes one of that model's biggest weaknesses.

Owned software used to become stale. Changing it required access to scarce developers who first had to understand somebody else's code. Bespoke software was expensive to build and expensive to maintain.

An AI-native product can arrive with the code, the decisions behind it and the instructions an agent needs to change it safely. The buyer does not have to accept a generic roadmap or wait for enough other customers to request the same feature. Their agent can adapt their version to their workflow.

## StoryLoops as a product in a box

This is the experiment I am now running with StoryLoops.

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
