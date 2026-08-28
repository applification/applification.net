---
title: How I set up my React Native Projects
date: '2017-08-12'
updated: '2023-12-14'
type: post
summary: React Native Setup
topics:
  - react-native
featured: false
draft: false
slug: how-i-setup-react-native-projects
legacyId: '14'
---
> TLDR =\> Having set up a number of React Native projects, learnt the quirks and pitfalls, I’ve started to settle on a stack that works for me. These are essentially the steps I take when setting up a new React Native project and the resulting app architecture.

### Code Editor

First up my development environment. I used to use Atom but I’m now a complete convert to Visual Studio Code. It provides a fantastic development environment on Mac and has some incredibly useful plugins that make Javascript and React Native development a lot more fun.

**[Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/)**  
*[Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud…](https://code.visualstudio.com/)*[code.visualstudio.com](https://code.visualstudio.com/)

The one must install extension for me is Prettier for Javascript code formatting which I configure this with ESLint, it saves so much time and improves your code with the latest ES6 syntax.

**[Prettier — JavaScript formatter — Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**  
*[Extension for Visual Studio Code — VS Code plugin for prettier/prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)*[marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

### Create React Native App

I kick-off every React Native project using [Create React Native App](https://github.com/react-community/create-react-native-app). I know a lot of people use [Expo](https://expo.io/) and it is great if you want to do a spike / PoC or are new to native app development but to me Expo feels too restrictive and I prefer the freedom of choosing my own stack and making my own architectural choices.

**[react-community/create-react-native-app](https://github.com/react-community/create-react-native-app)**  
*[create-react-native-app - Create a React Native app on any OS with no build ](https://github.com/react-community/create-react-native-app)**[config.](http://config.github.com)*[github.com](http://config.github.com)

---

### Fastlane

One of the first things I do is ensure my Continuous Deployment pipeline is configured correctly as I’ve found through experience that if you don’t do this upfront, you end up having pain when you least want it and you are up against a deadline.

Fastlane is a fantastic tool for continuous deployment of your native mobile apps for beta testing and app stores production deployment. At the beginning of a project you can also use it automatically create and download your:

- App Certificates
- Push Certificates
- Apple Pay Certificates

**[fastlane - iOS and Android Automation for Continuous Delivery](https://fastlane.tools/)**  
*[fastlane is the tool to release your iOS and Android app 🚀 It handles all tedious tasks, like generating screenshots…](https://fastlane.tools/)*[fastlane.tools](https://fastlane.tools/)

I’ve written a whole article on [Fastlane for React Native](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e) which although a bit dated is still mostly relevant.

**[fastlane for React Native iOS & Android app DevOps](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e)**  
*[TLDR =\> Having lost 2 days down numerous rabbit holes getting a continuous deployment pipeline working for React Native…](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e)*[medium.com](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e)

**Microsoft Mobile Center** is a noteworthy alternative for Continuous Deployment (and a lot more) that I will be trying out in future.

**[Mobile Center | Mobile App Development | Visual Studio](https://www.visualstudio.com/vs/mobile-center/)**  
*[Visual Studio Mobile Center PREVIEW Visual Studio Mobile Center is mission control for your mobile apps Bring your apps…](https://www.visualstudio.com/vs/mobile-center/)*[www.visualstudio.com](https://www.visualstudio.com/vs/mobile-center/)

---

### Analytics

Always a good idea to embed analytics into your app at the start too. I use the excellent React Native Google Analytics Bridge module.

**[idehub/react-native-google-analytics-bridge](https://github.com/idehub/react-native-google-analytics-bridge)**  
*[react-native-google-analytics-bridge - React Native bridge to the Google Analytics libraries on both iOS and ](https://github.com/idehub/react-native-google-analytics-bridge)**[Android.](http://Android.github.com)*[github.com](http://Android.github.com)

---

### Redux

When it comes to state management for mobile apps I choose Redux. In web projects I lean on URL state but in mobile apps a centralised store like Redux makes sense. I know there are many alternatives these days such as [Mobx](https://github.com/mobxjs/mobx) or [Apollo with GraphQL](http://dev.apollodata.com/react/react-native.html) and I’m keen to look into those in future but I find Redux does exactly what I want it to. I appreciate it has some extra boilerplate but I like the structure it provides to an app architecture.

**[Read Me · Redux](http://redux.js.org/)**  
*[If you're coming from Flux, there is a single important difference you need to understand. Redux doesn't have a…](http://redux.js.org/)*[redux.js.org](http://redux.js.org/)

To minimise the negative impact of side effects I also like to use Redux-Saga.

**[redux-saga/redux-saga](https://github.com/redux-saga/redux-saga)**  
*[redux-saga - An alternative side effect model for Redux ](https://github.com/redux-saga/redux-saga)**[apps](http://appsgithub.com)*[github.com](http://appsgithub.com)

---

### Reactotron

Knowing what is going on under the hood with your Redux State is critical to effective development, so it follows I’m a big fan of Reactotron. It allows me to have great insight into my Redux store state, actions, sagas, logs and more without having to have a browser tab open for debugging all the time.

**[infinitered/reactotron](https://github.com/infinitered/reactotron)**  
*[reactotron — A desktop app for inspecting your React JS and React Native projects. macOS, Linux, and ](https://github.com/infinitered/reactotron)**[Windows.](http://Windows.github.com)*[github.com](http://Windows.github.com)

---

### UI

When it comes to native mobile apps you need native UI components that are specific to each platform. Two of the best libraries I’ve found to help in this regard are:

**Native Base**

**[NativeBase | Essential cross-platform UI components for React Native](https://nativebase.io/)**  
*[NativeBase is an open source framework to build React Native apps over a single JavaScript codebase for Android and ](https://nativebase.io/)**[iOS](http://iOSnativebase.io)*[nativebase.io](http://iOSnativebase.io)

**React Native Elements**

**[react-native-training/react-native-elements](https://github.com/react-native-training/react-native-elements)**  
*[react-native-elements - Cross Platform React Native UI ](https://github.com/react-native-training/react-native-elements)**[Toolkit](http://Toolkitgithub.com)*[github.com](http://Toolkitgithub.com)

The final choice depends upon the specific app requirements, I’ve found both incredibly helpful in kickstarting an app and ensuring the UI stays consistent. I am selective about which elements I use though, as some I feel go beyond what I require or don’t provide the native cross platform experience I’m looking for.

I’ve also had a fair amount of pain with Native Base and breaking changes in new releases but hopefully that will settle down in future.

---

### Storybook

I’m a huge fan of [Pure UI](https://github.com/storybooks/storybook/tree/master/app/react-native) and the concept of application UI as a pure function of application state. Putting my Scrum Master hat on it provides the ability to align the design and development process into an almost seamless flow, something I find rarely happens!

So it follows that I’m a huge fan of Storybook and the ability it provides for developing and testing React Native components.

**[storybooks/storybook](https://github.com/storybooks/storybook/tree/master/app/react-native)**  
*[storybook - 📓 Interactive development & testing environment for React and React-Native UI ](https://github.com/storybooks/storybook/tree/master/app/react-native)**[components](http://componentsgithub.com)*[github.com](http://componentsgithub.com)

As I’m using Visual Studio Code I’ve got the excellent React Native Storybook extension installed which means I once again do not have to have a browser tab open and I can switch between my React components from within my code editor.

**[React Native Storybook - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-react-native-storybooks)**  
*[Extension for Visual Studio Code - Show your React Native Storybooks inline in VS ](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-react-native-storybooks)**[Code](http://Codemarketplace.visualstudio.com)*[marketplace.visualstudio.com](http://Codemarketplace.visualstudio.com)

The added bonus of working with the Pure UI + Storybook approach is that as your components are developed bypassing in of various props, your tests end up becoming almost exactly aligned to the Storybook components. So there is a lovely flow into the writing of tests which are completely aligned to the designed components and various states.

---

### Jest & Snapshot Testing

To write my tests I use Jest and Snapshot testing. I like the way Snapshots allow you to write tests very quickly with a standard approach that you can re-use across tests.

To view my snapshot changes when I update my code I use the snapshot-tools extension in Visual Studio Code so I can hover over the toMatchSnapshot() function in my test code and view snapshot results inline. This provides me with a really nice feedback flow from writing failing tests and making them pass.

**[snapshot-tools - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools)**  
*[Extension for Visual Studio Code - Helpful tools for snapshot ](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools)**[testing](http://testingmarketplace.visualstudio.com)*[marketplace.visualstudio.com](http://testingmarketplace.visualstudio.com)

---

### Detox

Completing my testing approach is Detox which I use for end-to-end testing. Although Detox is iOS only at the moment I like the way it is going, it is incredibly easy to get started writing tests and Android support is on the way.

**[wix/detox](https://github.com/wix/detox)**  
*[detox — Gray Box E2E Tests and Automation Library for Mobile ](https://github.com/wix/detox)**[Apps](http://Appsgithub.com)*[github.com](http://Appsgithub.com)

---

### Navigation

Coming from an [Appcelerator Titanium](http://www.appcelerator.com/) background where the navigation I used was native, the options available in React Native were underwhelming. The idea of using a Javascript based navigation system, which I had seen the performance issues of doing so in Appcelerator first hand was concerning.

As it happens React Navigation has proved capable, though I’ve had a few battles with it I do now quite like it and performance in production builds is adequate if you manage your interactions properly. Still I do hope for a stable native navigation option in the future!

**[React Navigation](https://reactnavigation.org/)**  
*[Edit ](https://reactnavigation.org/)**[description](http://descriptionreactnavigation.org)*[reactnavigation.org](http://descriptionreactnavigation.org)

---

### Native Directory

Beyond this it’s pretty much all dependent on the product I’m building but my goto resource is Native Directory to find whatever I need.

**[Native Directory](http://native.directory/)**  
*[Native Directory is a curated list of React Native libraries to help you build your ](http://native.directory/)**[projects.](http://projects.native.directory)*[native.directory](http://projects.native.directory)
