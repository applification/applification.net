---
title: React Native Custom Fonts
date: '2017-06-05'
updated: '2022-02-13'
type: post
summary: Custom fonts
topics:
  - react-native
featured: false
draft: false
slug: react-native-custom-fonts
legacyId: '17'
---
TLDR =\> Quick tutorial on setting up custom fonts with React Native across iOS and Android.

#### Cross Platform Custom Font Naming

To avoid conditional logic in your React Native styles it’s a good plan to rename a font if necessary to ensure it is read the same on both iOS and Android.

For example, I’m using a font file named “vinchand.ttf”. Yet when I open it up in [FontBook.app](http://FontBook.app) I can see that the fonts full name is “vincHand” with a capital H.

![](/images/writing/react-native-custom-fonts-01-9a94e3333a.png)

To ensure things run smoothly I’m going to rename the font to be “vincHand.ttf” as Android will read from the filename whilst iOS will read from the full name property.

#### Add Fonts to Assets

Next add all the font files you want to an “assets/fonts” folder in the root of your react native project:

![](/images/writing/react-native-custom-fonts-02-8c1e4e4bbc.png)

#### Package.json

Next we need to tell React Native where our custom fonts are located. We do this by adding rnpm to package.json providing the path to the font files:

Then we tell react native to link those font files for us:

This should add the font references in your Info.plist file for iOS and on Android copy the font files to android/app/src/main/assets/fonts. You can verify this by opening up Info.plist from the iOS folder and looking for a UIAppFonts key, you should see something similar to:

#### Adding Fonts to Android

On Android if you look in the file path “android/app/src/main/assets/fonts/” you should see your fonts have been copied over:

![](/images/writing/react-native-custom-fonts-03-3260a7e936.png)

#### React Native Styles

With your fonts embedded and referenced it’s a simple case of adding them to your React Native styles. Simply add a fontFamily property with your font name:

#### iOS Screenshot

![](/images/writing/react-native-custom-fonts-04-70c2ab0ea8.png)

#### Android Screenshot

![](/images/writing/react-native-custom-fonts-05-19a7f2278b.png)

#### Source Code

You can find the source code for this tutorial on GitLab:

**[Dave Hudson / react-native-custom-fonts](https://gitlab.com/applification/react-native-custom-fonts)**  
*[Code to go with tutorial on custom fonts for react ](https://gitlab.com/applification/react-native-custom-fonts)**[native](http://nativegitlab.com)*[gitlab.com](http://nativegitlab.com)
