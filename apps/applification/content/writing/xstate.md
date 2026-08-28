---
title: Thoughts on XState
date: '2022-02-03'
updated: '2022-02-18'
type: post
summary: >-
  I've written in the past about my hate of Redux, which poses the question what
  would I use for state management? The answer is XState!
topics:
  - react
featured: false
draft: false
slug: xstate
legacyId: '26'
---
I have written in the past about my hate of Redux. I’m also a huge fan of Remix which makes client-side state management largely redundant

That said there are still scenarios where state management is a core requirement on the front and backend. In these scenarios, I reach for XState and write a state machine.

## State Visualised

One of my favourite things about [XState](http://xstate.js.org) is that it visualises state logic. Not only is this incredibly helpful when developing but is fantastic for documenting and sharing with the rest of your team.

A state machine is live code but it can also be visualised and interacted with as it is developed.

![](/images/writing/xstate-01-47810d9dee.png)

There is now even a Stately Visualiser which gets better all the time and can be used directly within VSCode.

![](https://stately.ai/mockup.svg)

## Learning Curve

Writing state machines does involve a bit of a learning curve and it is true that you initially have to spend quite a bit more time thinking about your application state and the various states your application could get into. This is **very much a good thing**! It is when you spend little time thinking about state and chuck for example Redux into your application with little thought of application state that you get problems.

## Final Thoughts

When your state is encapsulated in a state machine it is language agnostic and be easily moved between applications. It is also easy to visualise, rationalise and communicate to others what the application does. Not to mention testing your state becomes a lot easier.

My prefered option is to reach for a framework like Remix to avoid state as much as possible but when I have to write complicated state flows, I use XState.
