---
title: Progressive Web Apps with Preact
date: '2018-02-15'
updated: '2022-02-13'
type: post
summary: How to create a PWA with Preact
topics:
  - pwa
  - react
featured: false
draft: false
slug: pwa-with-preact
legacyId: '6'
---
When building my first Progressive Web App (PWA) I choose the Preact library as it [met all the criteria of a good PWA](https://medium.com/p/2c8a4d43ce6b/).

Specifically Preact:

- is very small, and that makes a huge difference for the initial app load of a PWA.
- follows the PRPL pattern
- supports code splitting
- supports HTTP2/Push headers
- out of the box Web App Manifest and Service Worker

All in this provides an excellent starting point to build out a PWA adopting the App Shell pattern.

#### Service Worker Upgrade

Personally I like [Workbox](https://developers.google.com/web/tools/workbox/guides/get-started) rather than [SW precache](https://github.com/GoogleChromeLabs/sw-precache) for my Service Worker support.

**[Preact-cli and service worker.](https://medium.com/@prateekbh/preact-cli-and-service-worker-2e0f034157e7)**  
*[Preact-cli is a tool to build progressive web apps in a super quick and easy manner using just a few commands. It comes…](https://medium.com/@prateekbh/preact-cli-and-service-worker-2e0f034157e7)*[medium.com](https://medium.com/@prateekbh/preact-cli-and-service-worker-2e0f034157e7)

#### Template Control

In Preact the build process is like in Create React App, it’s all done a little by magic behind the scenes. This was problematic as I needed a bit more control over the index.html file in order to support Apple and Microsoft devices as far as possible. [Preact-cli Templates to the rescue](https://github.com/developit/preact-cli/#template).

#### preact.config.js

Building a high-quality Progressive Web App can improve business outcomes

**[Understand Security Issues | Tools for Web Developers | Google Developers](https://developers.google.com/web/tools/chrome-devtools/security)**  
*[Use the Security Panel to ensure that all resources on your site are protected with ](https://developers.google.com/web/tools/chrome-devtools/security)**[HTTPS.](http://HTTPS.developers.google.com)*[developers.google.com](http://HTTPS.developers.google.com)

A lot of early PWA use material design but whilst the PWA move may have started with Google / Android it’s a web specification and will be wider. You wouldn’t design a native mobile app on iOS using material design so don’t build a PWA that way either.

**Designing Great UI/UX for PWA**

*Test on real hardware*

Get a crappy device and test initial load speed before a SW may kick in.

*Take UX inspiration from native apps*

---

**Auditing**

Verifying your PWA meets some or most of the criteria can be automated with Lighthouse

- Chrome Developer Tools
- Command Line NPM

**Applications Tab**

Chrome Applications tab shows you info about your PWA.

**[Debug Progressive Web Apps | Tools for Web Developers | Google Developers](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps)**  
*[Use the Application panel to inspect, modify, and debug web app manifests, service workers, and service worker ](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps)**[caches.](http://caches.developers.google.com)*[developers.google.com](http://caches.developers.google.com)

---

**Performance Testing**

Device devs use much faster than real world

Chrome://inspect

Two decisions:

- *Separate out UI & Data*  
  Recommend GraphQL Server
- *Choose your front-end UI technology*  
  React, Vue, Angular or other
