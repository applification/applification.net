---
title: "React Native working with local\_data"
date: '2017-06-05'
updated: '2022-02-13'
type: post
summary: Local data
topics:
  - react-native
featured: false
draft: false
slug: react-native-local-data
legacyId: '16'
---
TLDR =\> If you use Redux-Persist or some local storage option such as SQLite or ASyncStorage then you need to verify what data is being saved to the device / simulator. This tutorial will run you through accessing your local data on both iOS and Android.

### iOS

Let’s start off with the easy one!

#### iOS Simulator

The absolute easiest to work with is the iOS Simulator, especially so if you use the open source OSx app SimSim.

**[dsmelov/simsim](https://github.com/dsmelov/simsim)**  
*[simsim - Use SimSim to explore iOS application folders in Terminal or Finder. Fast, stable, free alternative to ](https://github.com/dsmelov/simsim)**[SimPholders](http://SimPholdersithub.com)*[ithub.com](http://SimPholdersithub.com)

SimSim provides a nice menu bar icon that shows the iOS app currently running in the simulator and providing quick a shortcut to that folder location in finder.

![](/images/writing/react-native-local-data-01-7dec6f8509.png)

Once in there open up the /documents folder and you’ll see all your local assets. In my case you’ll spot a RCTAsyncLocalStorage\_V1 folder with a manifest.json file in it. This is from Redux-Persist and if I open them up I can see the data cached for offline use.

![](/images/writing/react-native-local-data-02-aa100f9f37.png)

#### iOS Clear Data

Need a clean slate when developing, it’s really simple to clean out the database, simply removing the files from finder.

---

#### ANDROID

> When it comes to Android, personally I do all my development on a device rather than emulator because it is so much faster. The principle is the same for the emulator though.

With your device connected you need to run the adb shell command asking it to run using the app id of your app.

The adb app is installed as part of the Android SDK and can be found in the *platform-tools* folder within your root AndroidSDK installation folder. Your app id can be found in android/app/src/main/AndroidManifest.xml under the package property.

Now… in order to get the data off the device and onto our computer we need to first copy the data from the sandboxed app folder to a public folder such as the SD card. (If your device doesn’t have an SD Card you’ll need to copy it to some other location). So the complete command will be as follows (replacing com.your.appid with your actual app id).

> NB: Redux-Persist uses SQLite for storage on Android, RKStorage is the .sql file I am copying over, in your case it may be different.

This script simply says run adb as a shell command using our app id. Then copy the RKStorage .sql file to the sdcard. With the data happily sitting on the sd card we can now use another adb command, pull to copy the file to your computer.

This will copy the .sql file to whatever filepath you were at in your bash prompt. You can then open up the .sql file and take a look at the data, I use base [base.app](http://base.app) but there are plenty of alternatives

**[Menial " Base 2](https://menial.co.uk/base/)**  
*[Menial makes Mac Apps. Our Apps are Base, Filler and ](https://menial.co.uk/base/)**[Charge.](http://Charge.menial.co.uk)*[menial.co.uk](http://Charge.menial.co.uk)

With the sqlite file on your macbook, simply open up the SQLite database using an app such as Base to view the data.

![](/images/writing/react-native-local-data-03-85a6fb1408.png)

Now this is quite a few separate commands but we can do better and run them all as once so with a single command you can copy the database off the device and automatically open up your SQLDb app to view the data. The complete command would be:

#### Android Clear Data

Need a clean slate whilst developing on Android? Simply open up the app settings on your device, find the storage section and press ‘clear data’.
