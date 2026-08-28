---
title: Designing Progressive Web Apps
date: '2018-02-19'
updated: '2022-02-13'
type: post
summary: Quick tips to follow when designing a PWA
topics:
  - pwa
featured: false
draft: false
slug: designing-pwa
legacyId: '5'
---
When I was first learning about Progressive Web Apps (PWA) I had one big question. Was I creating a website or a native app? As I learnt more about [what a good PWA is](https://medium.com/p/2c8a4d43ce6b) the answer became obvious, forget websites you are designing an app.

Top notch PWA must have high quality UI/UX and experience that feels highly interactive. What follows is a list of design considerations when designing your PWA.

#### **Avoid Web-like Design**

Classic web design depends heavily on links in text and static elements available on every page such as a header and footer. These are rarely found in native apps, so don’t use them.

However, don’t go too native! There are UI frameworks such as Onsen UI, Framework 7 and more that will drive your UI towards a native app UI. Take it from someone who has developed web apps and native apps, this will lead to pain for your developer and performance is not going to be near that of a native app experience.

#### **Set Good Hit Areas**

When a button or tappable area is tapped, the user shouldn’t be left wondering if the tap was recognised. Highlight states and quick non-blocking UI update action.

#### **No Page Jumps**

Content should not jump as the page loads. So all images should have height dimensions, a good pattern is to show a placeholder image until the real one is loaded

#### **Back and Scroll**

When a user selects an item from a list and is viewing it’s details, tapping back should bring back to the list page with the same scroll position they were at before they pressed on the item.

#### **Non-content selectable**

Buttons and non-content should not be selectable. You know the drill, some content gets selected when you don’t want it to be and the UI gets all messed up.

> user-select: none;

#### **Inputs & Keyboard**

Ensure the keyboard does not obscure the text input.

#### **Share Content**

PWA’s often mean URL not easily accessible, make it easy to share the content and get the URL.

#### **Use System Fonts**

Users will feel more at home in your PWA if you tweak the style to match their operating system. Different UI patterns and fonts make all the difference.

- **iOS**  
  *font-family: ‘Helvetica Neue’, Helvetica, Arial, sans-serif;*
- **Android**  
  *font-family: ‘RobotoRegular’, ‘Droid Sans’, sans-serif;*
- **Windows Phone**  
  *font-family: ‘Segoe UI’, Segoe, Tahoma, Geneva, sans-serif;*

#### **Touch Interactions**

Do them well or not at all. Use libraries such as react-swipable-views

#### **Avoid the hamburger**

The hamburger menu adds an additional challenge or implementing their swipe interactions on the web. I would recommend against using and go with simple tabs. Google is stripping out the hamburger and if you can’t fit the content into tabs, maybe you’ve missed the point of a PWA. If you want all the content they you have the full website don’t you!

#### **Mobile friendly design**

Correct viewport, good tap targets. It’s important PWA work across form factors and screen sizes. Responsive design that merges into an excellent mobile app UI.

#### **Near instant loading**

PWA should be interactive (loaded and free of long-running scripts) in less than 5 seconds before a service worker is installed (i.e first run)

#### **Work across devices & browsers**

Progressive enhancement is ideal, separate domains is something to avoid if possible.

#### **Fluid Animations**

Visual transitions should not stutter or jank

#### *Communicate Offline state appropriately*

Users should be able to understand the actions they can take while offline. No stranded in app from links that won’t work

#### *Push Notifications & Background Sync*

If relevant, make appropriate use not ott

#### *Contextual Permission Requests*

Onboard or in flow rather than every permission immediately
