---
title: Weeknotes Ep 1
date: '2024-02-29'
updated: '2024-02-29'
type: weeknote
summary: >-
  This week, I delved into React Server Components in Next.js and explored some
  exciting new features in the Vercel AI SDK realm.
topics:
  - weeknote
  - ai
  - next.js
  - react
featured: false
draft: false
slug: weeknotes-episode-1
legacyId: '40'
---
This week, I delved into React Server Components in Next.js and explored some exciting new features in the Vercel AI SDK realm. Here's a glimpse into what I've learned and how it's shaping my approach to development

## React Server Component Chronicles:

The decision by Next.js to go all in on [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) with [App Router](https://nextjs.org/blog/june-2023-update) means React server renders components by default and you opt into using [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) when you need more interactivity. A 180 degree flip.

In certain client side interactions this server-centric routing can cause React to wait on a server roundtrip before it can update the page and client state. This is exactly the scenario I had this week when implementing a search feature. When typing a query into the search input the UX would “hang” until the server returned the fresh data and only then would the UI update.

A timely stumble across Sam Selikoff's post on [Instant Search Params with React Server Components](https://buildui.com/posts/instant-search-params-with-react-server-components) provided invaluable insight into leveraging the new React hooks [useOptimistic](https://react.dev/reference/react/useOptimistic) and [useTransition](https://react.dev/reference/react/useTransition) to instantly optimistically update the UI and apply the server state once the transition settled. The end result is a responsive UI even when components are server rendered on a 3G internet connection.

![](/images/writing/weeknotes-episode-1-01-64b02ebe42.gif)

## AI SDK Awesomeness:

Vercel's continue to push the AI boundaries. This week they teased some upcoming AI features posting a React Server Component streaming AI response that seemingly uses AI to generate the UI on the fly.

![](/images/writing/weeknotes-episode-1-02-43448350e7.gif)

When paired with Jared Palmer’s tweet about AI SDK being “all in” on React Server Components the direction of travel for creating the very best AI UX will be server rendered React components.

[View the embedded post](https://x.com/i/web/status/1762550298881724777)

[View the embedded post](https://x.com/i/web/status/1762550298881724700)

I strongly suspect this UX is enabled by moving the AI SDK [Streaming Server Actions](https://sdk.vercel.ai/docs/api-reference/streaming-react-response) out of experimental. I used the experimental version of streaming server actions in my [AI CV Chat](https://ai-cv.applification.net/) to stream server components which enabled me to easily provide citations in addition to the AI response.

If the next level of streaming React components enables AI to decide what UI to show based on the users request, that is ground-breaking. I could certainly see a future where simply providing an AI model with access to a Figma design system & Storybook of UI Components would be sufficient to build an app layered on top of a simple chat interface.
