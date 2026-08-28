---
title: The Inaugral AI Engineer Summit
date: '2023-10-11'
updated: '2023-10-11'
type: post
summary: >-
  The inaugural AI Engineer Summit recently took place in San Fransciso. The
  entire conference was streamed on YouTube, and even watching from afar, it
  proved to be a fascinating event.
topics:
  - design
  - ai
  - typescript
featured: false
draft: false
slug: aiengineer
legacyId: '34'
---
The inaugural [AI Engineer Summit](https://www.ai.engineer/summit/schedule) recently took place in San Fransciso. The entire conference was streamed on [YouTube](https://www.youtube.com/@aiDotEngineer/streams), and even watching from afar, it proved to be a fascinating event.

The founder of AI Engineer, SWYX, observes that we are in a [“once in a generation “shift right” of applied AI”](https://www.latent.space/p/ai-engineer), fueled by the emergent capabilities and open source/API availability of Foundation Models. He goes on to say that “AI tasks that used to take 5 years and a research team in 2013, now just require API docs and a spare afternoon in 2023”.

The ability to quickly use “out-of-the-box” Foundation Models, coupled with a limited pool of Machine Learning Research & Data Scientists, leads SWYX to suggest there are going to be “significantly more AI Engineers than there are ML engineers / LLM engineers”. He believes that this space will predominantly be filled by Fullstack Software Engineers.

![](/images/writing/aiengineer-01-a0cea8f513.png)

The term “AI Engineer” has certainly caught my eye, and the conference talks were all really really interesting - even if it was often pushing midnight here in the UK! As a single track conference angled towards the AI Engineer, it was very well-balanced, featuring talks on UI/UX, Chains, RAG, Orchestration, LLM Evaluation and even delved into the complex mathematics of LLMs.

My main takeaways from the summit:

### It’s still early days…

Whilst some amazing developments are already happening at scale, it is still early days in the world of AI Engineering.

The general vibe suggested that everyone was enjoying the exploration and potential, working on proofs of concept, but also encountering various hurdles that the industry needs to solve.

So, whilst it’s now possible to spin up an AI App over a weekend - a feat that [Hassan El Mghari](https://github.com/nutlope), a developer advocate at Vercel, has already accomplished many times - there’s a long tail in terms of turning prototype apps into scalable businesses.

In short, it’s a great time to get involved!

### LLMs are non-deterministic & stochastic

Traditional software development is deterministic; if you request some data, it will be returned in the expected format. Software testing is largely built around this concept.

Working with a LLM is non-deterministic/stochastic (fancy ML terminology which just means there is variability in the returned data). When dealing with stochastic software, we face new challenges:

- How do we design the UI?
- How do we craft a UX?
- How do we test the software?

These present new and interesting challenges, each with a variety of potential solutions.

Systems must adapt to this new landscape. Likewise, UI/UX designs will need to accommodate this variability, and our approach to software testing will also require adjustment.

### LLMs need model evaluation & guardrails

Due to the non-deterministic nature of LLM, traditional software testing approaches can result in intermitent failures in unit or end-to-end tests. LLMs require a paradigm shift, moving focus from traditional testing and twoards towards evaluation.

How then do we add correctness guarantees to LLM? Shreya Rajpal advocates a “Trust, but verify” approach, and her product [Guardrails AI](https://www.guardrailsai.com/), can serve as a “safety firewall around your LLMs”. Guardrails provides a framework which:

- Adds a constraint checker to ensure valid generation
- In case of a violation, it takes the generated output and the rule that was violated, then regenerates the content.

The self-healing capability of LLMs is impressive, allowing for greater determinism. This is acheived implementing verification logic in guardrails before data is returned to the end user.

### UI is moving beyond chat interfaces

The advent of chat-based UIs opened the door to people to grasp the potential of AI. However, this approach has its limitations, as the data returned is often unstructured and stochastic.

To offer richer user experiences, considerable effort in defensive UX and mangling data structures is required. One approach that has huge potential to simplify this challenge is [TypeChat](https://microsoft.github.io/TypeChat/) from Microsoft. It allows using a “data schema” to turn some user intent into a structured response. One example shown was that of ordering in a Coffee Shop. With a simple chat request:

```
☕> we'd like a cappuccino with a pack of sugar
```

TypeChat can ensure the response is structured JSON:

```
{
  "items": [
    {
      "type": "lineitem",
      "product": {
        "type": "LatteDrinks",
        "name": "cappuccino",
        "options": [
          {
            "type": "Sweeteners",
            "name": "sugar",
            "optionQuantity": "regular"
          }
        ]
      },
      "quantity": 1
    }
  ]
}
```

This ability to let AI communicate system to system and return strucutred data opens up a whole new world of AI UI/UX, and the role of an AI UX Engineer would seem to be an emerging field within AI Engineer.   
  
[Adept](https://www.adept.ai) demonstrated their futuristic thinking approach with a Google Maps style UI. In this interface, you can zoom in or out, with AI dynamically invoking LLMs to, for example, summarise the data as you zoom out or dynamically generate graphs and charts as you zoom out further.

### Small local models are taking off

Whilst Chat GPT helped created the explosion of interest in AI, there is a recognition that because models are so large they can be slow and very expensive. Whilst that is ok for playing around, if you want to scale up, the cost quickly becomes prohibitive. Hence the trend towards much smaller domain specific models, which can even be run locally, that are much quicker to respond and have vastly lower costs.

[LocalAI](https://www.localai.app) is a desktop app you can run on your own computer to experiment with models.

---

Honestly, the event was brimming with invaluable insights, and I've only scratched the surface in this recap. It's the kind of conference that warrants a second viewing to fully absorb all the knowledge shared.
