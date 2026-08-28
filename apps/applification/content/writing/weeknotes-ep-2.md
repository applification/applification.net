---
title: Weeknotes Ep 2
date: '2024-03-04'
updated: '2024-03-07'
type: weeknote
summary: Diving into AI Generative UI with React Server Components
topics:
  - weeknote
  - ai
  - design
featured: false
draft: false
slug: weeknotes-ep-2
legacyId: '43'
---
This week I dug into [AI driven Generative UI](https://applification.net/posts/ai-generative-ui-rsc) and how AI is driving a [fundamental shift in user interfaces](https://www.nngroup.com/articles/ai-paradigm/), away from traditional **Command and Control** interactions to **Goal and Intent** based interactions.

The traditional command-and-control UI patterns, where people mostly toggle controls to achieve desired outcomes, are being challenged by new intent-based interactions. This new paradigm **enables people to express what they want using natural language**, usually in the form of a chat prompt and following conversation.

Yet, current chat-based interactions suffer from requiring users to write out their problems as prose text, yet [literacy research](https://www.linkedin.com/pulse/prompt-driven-ai-ux-hurts-usability-jakob-nielsen/) deems it likely that half the population in rich countries is not articulate enough to get good results from one of the current AI bots. It would seem GUIs still have a place.

Indeed there appears a lot of[ innovation in UI design due to ai](https://bootcamp.uxdesign.cc/5-6-ui-patterns-to-power-your-ai-products-ae1591981a78) much of it around helping define the users intent & end goal. Visual information is often easier to understand and faster to interact with than text. I believe future AI systems will likely have a **hybrid user interface** that combines elements of both **intent-based and command-based interfaces** while still retaining many GUI elements.

![](/images/writing/weeknotes-ep-2-01-848147d45a.webp)

On a practical level I started researching how to build AI generative user interfaces with Vercel’s AI SDK 3.0. The SDK opens up the possibility to build such UI interactions through streaming of React Server Components.

To get an understanding of how it works I’ve started re-architecting my [AI CV Chat application](https://ai-cv.applification.net/) to use the new `ai/rsc` package of AI SDK 3.0. I currently have the existing functionality replicated with server streaming of React components. Next week I hope to start building some AI driven generative UI!
