---
title: Personal software is becoming worth a day
date: 2026-09-09
updated: 2026-09-09
type: post
summary: "I built Movie Night in a day through chat: half in Codex, half in Codex on iOS. Six months after a technically similar idea stalled, I could describe what I wanted and get a personal app that worked for me."
topics: [ai, mcp, developer-tools]
featured: false
draft: false
slug: personal-software-is-becoming-worth-a-day
---

Six months ago, I tried building something technically similar to Movie Night and hit roadblock after roadblock. The idea was there, but getting it into a useful app was enough work that it stopped being practical for me.

This time, I built it in a day.

The whole build happened through chat. About 50% was chat in Codex and 50% was chat in Codex on iOS. With GPT-6, I described what I wanted, it understood my intent and carried out the instructions with an accuracy that surprised me. I asked for changes, looked at the deployed result and kept going.

That changes which ideas I am willing to start. A family film app only needs to be useful to my family. When making it takes a day and is largely hands-off, with the agent working in the background, that can be reason enough.

## An app for our movie nights

Movie Night deals with a familiar negotiation. Someone suggests a film. Someone else has seen it. It is too long for tonight, or nobody knows where to stream it. There are plenty of recommendations; getting to a shared decision is the awkward part.

The app can research films, keep a shared watchlist, collect votes and ratings, and schedule a night with attendees. It has AI chat for exploring ideas, film cards for browsing and controls for making a choice. A private calendar subscription carries planned nights into Apple Calendar.

It is deliberately a family app, with restricted access. I do not need a market for it to have a use.

![Movie Night's live watchlist, showing posters, runtime filters and family interest.](/images/writing/movie-night/watchlist.png)

*The live family watchlist. Film data and images come from TMDB.*

## Chat was how I built it

```rich-block
{
  "name": "tweet",
  "props": {
    "id": "2097408592290971956",
    "author": "Guillermo Rauch",
    "quote": "Chat has won. It's all chat + computer from this point on"
  }
}
```

Guillermo Rauch's post captures how building Movie Night felt to me.

I was cooking the tea, spaghetti bolognese, and waiting for the pasta to cook. On Codex on iOS, I requested UI tweaks. Codex made the changes, Cloudflare automatically deployed them, and I reviewed the result on my phone. Then I asked for the next change.

That was the development loop. I could judge the running app and refine it through another request, while getting on with something else. I still decided what I wanted, but I did not need to sit at a desk and carry out each step myself.

Even setting up the address worked that way. I asked for the [movies.applification.net](https://movies.applification.net/) subdomain, and AI created and configured it in Cloudflare for the Worker.

## What a day of building produced

There is a proper application behind the film cards. [Cloudflare Workers](https://developers.cloudflare.com/workers/) hosts the backend and MCP server. [Hono](https://hono.dev/docs) routes the web API and authentication requests. [D1](https://developers.cloudflare.com/d1/) stores the watchlist, votes, ratings, planned nights and saved conversations. [KV](https://developers.cloudflare.com/kv/) holds OAuth and website session state, while [Workers Assets](https://developers.cloudflare.com/workers/static-assets/) serves the built website.

[TMDB](https://developer.themoviedb.org/docs/getting-started) supplies film metadata, posters and UK watch-provider information. [Resend](https://resend.com/docs/introduction) delivers passwordless magic-link emails to allowed family members. Cloudflare's [Workers OAuth provider](https://github.com/cloudflare/workers-oauth-provider) supplies the OAuth layer protecting the MCP server. The website reuses that provider through a PKCE login flow, and its access tokens stay on the server behind an HTTP-only session cookie.

The chat uses [AI SDK](https://ai-sdk.dev/docs/introduction) for streamed responses and tool calls, with [Vercel AI Gateway](https://vercel.com/ai-gateway) providing model access. [AI Elements](https://elements.ai-sdk.dev/docs) supplies the conversation, message and prompt-input components.

Those pieces matter because a useful personal app needs more than a convincing first screen. It needs to remember choices, recognise who is using it and let people return to what they were doing.

## MCP gives the interfaces the same operations

The film operations are exposed as [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) tools: search, add to the watchlist, vote, shortlist and schedule. Data tools return readable text alongside structured content, so a client can explain a result or render it as film cards.

The standalone website calls the same MCP tools through its authenticated API, preserving the signed-in member's identity.

The same [React](https://react.dev/) `MovieNight` component renders in the website and the embedded MCP app. Each supplies a different connection to the backend, while sharing the film interface.

The model can select films and open them in the shared interface. The application renders the cards, so the same films have the same controls wherever they appear. A text fallback remains available for clients without the interactive view.

## A personal app inside a conversation

The MCP server works in ChatGPT and Claude. Movie Night also supports MCP UI, and I used it inside the ChatGPT app. Asking what was on my watchlist brought back the film interface within the conversation, complete with posters, filters and the Discover, Watchlist and Tonight views.

![Movie Night rendering inside the ChatGPT app after the prompt “what is on my watchlist?”, showing navigation, filters and film posters.](/images/writing/movie-night/chatgpt-mcp-ui.png)

*Movie Night's MCP UI inside the ChatGPT app. This is a real capture, showing the prompt and the embedded watchlist. Film data and images from TMDB.*

AI built this MCP UI in minutes as part of the day's work. That is a striking extension of the personal-software idea: I could describe an interface and have it available inside a conversation, backed by the same family data as the website.

For this build, I wanted a dedicated place the family could return to for browsing, voting and planning. The standalone website provides that while keeping the tools and embedded interface available through compatible hosts. Next, I want to explore [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) further to improve compatibility of the rich MCP UI across clients.

## Conversation leads to controls

I built the whole app through chat, but using it does not need to be all chat. A conversation helps with open-ended requests, such as finding films similar to something we enjoyed. Once we have candidates, film cards and buttons make browsing, voting and planning easier.

The website chat can look up films and add them to the watchlist. Voting, rating and scheduling use explicit controls that call the same MCP tools without asking the model to interpret another message.

![Movie Night's film details, with a trailer link, planning button, voting controls and ratings.](/images/writing/movie-night/film-details.png)

That is part of what made the build useful to me. I could ask for the interface that suited each task, from a conversation about what to watch to a button for planning the night.

## Does the code need to be beautiful?

I would not take a one-day build as a guarantee of beautiful code. But for a personal app that I can ask an agent to change in seconds, how much should that matter?

I care whether it works for us and whether I can keep changing it. Some repetition or an awkward component is an acceptable tradeoff. I do not need to polish every implementation detail before the app earns its place in our evening.

Authentication, private conversations and preserving our watchlist still matter. An agent makes a change easier to request; it does not guarantee that the change is correct. Maintainability matters when rough code makes the next change harder to get right. Until then, I am comfortable leaving some rough edges.

## Small enough to build for ourselves

Movie Night does not have public onboarding, separate household accounts or offline operation. Its scope is one family's films and plans.

That scope is what makes the one-day build meaningful. An idea I would once have put aside now fits around an ordinary day, including cooking the tea. It only has to do enough to be useful to us, and I can keep asking for changes as we use it.

There are plenty of small ideas that will never justify becoming a commercial product. I am much more interested in building them now.

