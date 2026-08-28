---
title: Weeknotes Ep 3
date: '2024-03-12'
updated: '2024-03-14'
type: weeknote
summary: >-
  Animating AI Generative UI with Framer Motion, digging into Tailwind CSS v4
  Alpha & React compilation
topics:
  - weeknote
  - react
  - ai
  - design
  - next.js
featured: false
draft: false
slug: weeknotes-ep-3
legacyId: '45'
---
This week, I continued delving into rendering custom React components in AI chats using Vercel’s AI SDK, explored the new Tailwind CSS v4 Alpha, and investigated the upcoming React Compiler.

## Streaming AI React Components with Framer Motion

I touched on the topic of AI streaming of React components in my recent weeknotes, but this week, I put theory into practice.

Last week, I came across a Tweet showcasing a sleek Vercel UI feature that utilised [ai/rsc](https://sdk.vercel.ai/docs/concepts/ai-rsc) to animate different states of a Vercel build. Impressed by its design, I decided to replicate it in my AI CV.

[View the embedded post](https://x.com/i/web/status/1765402515313475919)

For a simple example, I tasked AI with finding certain elements in the vector database context that I love. Using `ai/rsc`, I demonstrated streaming updates on the status of that query, employing Framer Motion to animate the state changes.

![](/images/writing/weeknotes-ep-3-01-9437d30799.gif)

Very neat! I envision numerous possibilities for crafting delightful user experiences by merging AI React Server Components with Framer Motion.

## **Exploring the New Horizons of Tailwind CSS v4.0 Alpha**

Tailwind CSS has always been a frontrunner in the world of utility-first CSS frameworks, and with the [unveiling of its v4.0 alpha](https://tailwindcss.com/blog/tailwindcss-v4-alpha), it’s clear that the team is not resting on its laurels. The latest iteration introduces a slew of enhancements that promise to redefine the efficiency and flexibility of web design. Let’s dive into what makes Tailwind CSS v4.0 a game-changer.

### A Leap in Performance with Oxide

At the heart of v4.0 lies Oxide, Tailwind’s new engine that’s not just an incremental update but a quantum leap in performance. Oxide is engineered to be **up to 10 times faster** and significantly lighter, with parts of it rewritten in Rust—a language renowned for its speed. This translates to quicker builds and a smoother developer experience, all without compromising on the robustness that Tailwind is known for.

### Streamlined Workflow with Unified Toolchain

Gone are the days of juggling multiple tools to manage your CSS. Tailwind CSS v4.0 integrates **Lightning CSS** directly into its core, offering a unified toolchain that handles everything from `@import` directives to vendor prefixing and even nesting support. This integration simplifies the CSS pipeline, making it more intuitive and less error-prone.

### Embracing Modern Web Standards

Tailwind CSS has always been about embracing modernity, and v4.0 is no exception. With support for **native cascade layers**, designers can now manage complex style sheets with ease. The addition of **color-mix** functions for opacity control and **container queries** ensures that your designs are not just responsive but also adhere to the latest web standards.

### Enhanced Customization with Composable Variants

Flexibility is a cornerstone of Tailwind CSS, and v4.0 elevates this with **composable variants**. This new architecture allows developers to combine variants to create complex selectors, offering unparalleled customization capabilities.

### Looking Ahead

A major goal of Tailwind CSS v4.0 is making the framework feel CSS-native, and less like a JavaScript library. No longer do you need `tailwind.config.ts` file or a `postcss.config.ts` files! Once installed you add it to your project with a regular CSS `@import` statement and start customising your theme:

```
@import "tailwindcss";

@theme {
  --font-family-display: "Satoshi", "sans-serif";

  --breakpoint-3xl: 1920px;

  --color-neon-pink: oklch(71.7% 0.25 360);
  --color-neon-lime: oklch(91.5% 0.258 129);
  --color-neon-cyan: oklch(91.3% 0.139 195.8);
}
```

The alpha release of Tailwind CSS v4.0 is just a taste of what’s to come but I really like the direction it is going in!

## React will be compiled

The core React team posted last month about how in future [React will be compiled](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024) and Andrew Clark post this tweet

[View the embedded post](https://x.com/i/web/status/1758229889595977824)

Personally I can’t wait to ditch `useMemo` and `useCallback` but I wanted to understand the background more and a post by [React Training](https://reacttraining.com/blog/react-19-will-be-compiled) explained it very well.

**React’s Evolution to Compilation** The React team is steering towards a significant shift with the introduction of “compiled React,” anticipated to arrive after version 19. This evolution marks a transition from the current manual memoization practices to automatic memoization, addressing the challenges posed by hooks in functional components. The journey to this point has seen React evolve through three eras: class components, hooks, and the upcoming compiled era.

**The Memoization Dilemma** Historically, React developers have grappled with memoization—a technique to optimize performance by caching function outputs. Class components inherently shielded developers from this complexity, but the introduction of hooks shifted the responsibility of memoization to developers. This led to “implementation bleed,” where the need to memoize one part of the code cascaded into other areas, complicating the development process.

**A Future of Auto-Memoization** The move to a compiled version of React aims to alleviate the need for manual memoization. By automating this process, developers can focus more on writing functional components without worrying about performance overheads.
