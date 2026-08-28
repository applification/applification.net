---
title: Thoughts on Remix
date: '2022-02-17'
updated: '2022-02-18'
type: post
summary: >-
  Every now and then a framework comes along that makes you change the way you
  visualise things. Remix is one of those things!
topics:
  - react
  - remix
  - typescript
featured: false
draft: false
slug: remix
legacyId: '30'
---
There is a quote by David Bowie that drives my approach to consulting (and life in general):

> Tomorrow belongs to those who can hear it coming

When it comes to development, I am always listening for what the trends are and what is coming next. I can tell you the team behind [Remix](https://remix.run) really can hear tomorrow and they see what’s coming.

![](/images/writing/remix-01-a4becbc5ee.jpg)

## It’s just a case of history repeating

The web started off as static HTML / CSS. As requirements got more complex we moved to dynamic websites via Server Side generation with PHP etc and all was good with the world.

Then demand for interactivity on websites grew, we used more JavaScript and there was a drive to client-side Single Page Applications (SPA). Front-end had suddenly become a lot more complex which led to a boom in static site generators such as [Gatsby](https://www.gatsbyjs.com) and [Next.js](https://nextjs.org), not to mention a proliferation of libraries to help manage [routing](https://v5.reactrouter.com/web/guides/quick-start), [state,](https://redux.js.org) [forms](https://react-hook-form.com) and more in React SPA’s.

If we pause there and take a step back to look at the big picture, we find ourselves at a painful point in time. Front-end code needs to have agility as requirements change so often, yet we’ve burdened ourselves with incredibly complex code that is hard to understand, test and maintain. We’ve also reached the limitations of what static site generators are capable of in regards to dynamic content and build times for larger applications.

Shifting responsibility back to the server-side and going full loop is the logical next step. [Remix](https://remix.run) completes this loop in a very elegant way. Server-side rendering is essentially already a solved problem. By mixing web fundamentals with modern UX and client interactions in TypeScript, Remix becomes a very powerful framework.

> It’s React for boomers!

This is something Ryan Florence mentioned and it’s funny because it’s true. Remix is very well suited to those who are old enough to remember a web before React and SPA. There are so many good things the web platform offers and we seemed to have lost sight of that. Remix helps us remember what was good about the web and returns us to a world where the lines between front-end and back-end are blurred. Where client and server-side code live in the same file much as they did in PHP. Honestly, this feels like a **good** thing!

## Productive Fun 

As an early paid supporter of Remix, I could sense there was something good there but it wasn’t until recently that I got to play with Remix properly.

> My first thoughts are wow! I have never been so productive or had so much fun building web apps! It really is that good.

## Remix Benefits

It is hard to define what Remix is and all the benefits it brings because it takes such a big picture view.

- It is a full-stack framework that both front-end and back-end developers will want to use.
- It uses web fundamentals and progressive enhancement yet enables you to do this in React with TypeScript.
- It is opinionated yet also gives you full control and gets out the way.

### Server Rendering

In contradiction to Gatsby and Next.js, Remix is firmly a server rendering framework. You could statically generate parts of your application but the default stance is everything is server-rendered, cached and deployed to CDN. It turns out that when you do this it simplifies your codebase.

No longer do you have to wait for the page to load, then make your API call to get data, then decided if it conflicts with the state you already have in the application and resolve it. You simply load the page and render the UI to display the data.

### Browser Caching

Leveraging the web browser we don’t need to worry about writing or installing a caching library, the browser has one built-in and knows just what to listen for from the server.

### Nested Routes

Hard to explain but honestly, amazing. Components become pretty much always coupled to URL segments which means they’re also the semantic boundary of data loading and code splitting. Nested routes are the secret sauce to eliminating nearly every loading state in a Remix app. No more annoying loading spinners but more importantly no request waterfalls or cumulative layout shift. Pages can even be prefetched before the user clicks a link.

### Progressive Enhancement

A JavaScript framework that *can* work without JavaScript tells you all you need to know about the progressive enhancement capabilities of Remix.

## Deploying

Given there is a strong server-side element to Remix, the agnostic approach to backend language and deployment is refreshing. I think NextJS is an excellent React framework but there is no doubt it works best when deployed to Vercel. Remix works great wherever you deploy it.

Personally, I’ve gone with [Fly.io](http://Fly.io) for hosting as it gives me full control over the stack and offers PostgreSQL database hosting but Cloudflare Workers and Deno both appeal, whilst Vercel works just fine too.

## Final Thoughts

Whilst removing a lot of complexity on the front-end Remix does push some of that to the back-end. For full-stack or back-end developers, this is simple stuff, honestly, but for a front-end developer who has only experienced the React SPA world, it may be a bit daunting at first. For React boomers though it’s 🔥

No longer do I have to think about making huge amounts of API calls on the client and deal with overly complex state management. I just get in a flow and become creative.

In short, it’s bloody brilliant and core to my new favourite stack.

##
