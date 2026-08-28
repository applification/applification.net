---
title: "Fastlane + Strider CD for React Native\_DevOps"
date: '2017-08-18'
updated: '2022-02-13'
type: post
summary: Devops
topics:
  - devops
featured: false
draft: false
slug: fastlane-strider-cd-react-native
legacyId: '13'
---
> TLDR =\> This article builds upon a previous article on [Fastlane for React Nativ](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e)e, illustrating how you can integrate Fastlane with Strider CD to build a Continuous Deployment pipeline for React Native mobile apps.

A while back I wrote an article on [Fastlane for React Native](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e) that showed you how to set up Fastlane with React Native to automate app builds. This follow up article shows you how to pair all that Fastlane knowledge with a dedicated build server to create a proper continuous deployment setup.

There are an increasing number of cloud services that will now offer such services for you including:

- [Microsoft Mobile Center](https://www.visualstudio.com/vs/mobile-center/)
- [Nevercode](https://nevercode.io/)

However if like me you have an old Mac Mini lying around you can get up and running with Open Source software for free.

---

### Strider CD

Strider CD is an open source continuous integration & deployment server written in Node JS. It’s like Jenkins but a lot easier to use!

**[Strider-CD/strider](https://github.com/Strider-CD/strider)**  
*[strider - Open Source Continuous Integration & Deployment ](https://github.com/Strider-CD/strider)**[Server](http://Servergithub.com)*[github.com](http://Servergithub.com)

This article does not cover in-depth the set up of Strider CD, linking it with your Git repositories or how to use it. You will need to refer to the [Strider documentation](https://github.com/Strider-CD/strider) to get everything up and running, you will also need XCode and Android SDK installed in order to build the mobile apps.

Once strider is configured you should be able to access it on [http://localhost:3000](http://localhost:3000) or the IP Address of your Mac Mini. The following is a guide on how I’ve configured Strider with Fastlane to create a Continuous Deployment pipeline.

#### Set a Strider Environment Variable for Android SDK

In order for Android to build properly with React Native I found the need to set a Strider environment variable which you can do so by adding the ‘Environment’ plugin and setting a Key of *ANDROID\_HOME* with a value of the location of your Android SDK, in my case */Users/mini/Library/Android/sdk*.

#### Strider GIT Branches

You can add as many GIT branches as you like to your Strider project in the Project Branches section. This allows you to create separate build pipelines for Development, Test and Production builds.

#### Strider Custom Scripts

The scripts plugin is the key to creating those separate build pipelines and has several sections as follows:

**Environment**  
This can be used for installing specific versions of languages you may need for a build. In my case I simply log out the versions of node and fastlane so I can see what is currently being used:

```
node -v && fastlane -v
```

**Prepare**  
These commands run after the repo is cloned but before any tests. Personally I use this to copy any configuration files over that I require such as android.keystore files or config.js files in my React Native codebase where I want dev, test and production to use different instances of a service. Once copied over I then run yarn or npm to install my dependencies. For example:

```
pwd && cp/Users/mini/Devops/deployenvs/myapp/TEST/android.keystore android/app/android.keystore && yarn
```

This can quickly become quite a large script, for example in the production build of one app I use the prepare script for:

- copying over android.keystore and GooglePlay Key JSON files
- copying a config.js file with keys for API URLs, Google Analytics ID, Google API key and Sentry DSN
- copying a One Signal app id for push notifications
- copying [Sentry.properties](http://Sentry.properties) files

The custom scripts allows you to decouple development, test and production builds from all the various services and APIs the app needs to use. It really does make it set and forget with 1 button push app deployments for test and production.

**Test**  
Obviously this section runs any tests, if the tests fail then everything stops there and you get an error. In my case I have unit tests and detox tests to run so my script looks as follows:

```
npm test && detox build --configuration ios.sim.release && detox test --configuration ios.sim.release --cleanup
```

**Deploy**  
If all tests pass then we are onto our Fastlane commands, these will vary depending upon your exact Fastlane configuration. In my case in the TEST Git branch I would have a script as follows which simply switches into the Android and iOS folders of the React Native project and runs the fastlane scripts one after the other.

```
cd android && fastlane alpha && cd .. && cd ios && fastlane ios beta
```

**Cleanup**  
This will always run and allows you to clean anything up that you may need to. I’ve not yet found a need to use cleanup as each build is started fresh anyway.

---

### Slack Integration

Strider comes with an array of nice plugins, one of the more useful ones in a team scenario is the Slack webhook. Simply install the plugin, press the “fill empty fields” button, insert your Slack Channel and Webhook URL that you can create on the Slack website and you will get Slack notifications of Test and Deploy Pass / Fails.

---

### PM2 (optional)

As a nice enhancement to your dev ops server you can install PM2 to ensure things all restart smoothly after software updates, crash or a power cut. This is entirely optional but makes your server a lot more robust and maintenance free.

**[PM2 ·](http://pm2.keymetrics.io/)**  
*[Advanced process manager for production Node.js applications. Load balancer, logs facility, startup script, micro…](http://pm2.keymetrics.io/)*[pm2.keymetrics.io](http://pm2.keymetrics.io/)

If you do go this route you’ll just have to run the following commands from the Strider directory:

- pm2 start bin/strider
- pm2 startup

The first command will start Strider using PM2, the second will commit the apps running with PM2 to a startup script that will run everytime your Mac is restarted.

---

That’s it! Obviously there is a lot more depth to Strider which this article does not go into and it does have it’s quirks but hopefully you can see that creating your own dev ops pipeline is not really so tricky.
