---
title: >-
  "React Server Components: The Game-Changer Critics Are Too Confused to
  Applaud!"
date: '2024-02-06'
updated: '2024-02-08'
type: post
summary: >-
  React developers all over social media seem to be losing their minds over
  React Server Components (RSC) in Next.js and extolling the virtues of HTMX
  instead. I’m no Next.js fanboy, given a choice I’d use Remix, but…
topics:
  - react
  - typescript
  - next.js
featured: false
draft: false
slug: react-server-components-game-changer-confused-applaud
legacyId: '37'
---
React developers all over social media seem to be losing their minds over [React Server Components (RSC) in Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components) and extolling the virtues of [HTMX](https://htmx.org) instead. I’m no Next.js fanboy, given a choice I’d use Remix, but gotta say I’m pretty excited by the direction Next.js is taking lately. Regardless of the framework it seems we’ve *finally* remembered that the web is a response/request platform and that we should lean on the capabilities of browsers!

## Why the RSC confusion?

Putting aside HTMX for the moment, RSC in Next.js seems to be a really simple concept. Components are server rendered by default, if your component needs client side JavaScript interactivity, add a `use client` directive to the file. My spicy-take on why some people are hitting issues is because they failed to take the time to understand how to architect React applications properly in the first place and got sucked into the world of Single Page Applications (SAP) with global state.

As an industry there has been a misguided belief that we needed to move application business logic away from the server and into the client to create richer more interactive applications. This led to the SPA pattern & moving responsibility for business logic away from the server to the client leading to a need for client-side state management, usually in the form of a library such as Redux.

Problem is you didn’t really move business logic away from the server and server state was still the real source of truth, but now you had to keep client-side state in-sync with server-side state. The lazy way to achieve this was to slap Redux at the top of the React component tree and allow every component deep down the tree to access and update state. This is probably one of the most common architectural patterns for React apps, so why is it such a problem?

As frameworks have re-discovered the original web patterns and moved towards rendering server side first these client-side approaches are becoming unnecessary at best and incompatible at worst. If you’ve lazily added Redux at the top level of your application, you probably didn’t think much about [component composition](https://www.youtube.com/watch?v=3XaXKiXtNjw) in your React app, which means your components are probably not pure components with simple rendering logic based on the props provided.

What you’ve more likely got is components that are littered with code that needs JavaScript to call out to a global state library like Redux in order to render UI. If you upgrade to Next.js 14 and start rendering with RSC you’ll most likely hit this error:

![](/images/writing/react-server-components-game-changer-confused-applaud-01-388551cbc7.png)

No problem, just do as it says but then you’ve probably got a lot of components you need to add `use client` to at which point you’re thinking what is the point of server rendering? Eventually after adding all the `use client` directives you most likely hit this error:

![](/images/writing/react-server-components-game-changer-confused-applaud-02-12b81e1f82.png)

Now I’ll admit this is confusing, and at this point you’d probably think RSC are a dumb idea. So if SPA with Redux is all you know then you’re probably going to have a hard time with RSC. The brutal truth is RSC benefits from a different architecture for your front-end.

I’ve always adopted a [Component Driven Development](https://www.componentdriven.org) (CDD) approach and an avoidance of Redux in preference of URL State where possible. So for me RSC vibes really well with my beliefs and approach to architecting React applications. My route level pages handle data fetching and mutations, they are server rendered. The rest of my page is broken down into well composed pure components that accept props. They are easily server rendered by default too but if a component really does require client-side interactivity, it is just a 1 second 1 line change to add `use client` at the top of that component.

My view of RSC is they are rectifying past mistakes and encouraging you to put your logic where it should be. Business critical logic or core application state belongs on the server but if you want to enrich that state but without changing the underlying core state, then `use client`.

## Why I don’t believe HTMX is the solution

What about HTMX then? I hear people hitting issues with RSC cry “just use HTMX” and “throw away your JavaScript”. I agree with the philosophy of throwing away large chunks of our overly complex and pointless client-side JavaScript but you don’t need use HTMX to do it. It is perfectly legitimate to ship JavaScript along with your HTML and CSS to the browser, if you want client-side interactivity you actually need it. So why hide it away behind inline declarative directives?

DX wise if you need advanced client-side interactivity then you probably need a front-end engineer. HTMX is going to make it pretty hard for them to function as the interactivity is largely coming from the server in the form of updated HTML, I don’t see how that is an effective flow unless you are a backend developer.

React is also more than just the web, it is native mobile, TV, watches, vision, cars etc. We moved away from rendering HTML to JSON and GraphQL because we needed to support more output mediums from a single back-end. Yes we *could* enhance our server side code to also detect and respond in HTML for HTMX but where is the cost/benefit of doing so?

I’ll admit HTMX raises some interesting problems with the way we’ve done things in the recent past. We gave far too much responsibility to the client and we need to re-balance that by put business logic back on the server where it belongs and removing where possible client-side state management. I see HTMX & RSC as solving the same problem but in different ways.

It seems to me adopting HTMX requires re-writing your front-end & back-end whilst RSC *potentially* requires re-writing your front-end. Personally I’m adding that one line of `use client` but either way I see a better future for apps regardless of your choice. Throwing away large amounts of pointless client-side state management code can only be a good thing!
