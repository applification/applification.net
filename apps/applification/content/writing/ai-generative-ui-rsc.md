---
title: AI Generative UI
date: '2024-03-07'
updated: '2024-03-07'
type: post
summary: Intent based outcomes with AI generative UI with Vercel's AI SDK
topics:
  - ai
  - next.js
  - react
featured: false
draft: false
slug: ai-generative-ui-rsc
legacyId: '42'
---
AI is driving a [fundamental shift in user interfaces](https://www.nngroup.com/articles/ai-paradigm/), away from traditional **Command and Control** interactions to **Goal and intent** based interactions.

The traditional command-and-control UI patterns, where people mostly toggle controls to achieve desired outcomes, are being challenged by new intent-based interactions. This new paradigm **enables people to express what they want using natural language**, usually in the form of a chat prompt and following conversation.

To understand this new paradigm it is helpful to take a step back and look at how we got here

## UI Paradigms of Computing

1. **Paradigm 1: Batch Processing**  
  From the birth of computers, around 1945, the first UI paradigm was batch processing. Users specified a complete workflow of everything they wanted the computer to do. This **batch of instructions** was submitted to a data center (often as a deck of punched cards) and was processed at some unspecified time, often overnight.
2. **Paradigm 2: Comand-Based Interaction**  
  The user and the computer take turns, **one command at a time**. This paradigm is so powerful that it has dominated computing ever since — for more than 60 years.
3. **Paradigm 3: Intent-Based Outcome Specification**  
  With the new AI systems, the user no longer tells the computer what to do. Rather, the **user tells the computer what outcome they want **but does not specify how the outcome should be accomplished

The current generative AI tools like ChatGPT are limited. These current chat-based interactions suffer from requiring users to write out their problems as prose text, yet [literacy research](https://www.linkedin.com/pulse/prompt-driven-ai-ux-hurts-usability-jakob-nielsen/) deems it likely that half the population in rich countries is not articulate enough to get good results from one of the current AI bots.

If you don’t like the initial result, you need to refine the prompt and try again from scratch. Rounds of gradual refinement are required, a form of interaction that is currently poorly supported.

Visual information is often easier to understand and faster to interact with than text. Future AI systems will likely have a **hybrid user interface** that combines elements of both **intent-based and command-based interfaces** while still retaining many GUI elements.

## Intent-Based AI Generative UI

The release of the [Vercel AI SDK 3.0](https://sdk.vercel.ai/docs) enables developers to move beyond plain text and markdown chatbots to give LLMs rich, component-based interfaces by associating LLM responses to streaming React Server Components. Offering a pathway to these far richer and interactive intent-based outcomes UI.

AI SDK introduces two new concepts: `AIState` and `UIState`. These states introduce a clear separation of concerns between the server-side AI operations and client-side UI rendered in the application. This separation allows developers to securely maintain the AI state, which may include something like your system prompt or other metadata. Meanwhile, the UI state is designed to allow React Server Components to be efficiently streamed to the client.

- **AI State**  
  A JSON representation of the context AI needs to read e.g chat history
- **UI State**  
  What the app uses to display UI data and UI returned by LLM
- **Streamable UI**  
  A piece of changeable UI that can be streamed to the client. A React component.

Intent-based outcome UI combines text based AI discussions with interactive client UI to make interacting with AI a more seamless experience.

![](/images/writing/ai-generative-ui-rsc-01-43448350e7.gif)

These UI are quick to build by pairing a few API calls to LLM models (such as OpenAI) and some streaming React Server Components.
