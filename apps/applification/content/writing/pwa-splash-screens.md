---
title: "Progressive Web App Splash\_Screens"
date: '2018-02-21'
updated: '2022-02-13'
type: post
summary: How to create splash screens for your PWA
topics:
  - pwa
  - design
featured: false
draft: false
slug: pwa-splash-screens
legacyId: '11'
---
[Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) (PWA) are starting to pick up a lot of momentum and for good reason. When developing my first PWA supporting cross platform splash screens proved to be a bigger than expected challenge! This is a quick post to help others quickly create PWA splash screens that work across both Android and iOS. The end result should be something like this:

![](/images/writing/pwa-splash-screens-01-748b3e953a.png)

Android and iPhone PWA Splash Screens using Google Lighthouse Logo

---

#### Splash Screen Problem

Assuming a user installed your PWA on their home screen, the default behaviour is to show a white screen until the PWA is ready. This doesn’t feel very nice for the user and adding a custom splash screen makes your PWA feel more like a native app.

Chrome for Android automatically shows your custom splash screen so long as you [meet the following requirements](https://developers.google.com/web/tools/lighthouse/audits/custom-splash-screen) in your web app manifest:

- The `name` property is set to the name of your PWA.
- The `background_color` property is set to a valid CSS color value.
- The `icons` array specifies an icon that is at least 512px by 512px.
- The icon exists and is a PNG.

On Android this works ok, however, iOS does not support a similar method of automatically showing a splash screen. Instead you need to provide splash screens tailored for each iOS device using the `<link rel="apple-touch-startup-image" />` HTML meta tag.

Targeting each iOS device to use a custom `apple-touch-startup-image` turns out to be quite a challenge, the approach I went with is to use media queries. Following the [excellent work of Chris Coyer](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/) I ended up with the following media query and `apple-touch-startup-image` combination:

apple-touch-startup-image using media queries

---

#### Creating the Splash Screens

So we now have media queries to identify each size of iOS device but you still need to create all the images right… Sketch to the rescue! I created a simple Sketch file with each of the image dimensions all ready to be exported and dropped into your project.

![](/images/writing/pwa-splash-screens-02-f6221add9f.png)

Sketch iOS PWA splash screen generation

#### Broken iOS Versions

So you’ve got all those nice iOS images but there’s one issue you need to be aware of. Safari support on iOS for the `apple-touch-startup-image` meta tag, whilst something supported from very early on in iOS actually s[eems to be broken in some more recent versions of iOS](https://stackoverflow.com/questions/36430982/ios-webapp-not-showing-startup-image). My testing on iOS Simulator has established that splash screens do not work on iOS 8, 9 & 10 but are once again working in iOS 11.

Whilst this isn’t ideal, a true PWA requires Safari to support the [App Manifest and Service Workers, which are only in beta of iOS 11.3](https://twitter.com/rmondello/status/956256845311590400) at the time of writing this post. So I’m actually ok with the situation as a PWA splash screen on iOS will only really be of value to users of iOS 11.3+.

---

#### The Code

- Online demo: [https://pwa-splash.now.sh](https://pwa-splash.now.sh)
- Github repo: [https://github.com/applification/pwa-splash-screens](https://github.com/applification/pwa-splash-screens)

The repo is a basic PWA as such it needs to run on HTTPS and have app icons which have been generated using the excellent [Favicon Generator](https://realfavicongenerator.net/).

---

> My name is Dave Hudson, I’m a product building UX pedant who leads development teams & writes code.

> I consult under [Applification Ltd](http://applification.net/) and I’m available for all things React, agile and product development!
