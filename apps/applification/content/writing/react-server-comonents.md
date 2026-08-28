---
title: 'React Server Components: Deep Dive'
date: '2024-03-07'
updated: '2024-03-07'
type: post
summary: 'Delving deeper into React Server Components, how they work & when to use them'
topics:
  - react
  - next.js
featured: false
draft: false
slug: react-server-comonents
legacyId: '44'
---
[React Server Components](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components) (RSCs) augment the fundamentals of React beyond being a pure rendering library into incorporating data-fetching and remote client-server communication within the framework.

To better understand the need for RSCs, it's helpful first to grasp the need for server-side rendering (SSR) and Suspense. With SSR alone, the user gets HTML more quickly, but must wait on an "all-or-nothing" waterfall before being able to interact with JavaScript:

- All data must be fetched from the server before any of it can be shown.
- All JavaScript must download from the server before the client can be hydrated with it.
- All hydration has to complete on the client before anything can be interacted with.

To solve this, [React created Suspense](https://github.com/reactwg/react-18/discussions/37), which allows for server-side HTML streaming and selective hydration on the client. By wrapping a component with `<Suspense>`, you can tell the server to deprioritize that component's rendering and hydration, letting other components load in without getting blocked by the heavier ones.

This vastly improves the situation, but still leaves a few remaining issues:

- Data for the *entire page* must be fetched from the server before any components can be shown. The only way around this is to fetch data client-side in a `useEffect()` hook, which has a longer roundtrip than server-side fetches and happens only *after* the component is rendered and hydrated.
- The majority of JavaScript compute weight still ends up on the client, which could be running on any variety of devices.

![](/images/writing/react-server-comonents-01-d60f5c8c75.webp)

In order to solve the above issues, React has created Server Components. RSCs individually fetch data and render entirely on the server, and the resulting HTML is streamed into the client-side React component tree, interleaving with other Server and Client Components as necessary.

This process eliminates the need for client-side re-rendering, thereby improving performance. For any Client Components, hydration can happen concurrently with RSCs streaming in, since the compute load is shared between client and server. The server, far more powerful and physically closer to your data sources, deals with compute-intensive rendering and ships to the client just the interactive pieces of code.

When an RSC needs to be re-rendered, due to state change, it refreshes on the server and seamlessly merges into the existing DOM **without a hard refresh**. As a result, the client state is preserved even as parts of the view are updated from the server.

RSCs are fully interleaved with client-side code, meaning that Client Components and Server Components can render in the same React tree. By moving the majority of your application code to the server, RSCs help to prevent client-side data fetching waterfalls, quickly resolving data dependencies server-side.

With RSCs, both data fetching and rendering occur on the server, so Suspense manages the waiting period server-side, too, shortening the total roundtrip to speed up rendering the fallback and completed page.

![](/images/writing/react-server-comonents-02-8d4219fb96.webp)

Server Actions are gateway functions that you define in an RSC on the server side that you can then pass across the server/client boundary. When a user interacts with your app on the client side, they can directly call Server Actions which will be executed securely on the server side.

This approach provides a seamless [Remote Procedure Call](https://en.wikipedia.org/wiki/Remote_procedure_call) (RPC) experience between the client and the server. Instead of writing a separate API route to communicate with the server, you can directly call Server Actions from your Client Components.

By striking the right balance, you can create a high-performance, efficient, and engaging application. Leverage RSCs for server-side rendering and data fetching, while relying on Client Components for locally interactive features and user experiences.

Personally, I’m all-in on React Server Components, architecturally they are a huge improvement for React and open up a world of new possibilities.
