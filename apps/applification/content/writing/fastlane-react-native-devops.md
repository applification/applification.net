---
title: "Fastlane for React Native iOS & Android app\_DevOps"
date: '2017-04-07'
updated: '2022-02-13'
type: post
summary: Devops
topics:
  - react-native
featured: false
draft: false
slug: fastlane-react-native-devops
legacyId: '19'
---
> ***TLDR**** ****=\>**** *Having lost 2 days down numerous rabbit holes getting a continuous deployment pipeline working for React Native with fastlane I decided that it was complicated enough that a) I needed to write it down and b) if I did it it might hopefully help others avoid similar pain!

It’s fair to say the [React Native docs on building and deploying your app for beta and production](https://facebook.github.io/react-native/docs/running-on-device.html) are somewhat light! It’s also a fast moving area and many of the blog posts I uncovered to help were outdated and lead me down a rabbit warren or two. This post will in time also become outdated so be aware these instructions were helpful as of:

- *Fastlane 2.26.0*
- *React Native 0.43.1*
- *React-native-cli 2.0.1*
- *XCode 8.2.1*

#### Install Fastlane Tools

If you haven’t heard of fastlane, it’s:

> the easiest way to automate beta deployments and releases for your iOS and Android apps. 🚀 It handles all tedious tasks, like generating screenshots, dealing with code signing, and releasing your application.

f[astlane](https://docs.fastlane.tools/) contains numerous tools, we’ll just be using **match, gym, pilot, supply **and **fastlane** itself. To install run the following gem from the command line:

Install Fastlane

---

#### Create a new React Native App

Assuming you’ve already followed the [getting started with React Native guide](https://facebook.github.io/react-native/docs/getting-started.html) and got you’re environment set up, create a new React Native app from the command line but make sure you **pass in a package name** as a param otherwise you’ll hit some pain down the line renaming your package. In my case I’m going with *net.applification.awesomeproject* as my package name, replace with your own.

Create new React Native Project

> NB: At the current time a [regression bug](https://github.com/facebook/react-native/issues/13236) appears to mean the package name does not get set. In this case you’ll have to manually search and replace all references of *com.awesomeproject*.

---

#### Add Some App Icons

iOS in particular will complain if you don’t add some icons with a build error, so best to [add some straight away](http://stackoverflow.com/questions/34329715/how-to-add-icons-to-react-native-app).

---

#### Update iOS Info.plist

Additionally, if you don’t update your Info.plist you’ll get an error, so add the following:

Add to ./ios/AwesomeProject/Info.plist

---

#### XCode Setup Part 1

By default your bundle identifier may say something like “*org.reactjs.native.example.awesomeproject*”. You need to update this to match the one you will create in the Apple developer portal. e.g. *net.applification.awesomeproject*

While you are it it you might want to tweak the version numbering system. I prefer [Semantic Versioning](http://semver.org/) so for me 1.0 becomes 1.0.0 to allow for *major, minor and patch* versioning.

Next up XCode tries to be helpful by automatically managing signing. In our case this is unhelpful as we are going to let Testflight look after this, so we need to turn that off as follows:

![](/images/writing/fastlane-react-native-devops-01-a6059a5e77.png)

---

Finally for XCode part 1 we need to set the **Code Signing Identity**. Under *Build Settings*, ensure you have the correct t*arget* selected on the left with *All* and *Combined* filters then search for “code signing”.

For **Debug** set it to *iOS Developer* and **Release** set it to *iOS Distribution*:

![](/images/writing/fastlane-react-native-devops-02-e359d60df0.png)

---

#### Fastlane =\> Beta Lane

In a terminal from root of your project make sure you cd into the iOS folder. As of Fastlane v2.24.0 there is helpful error messaging to point you towards the iOS or Android folders for React Native projects as you cannot use fastlane from the project root.

fastlane will hopefully magically pick up most of the details, if it does not follow the command line prompts, at the end of it you should have an Appfile and Fastfile generated for you in *ios/fastlane/* folder something like:

Appfile

Fastfile

You’ll note that #match on line 13 is commented out. That’s because we’ve some further work to do first before we can complete the fastfile setup.

---

#### Match Setup (Code Signing)

Codesigning :-(

We are going to follow the [Codesigning.guide](http://Codesigning.guide) approach which involves creating a separate private Git repository to store all our certificates and provisioning profiles (encrypted) ready to be pulled down or updated by fastlane as required.

**[Code Signing Guide for Teams](https://codesigning.guide/)**  
*[A best practices guide on how to manage certificates and provisioning profiles in your development team. Wait, what is…](https://codesigning.guide/)*[codesigning.guide](https://codesigning.guide/)

To set this up first create a new private Git repository, I used [Gitlab](https://gitlab.com/) as it’s free for private repositories. Github and Bitbucket will work just fine too. Once you’ve got Git set up, run the following from the command line in your folder location.

match appstore

You can also run *match development* and *match adhoc* if you need those too. Once successful you should end up with a folder structure in Gitlab similar to the following:

![](/images/writing/fastlane-react-native-devops-03-a65682971a.png)

Gitlab folder structure

Ok, phew! Now match is configured we can revisit that line 13 in the fastfile and point it to our private git repository so you’re fastfile should now look something like:

fastfile match git url added

---

#### XCode Setup Part 2

We’re getting close but first a re-visit to XCode because now we’ve got those provisioning profiles from match, we need to tell XCode about them as remember we turned off Xcode's ability to automatically manage signing.

Select your project target and under the general section select your *match appstore provisioning profile.*

![](/images/writing/fastlane-react-native-devops-04-9aa89d8067.png)

> For bonus points there is a code way but I’ve not tried it yet, for more information see [https://blog.bam.tech/developper-news/deploy-your-react-native-app-to-the-app-store-with-the-push-of-a-button](https://blog.bam.tech/developper-news/deploy-your-react-native-app-to-the-app-store-with-the-push-of-a-button).

---

#### Testflight Setup

Finally! We get to see if this works :-) In a terminal within the ios folder run:

It will take quite some time but with luck you’ll get a Testflight app uploaded to iTunes Connect. Ok so fastlane uploaded the ipa file… what now? Well head on over to [iTunes Connect](https://itunesconnect.apple.com/) and complete the Testflight configuration to add some testers, this will send out email invites and you can start testing your app!

![](/images/writing/fastlane-react-native-devops-05-bf5234dfcf.png)

---

#### Fastlane =\> Release Lane

Testflight is great but we also need to release apps, so let’s update the fastfile to support releasing as well as beta testing. Thankfully the majority of the hard work is already done! We simply need to add one more section to our fastfile as follows:

fastfile release lane

We can now make use of fastlane to release using the following command:

---

#### Fastlane =\> Bonus Lane Options

You can do some nice stuff with lanes in addition to releases. For example if you have a Slack webhook set up you can ping a notification to a slack channel:

or auto increment build number:

or run a bash script to do well pretty much anything you like:

Take a look at the [advanced fastlane docs](https://docs.fastlane.tools/advanced/) for more details.

---

#### Android Configuration!

Ok eagle eyed of you will have noted we’ve only covered iOS so far. Now it’s time to dig into Android and uploading to Google Play :-0

---

#### Android Keystore

First up, in order to generate a signed APK you need to create a keystore as per the React Native docs:

**[Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html#generating-a-signing-key)**  
*[Android requires that all apps be digitally signed with a certificate before they can be installed, so to distribute…](https://facebook.github.io/react-native/docs/signed-apk-android.html#generating-a-signing-key)*[facebook.github.io](https://facebook.github.io/react-native/docs/signed-apk-android.html#generating-a-signing-key)

In short run the following in the command line and follow the prompts. NB: It’s crucial you DO NOT lose this keystore & password otherwise you won’t be able to update your app on the Play Store. *So keep it safe and secure :-)*

keystore creation

Once generated place your keystore file in the *android/app folder but add to your git.ignore as you don’t want it in source control.*

Keystore in hand we need to add a couple of lines to the *[gradle.properties](http://gradle.properties)** *file as follows: *(if you named your keystore differently above you’ll need to adjust accordingly)*

[gradle.properties](http://gradle.properties)

---

#### Keychain Keystore

Now I don’t know about you but I’m not keen on storing my keystore passwords in plain text in my Git Repo! So I’m following the advice in the React Native generating signed APK docs to store them in keychain on osx. The excellent article for that can be found at:

**[Avoiding plaintext passwords in gradle](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)**  
*[Keychain Access can store passwords for ](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)**[gradle](http://gradlepilloxa.gitlab.io)*[pilloxa.gitlab.io](http://gradlepilloxa.gitlab.io)

Once you’ve created those password in keystore we need to update the build.gradle file to pull out our passwords from keystore. NB*: you want the build.gradle file in the android/app folder NOT the one in android folder root).*

Near the top of your build.gradle file add the following. Again updating the keystore name and alias on lines 14 & 15 if you named it differently and ensuring you use the username you entered for your keychain.

build.gradle

Further on down the build.gradle file update the android config section by adding signingConfigs and ensuring you also update the buildTypes release config to reference the signingConfigs.

All being well you should now be able to generate a signed APK by running the following command.

Generate a signed APK :)

Your APK will appear in the *android/app/build/outputs/apk *folder.

---

#### Google Play Store Configuration

Ok so we can physically generate a signed APK file, it’s now time to return to fastlane so we can automate this stuff! First we need some Google service account credentials so we can use fastlane supply. Head on over to the [Supply set up instructions](https://github.com/fastlane/fastlane/tree/master/supply#setup) to get your JSON Key. Once you’ve got it pop it in the *android/app* folder but also add this file to your git.ignore as you don’t want to put your key in source control. Again keep this file safe and secure as you will need it if you want to re-deploy your app on another machine.

**[fastlane/supply setup](https://github.com/fastlane/fastlane/tree/master/supply#setup)**  
*[fastlane - 🚀 The easiest way to automate building and releasing your iOS and Android ](https://github.com/fastlane/fastlane/tree/master/supply#setup)**[apps](http://appsgithub.com)*[github.com](http://appsgithub.com)

---

Sadly at the moment there is no way to fully automate the Google Play store set up, the first APK file has to be uploaded via the [Google Play Developer Console](https://play.google.com/apps/publish/). At the time of writing Google is updating the way you do this with a new ‘Manage Releases’ feature, you’ll need to go through that process and upload your signed APK file, once done Fastlane Supply can then take over.

Also be aware Google Play requires a certain level of meta information such as title, description and screenshots before it will even allow an alpha APK to be deployed, so ensure you enter the minimum required information or your fastlane deployment may fail.

---

#### Android Fastlane Init

So this time we need to cd into the android folder and run *fastlane init *entering your package name and pointing to your JSON secret file when prompted.

This will create two files for you:

- android/fastlane/Appfile
- android/fastlane/Fastfile

This is now familiar territory to configure fastlane as we did for iOS. The generated Fastfile already has some default lanes for beta and deployment, lets add an alpha lane and to try things out.

The alpha lane uses gradle to build and sign our apk just as the *./gradelw assembleRelease* command does and the uses Supply to send that APK up to Google Play Store on the alpha track. Give it a try with the following command.

As with before you can configure the Fastfile to do anything you want such as notify slack, run tests or run alpha, beta or deploy lanes.
