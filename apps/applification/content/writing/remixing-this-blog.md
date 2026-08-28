---
title: Remixing this blog
date: '2022-02-13'
updated: '2022-02-18'
type: post
summary: >-
  How I built this blog using a tech stack for simplicity, flexibility and
  scalability
topics:
  - devops
  - react
  - remix
  - tailwind
featured: false
draft: false
slug: remixing-this-blog
legacyId: '22'
---
I spent the first few weeks of 2022 working on a re-write of [applification.net](http://applification.net). I’d cancelled my account with an old hosting provider not realising it contained this website. Inspired by Kent C Dodds post on how he [built a modern website I 2021](https://kentcdodds.com/blog/how-i-built-a-modern-website-in-2021), I took the opportunity to create a new site using a stack I was keen to get acquainted with.

## Context

When choosing the pieces of my stack I have a few rules I try to follow:

- *Simplicity* - if the stack isn’t simple the codebase quickly becomes impossible to maintain
- *Flexibility* - simplicity should not come at the cost of control over the output. If my requirements change my architecture should be able to support that change

First off let me say, for a simple blog, despite meeting these criteria, this stack is overly complex. I could have met these criteria by creating a static site using Markdown but that didn’t meet my personal goals of digging deeper into technologies I want to use on larger projects.

## Technology Overview

The primary technologies used in this blog are:

- [React](https://reactjs.org): for the UI
- [Remix.run](http://Remix.run): Framework for the Client/Server/Routing
- [TypeScript](https://www.typescriptlang.org): Typed JavaScript
- [Prisma](https://www.prisma.io): ORM with migrations and TypeScript client support
- [Tailwind CSS](https://tailwindcss.com): Utility classes for consistent/maintainable styling
- [Postgres](https://www.postgresql.org): Battle tested SQL database

The services this site uses:

- [Fly.io](http://Fly.io): Edge hosting platform
- [GitHub Actions](https://github.com/features/actions): Hosted CI pipeline services
- [Cloudinary](https://cloudinary.com): Image hosting and transformation services
- [Metronome](https://metronome.sh): Remix metrics service

## Remix

If I had to pick one part of the stack that excites me most it would be [Remix.run](http://Remix.run).

As much as I love React, it has without doubt led to overly complex codebases that are a drag on architectural agility. In particular, I’ve versed my hate of Redux but it doesn’t stop there. To build a React app you end up using third party libraries for state management, form management, routing, CSS and more.

Remix leverages the browser and the platform itself, mixing the old with the new and when you do that, you find you just don’t need these libraries and complexity anymore.

### State Management in Remix

The industry standard response is to reach for Redux, which in practice usually means making all the state global and giving yourself numerous problems you have to write lots of code accounting for. Suffice to say, it’s dumb, don’t do it.

Lee Robinson broke down all the different types of state in a React up in his excellent article the [Past, Present and Future of React State Management](https://leerob.io/blog/react-state-management). They are:

- *Server Cache State* - state from the server, which we cache on the client-side for quick access (e.g call an API, store the result, use it in multiple places)
- *URL State* - state managed by the browser (e.g filter products, saving to query parameters)
- *Form State* - the many different states of a form (e.g. loading, submitting, disabled, validation, retrying)
- *UI State* - state used for controlling interactive parts of our application (e.g. dark mode toggle, modals)

Remix implements an opinionated solution that handles server, URL and form state by leveraging the web platform and capabilities of the browser. The end result is you just don’t need a state management library at all and the only state management code you really end up writing is for UI State, at the component level.

That is a lot of code you no longer need to write, not to mention that bugs are usually found in your state management code.

### Form Management in Remix

There are excellent form libraries for React such as [React Hook Form](https://react-hook-form.com) but you know what, you just don’t need them. The browser can handle forms just fine and Remix lets you do just that. No need to think about controlled or uncontrolled components or managing the state of the form and its validations. Just use an HTML form.

### Routing in Remix

To build a web app experience we need a client-side routing library. The people behind Remix are the same people who created React Router, which is used under the hood.

### CSS in Remix

The trend lately has been to move away from CSS to CSS in JS, in part to avoid CSS conflicts. Remix bypasses that problem and paves the way for using plain CSS once again. Remix pairs beautifully with Tailwind CSS, you have one generated CSS file, which is cached and works just great.

### Remix Server

Remix isn’t a front-end framework, it’s a full-stack framework that provides full control over the front-end and back-end. This means a server element is required and some knowledge of how front-end and back-end traditionally communicate. It’s old-school and it’s beautiful.

### Rules

- Simplicity ✅
- Flexibility ✅

## Tailwind CSS & Tailwind UI

[Tailwind](https://tailwindcss.com) is a utility-first CSS framework that enables you to rapidly build modern websites without ever leaving the HTML. It’s a perfect partner for Remix and to be honest it is liberating. I’ve never had so much fun creating a website. Whilst I had a rough visual in Figma I very much adopted a design in the browser approach that was natural and fluid, iterating on the vision in code.

I leveraged the excellent [TailwindUI](http://tailwindui.com) to fast-track my design but honestly, if you’ve got the vision you can quickly implement any design.

### Rules

- Simplicity ✅
- Flexibility ✅

## Prisma

Remix allows you to write front-end and back-end code in the same file. The `loader` and `action` functions of Remix are the server-side code where you can read and write to a database.

Whilst you could hit a REST API or GraphQL endpoint, there is no need to. When your code is co-located it’s simple to talk directly to the database without the need to create an interface that sits in-between. Prisma is a next-generation Typescript ORM that allows you to do just that.

Prisma is such a joy to work with, it enabled me to build faster and make fewer errors with such a small amount of code.

### PostgreSQL

Prisma supports multiple types of databases. I considered MongoDB and MySQL (via Planetscale) but in the end, I decided to go with [Fly.io](http://Fly.io) for hosting which provides the ability to host clustered PostgreSQL databases. Prisma honestly made it a breeze to talk to the PostgreSQL database. Whether it is finding multiple results, a single result by id, searching for a specific result, filtering data, storing JSON objects and even filtering those it was all a breeze.

### Rules

- Simplicity ✅
- Flexibility ✅

## TypeScript

The whole project is in TypeScript. Remix supports TypeScript out of the box but Prisma is also TypeScript. The Prisma Client auto-generates types based on your `prisma.schema` file. This means you have full typed support for interacting with your database when using Prisma. It means there is a very strong contract between the front-end and back-end and the scope for errors is vastly reduced.

## TurboRepo

Whilst technically this project didn’t need to make use of a mono repo, I wanted to check out [TurboRepo](https://turborepo.org).

The main reason is that I’m a fan of [Storybook](https://storybook.js.org) and component-driven development, which usually means creating a UI library that is published either internally or on NPM.

TurboRepo provided the opportunity to have a UI library that my Remix app looked to for it’s components all in the same codebase.

Truthfully I had a *lot* of problems getting TurboRepo to work with Remix and Vercel (where I intended to host). In the end ditching Vercel for Fly meant I had full control and everything just worked as I’d hoped. Now I can create pure components without the need to publish a separate component library, which is fantastic.

- Simplicity ✅
- Flexibility ✅

## Fly

The premise behind Fly is to deploy your app servers close to your users. By this, they mean your full-stack, including your databases can be deployed all over the world.

Fly has good support for Remix and a great CLI tool which makes interacting with Fly a breeze. There is a certain amount of [Docker](https://www.docker.com) skills required but once configured it is so nice and easy to use.

There is also nice integration with Prisma, in particular you can configure Fly to run your Prisma migrations during a deployment.

### GitHub Actions

Deployment to Fly is done using GitHub Actions with the Fly integration. Any time there is a push to the main branch a docker image is created and pushed to fly which deploys the app.

- Simplicity ✅
- Flexibility ✅

---

So there we have it. The stack behind this blog. It is still a work in progress, I’ve not abstracted the UI components out to the desired level yet, tests with Cypress need adding and much much more but I now have a “digital playground” where I can play around with techniques I want to learn in a live environment.

The code for this blog is open-source and available at [https://github.com/DaveHudson/turbo-prisma-remix](https://github.com/DaveHudson/turbo-prisma-remix).

##
