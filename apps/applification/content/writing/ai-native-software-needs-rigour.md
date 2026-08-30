---
title: AI-native software still needs rigour
date: '2026-08-30'
updated: '2026-08-30'
type: post
summary: >-
  What old and new codebases at Logically and Applification taught me about
  building software with AI without surrendering control or quality.
topics:
  - ai
  - software-engineering
  - story-mapping
  - testing
featured: false
draft: true
slug: ai-native-software-needs-rigour
---
[Steve Ruiz's article, "Terrible advice for software engineers"](https://x.com/steveruizok/status/2093748670617256098) gave me a useful way to describe something I have experienced across several codebases.

Steve separates software projects into two broad groups. "Old-world" projects were designed around people writing and understanding the code. Their pull requests, reviews, CI and release processes assume a human-scale flow of changes. Pushing large amounts of AI-generated code through those systems creates a mess. The bottleneck moves from writing code to reviewing it, while the people responsible for the software understand less of what is landing.

"New-world" projects are designed around AI from the beginning. People provide intent, constraints and feedback. The surrounding system lets agents implement, verify and repair the software without pretending that a person carefully wrote every line.

That distinction rings true, but I would add one condition. An AI-native codebase cannot simply remove the old controls. It needs new controls that match the speed and behaviour of AI.

I have seen what happens both with and without them.

## When the models were not ready

At Logically, we completed the Intelligence Reactor in December 2025. The architecture and much of the code predated models that were capable enough to work reliably across a large production codebase.

AI could help at the edges, but it struggled with the system as a whole. The codebase carried years of decisions, implicit knowledge and dependencies that were obvious to the people who had lived with them but difficult for a model to reconstruct. This is exactly the kind of old-world project Steve describes. The problem was not that the team had failed to adopt AI enthusiastically enough. The project had been designed for a different kind of software development.

Trying to force more AI into it would not have made the work AI-native. It would have produced more code for people to inspect and more opportunities for important context to be missed.

## An AI-built proof of concept

We also built a proof of concept at Logically using AI. That showed the other side of the problem.

The AI could move quickly and turn ideas into working software, but the project suffered from being an early experiment. We had not yet built enough testing and engineering discipline around the agent. Speed made the gaps visible sooner. It did not close them.

This is an easy mistake to make. If AI writes most of the code, it can feel as though the old engineering work has disappeared. In reality, the work has moved. Someone still needs to define what correct means, make the important decisions explicit and build a system that can prove the software meets those decisions.

Without that, an AI-native project is only an AI-generated project. Those are not the same thing.

## What changed at Applification

My newer work at Applification has been built with AI from the start. [StoryLoops](/products/storyloops), [Contexture](/products/contexture), [Voiced](/products/voiced) and this website are all AI-native codebases.

They are also more rigorous than those early experiments.

The agents have room to work, but they work inside clear boundaries. Requirements are written down. Acceptance criteria describe observable behaviour. Tests check the result. Architecture and product decisions are kept where the agent can find them. A change is not complete because an agent says it is complete.

This does not mean I understand every generated line in the same way I would have understood code I typed myself. That is one of Steve's important points. Pretending otherwise gives us the worst of both worlds. We accept the volume of AI-generated code while keeping processes that depend on detailed human authorship.

Instead, I try to understand and control the system that produces the code. I decide what we are building, how the parts fit together, which constraints matter and what evidence is required before a change is accepted.

## Story maps keep me sane

Story maps have become the most effective control I have found.

At one end, a story map keeps me honest about the product. It forces me to place a request inside a wider user journey rather than firing isolated prompts at an agent. I can see the scope, the order of work and the decisions that connect one story to another. It stops me following every plausible suggestion into another branch of work.

This is my best defence against AI psychosis. Not psychosis in the clinical sense, but the peculiar state where the model keeps producing convincing ideas and I lose track of which problem I originally intended to solve. An agent can remain busy for a very long time while the product goes nowhere.

At the other end, each story can carry full acceptance criteria and the tests needed to prove them. The agent receives enough context to make good decisions, then meets a concrete definition of done. Context goes in. Evidence comes out.

The map joins those two ends together. It helps me control my use of AI while giving the AI enough information to be useful.

This is why I am building StoryLoops. It is not only a planning tool. It routes agent context and proposed changes through a product map, with human approval before scope moves. The map becomes a shared control system for the product owner and the coding agent.

## Rigour can be part of the product

Contexture tackles a related problem at the code and data level.

In an agent-built application, assumptions can drift quickly. The database accepts one shape, a form expects another and the agent works from an outdated description. Contexture gives people and agents the same reviewed domain model, then generates contracts that the software can check.

StoryLoops provides product rigour. Contexture provides domain rigour. They make context explicit and turn important decisions into things the system can verify.

Voiced and applification.net benefit from the same approach even though they are not control products themselves. Voiced is built around recoverable actions, atomic storage and tests for failure cases. This site is delivered story by story, with acceptance criteria and automated checks around each change. AI writes a great deal of the code, but it does not get to decide what "good enough" means.

## New-world does not mean no rules

Steve argues that we should resist indiscriminate AI adoption in old-world projects while creating new projects that can take full advantage of it. I agree.

The temptation, though, is to define an AI-native project by what it removes: fewer reviews, less ceremony, less concern about who wrote a line of code. That is only half the design.

The other half is deciding what replaces those controls.

For me, the answer is a visible product model, strong context, explicit acceptance criteria and tests that exercise the real behaviour. It is giving agents freedom over implementation without giving them ownership of product intent or the definition of quality.

AI has made me much faster, but speed is not the most interesting change. The real change is that I now spend more of my time designing the conditions under which good software can be produced.

That is still software engineering. It may be more important than ever.
