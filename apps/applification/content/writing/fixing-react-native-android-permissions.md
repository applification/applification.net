---
title: Fixing React Native Android Permissions
date: '2017-06-11'
updated: '2022-02-13'
type: post
summary: Android permissions issues
topics:
  - react-native
featured: false
draft: false
slug: fixing-react-native-android-permissions
legacyId: '15'
---
*TLDR =\> React Native can sometimes add unwanted permissions for Android. This can affect your installs once on the app store. This quick tip will help you remove them.*

I recently came up against the Android Permissions problem when launching an app for kids under 5. Despite the fact I did not request any special permissions the app was getting built requesting permissions for:

- System\_Alert\_Window
- Read\_Phone\_State

Now as a parent I’d be questioning why an app that shows Flash Cards for babies would be requesting these permissions, sounds suspicious to me!

To find out what these permissions are for you can look them up on the Android developer docs:

**[Manifest.permission | Android Developers](https://developer.android.com/reference/android/Manifest.permission.html)**  
*[This permission can be used on content providers to allow the global search system to access their data. Typically it…](https://developer.android.com/reference/android/Manifest.permission.html)*[developer.android.com](https://developer.android.com/reference/android/Manifest.permission.html)

---

**SYSTEM\_ALERT\_WINDOW**

> Allows an app to create windows using the type TYPE\_APPLICATION\_OVERLAY, shown on top of all other apps. Very few apps should use this permission; these windows are intended for system-level interaction with the user.

Turns out this is actually an important development feature for React Native. However, it has no place being in the production version of the app so lets remove it.

In the file android/app/build.gradle find the buildTypes section and add a debug section with as follows and update the release section by adding the manifestPlaceholders line.

This is a nice little trick as we still want the SYSTEM\_ALERT\_WINDOW permissions on a debug build just not the production one and this takes care of that.

In the file android/app/src/main/AndroidManifest.xml we can now remove the line as it is redundant:

---

**READ\_PHONE\_STATE**

> Allows read only access to phone state, including the phone number of the device, current cellular network information, the status of any ongoing calls, and a list of any PhoneAccounts registered on the device.

So this had no business being there at all and I’m not sure why it is but it can simply be removed using tools:node=”remove”.

In android/app/src/main/AndroidManifest.xml ensure you add xmlns:tools in your manifest tag as seen in the line 2 of the code below:

Then update the READ\_PHONE\_STATE permissions as follows adding tools:node=”remove”:
