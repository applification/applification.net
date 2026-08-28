---
title: Why I hate Redux!
date: '2020-06-30'
updated: '2022-02-18'
type: post
summary: >-
  Redux in itself isn't bad but it in most cases it leads to shoving all state
  into a global context. Boy have you now got problems!
topics:
  - react
  - remix
featured: false
draft: false
slug: why-i-hate-redux
legacyId: '25'
---
I hate Redux! There I said it. I know it is the “industry standard” and Redux itself isn’t actually that terrible, the issue is now cultural and the way most people use Redux makes me sick 🤮

In most cases adopting a React/Redux architecture is a naive and lazy architectural design decision. There are valid use cases for Redux but for the majority of web apps, there really is no need for Redux, at all.

## Global State

This is a rant about Redux but more specifically it is a plea to stop making all application state global, which is exactly the behaviour Redux (perhaps inadvertently) encourages. As soon as you make app state global you’ve got some big architectural issues and a buggy, hard to test and maintain codebase. Good luck with that!

## Architect options to avoid global Redux state

### 1. Use Remix

My new favourite framework. When you use [Remix](https://remix.run/), you’ll likely find you don’t need a state management library at all 😃

### 2. Use Server State Libraries

If Remix isn’t an option and you need to make client-side API calls use a library like [React Query](https://github.com/tannerlinsley/react-query) or [SWR](https://swr.vercel.app) that abstract away state management for server state. Congratulations you’ve just removed a huge chunk of state management code from your app.

### 3. Form State

Rather than using Redux global state to manage form state use a library such as [React Hooks Form](https://react-hook-form.com). Form state stays with the form.x

### 4. XState

If an application really does require state management, use an [XState state machine](https://xstate.js.org/docs/) and [visualise your application logic](https://stately.ai).

### 5. Keep State in Components

Wherever possible, keep state where it is used, in the components. [Use component composition and pass data as props](https://www.youtube.com/watch?v=3XaXKiXtNjw).

## Final Thoughts

- Yes I’m aware of [Redux Toolkit](https://redux-toolkit.js.org) which takes away many of the common Redux pain points

In the real world though it’s rarely the case. What you see is Redux used without thought for why and chucking everything in global state for no good reason.

The best state management code is none at all, give [Remix](https://remix.run) a try!
