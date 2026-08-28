---
title: How to build a Progressive Web App with React
date: '2018-03-06'
updated: '2022-02-13'
type: post
summary: PWA
topics:
  - pwa
  - react
featured: false
draft: false
slug: how-to-build-a-pwa
legacyId: '9'
---
There is currently a lot of excitement about Progressive Web Apps (PWA) as browser vendors (including Safari) are adding [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/) and other progressive enhancement APIs. What exactly make web app progressive though?

Google defines PWA as experiences that combine the best of the web and the best of apps. They should be:

- **Fast** — respond quickly to user interaction
- **Integrated** — user doesn’t have to go via browser
- **Reliable** — load instantly, even if offline / bad network
- **Engaging** — keep user coming back with great UX

This is all excellent but vague. Google does also offers a handy [Progressive Web App checklist](https://developers.google.com/web/progressive-web-apps/checklist), yet even so there is no definitive answer as to what a PWA is and what makes a great one.

---

#### **The Baseline PWA**

At the most basic level a PWA is defined by the technical properties that allow the browser to *detect* that the site meets certain criteria and is worthy of being added to the home screen. If the criteria are met then an “Add to Home Screen” banner prompt can be shown.

![](/images/writing/how-to-build-a-pwa-01-93ea1653ce.png)

Example Add To Home Screen Banner

The **three golden rules **in order for the “App Install” banner to show are:

1. **App must originate from a Secure Origin **  
  So it must be served over SSL / HTTPS.
2. **App must load when offline **  
  It should function offline (even if only a custom offline page or basic caching). This means a Service Worker to be installed.
3. **App must reference a Web App Manifest**  
  A simple JSON file describing your app.

It’s a relatively trivial task to add this functionality to your existing web app and technically you have a PWA. Unfortunately this doesn’t necessarily meet the initial definition of **fast**, **integrated**, **reliable** and **engaging**. If you run your app through the Google checklist or the [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) audit tool you’ll likely find a huge list of issues.

If you have a server rendered website it is at this point you’ll sharp realise that you’ll have problems fixing the list of issues Lighthouse is reporting to you. In a server rendered web app when a user taps a button or link there is a wait starting at the current screen before suddenly jumping to a whole new screen of content. This is unacceptable for a PWA since it betrays the idea that the app itself is running locally on the device.

If you really want to turn your web app into a PWA you need to shift the balance of power from server rendered web app to a client rendered web app. In short a new app architecture is required.

---

#### **App Shell**

The [App Shell pattern](https://developers.google.com/web/fundamentals/architecture/app-shell) replicates the architecture of a native app, effectively providing a bundle of code similar to what you would download from the App Store in a native app.

The key difference is that this bundle needs to be downloaded by a Service Worker the first time a user visits the app rather than indirectly from an app store. This means your PWA has to be fast. In fact really fast, as you don’t want your users watching a blank screen for 5–10 seconds whilst your PWA downloads the kitchen sink just to show the first screen.

An App Shell should contain a skeleton UI and core components required for the app to function. It is generally responsible for routing but it should ***not*** contain any data.

![](/images/writing/how-to-build-a-pwa-02-a4a34a134b.png)

App Shell Pattern

---

#### Loading States

Once you have an App Shell where the data is separate from the presentation and the client is responsible for rendering the UI, the concept of loading states becomes a natural design pattern.

When a URL is requested the client can initially render a loading state which loads instantly as it is part of the App Shell. At the same time the client makes a fetch request for the data, once received the client creates the completed screen and replaces the loading state.

![](/images/writing/how-to-build-a-pwa-03-e94b69096c.png)

Loading States

The end result is a much better experience for the user than pressing a link, staying on a page for 3–4 seconds, seeing a flash of white and a page slowly rendering as it would in a server rendered web app.

---

#### Code Splitting

The App Shell pattern goes hand in hand with [code splitting](https://webpack.js.org/guides/code-splitting/). In a standard React App your code is bundled into a single JavaScript file. In a PWA we need to load the first screen as quickly as possible, so we need a smaller bundle, we also need to cache each route separately. In short we need to code split our JavaScript. [Webpack](https://webpack.js.org/) can help with this or you could use something like [Preact](https://preactjs.com/) which offers automatic code splitting.

App Shell code split and separated from content you can start to take full advantage of the benefits service workers. Features that were previously impractical can be offered with ease, for example:

- Offline Support
- Pre-cache App UI
- Dynamically cache network data / assets

---

#### Service Workers with Workbox

To implement these features you need to dig deeper into Service Workers. It’s entirely possible to write service workers by hand, however, Google have done a lot of the heavy lifting for you with [Workbox](https://developers.google.com/web/tools/workbox/guides/get-started).

The happy medium is to use the [InjectManifest plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration) with WebPack. This will allow you to combine your own service worker code with Workbox. At a minimum you should implement:

- [Pre-caching](https://developers.google.com/web/tools/workbox/modules/workbox-precaching) of your App Shell
- [Runtime caching](https://developers.google.com/web/tools/workbox/modules/workbox-routing) of requested data and assets

There is plenty more Service Workers can do though including:

- [Background Sync](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync)
- [Push Notifications](https://developers.google.com/web/fundamentals/push-notifications/)
- [Offline Analytics](https://developers.google.com/web/tools/workbox/modules/workbox-google-analytics)

Service Workers with Workbox is a large topic of it’s own. If you want to know more I’ve written a separate article on [Workbox with Preact](https://medium.com/@applification/service-worker-magic-with-workbox-preact-c9ef35e063ec).

---

#### **PRPL Pattern**

Your app should now be quick to load. It has an App Shell, code splitting and it’s all cached by a service worker. In effect we have implemented the **[PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/)** pattern recommended by Google for PWA. PRPL has an emphasis on the performance of app delivery and launch. It stands for:

- ***Push*** critical resources for the initial route
- ***Render*** initial route
- ***Pre-cache*** remaining routes
- ***Lazy-load*** and create remaining routes on demand

Whilst this will work in HTTP/1 it’s likely you’ll want to investigate an HTTP/2 capable web host. HTTP/2 allows *multiplexed* downloads over a single connection, so that multiple small files can be downloaded more efficiently.

---

#### Server Side Rendering vs Pre-Rendering & CDN

You can server side render an initial route complete with data and let the client take over rendering thereafter. This may provide an initial speed boost, however, it can be complex to configure. In general I’m not a fan due to the complexity it adds to a codebase.

A better solution in my opinion is to pre-render a static website and host it on an HTTP/2 capable Content Delivery Network (CDN) [providing incredible speed and codebase simplicity](https://www.netlify.com/blog/2017/06/06/jamstack-vs-isomorphic-server-side-rendering/). As a bonus you’ve just reduced your hosting complexity too as you only need static web hosting!

There are many options for pre-rendering including:

- [Preact](https://preactjs.com/)
- [React Static](https://nozzle-react-static.netlify.com/)
- [Gatsby](https://www.gatsbyjs.org/)

To get the very best speed you can then deploy your static website using a CDN provider such as [Netlify](https://www.netlify.com/).

---

#### Wrap Up

If you run your app through Lighthouse with an architecture like this you should get a much better score. You’ll also notice how quick your app is and that it provides a great user experience.

Progressive Web Apps are a fantastic proposition that are simpler to create & deploy than native apps, yet are capable of offering much of the experience users love and expect of native apps.

There are still a question marks over the support Safari will offer in terms of PWA but they are working on a range of items and Service Workers will be available in iOS 11.3 so it looks promising.

If you want to go the extra mile there are a number of additional APIs that are being implemented (again we need to see what Safari will implement) which can offer even better experiences to your user including:

- [Push Notifications API](https://developers.google.com/web/fundamentals/push-notifications/)
- [Web Payments API](https://developers.google.com/web/fundamentals/payments/)
- [Credentials API](https://developers.google.com/web/fundamentals/security/credential-management/)

As much as I love React Native, and it will still be the best option for the user experience in many cases, I’m personally investing a lot of time and energy into PWA as I believe they have a very bright future!

---

> My name is Dave Hudson, I’m a product building UX pedant who leads development teams & writes code.

> I consult under [Applification Ltd](http://applification.net/) and I’m available for all things React, agile and product development!
