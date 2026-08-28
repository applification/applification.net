---
title: AWS AppSync + React Native
date: '2017-12-20'
updated: '2022-02-13'
type: post
summary: AWS AppSync first impressions
topics:
  - react-native
featured: false
draft: false
slug: aws-appsyc-react-native
legacyId: '7'
---
After seeing the [blog post on AWS AppSync](https://aws.amazon.com/blogs/aws/introducing-amazon-appsync/) a few weeks ago I eagerly signed up to the beta programme. 2 weeks later and my invite finally arrived! These are some first thoughts on AppSync with React Native.

Creating an AppSync API is really easy. You just name it and either write your GraphQL scheme or use a sample scheme based on an events system. AppSync uses that schema to generate your API endpoint and associated DynamoDB tables.

Once created you get the full GraphQL experience. You can modify your schema which will auto update your API and database tables, write queries and mutations in a browser; you can even change the data sources if you like and use say AWS Lambda functions instead.

Helpfully AppSync also provides a sample React Native app for you to clone. git clone [https://github.com/aws-samples/aws-mobile-appsync-events-starter-react-native](https://github.com/aws-samples/aws-mobile-appsync-events-starter-react-native) to get up and running quickly.

In my case after following the sample schema all I had to do was:

- Download the AppSync.js file, rename it to aws-exports.js and insert into the root of my project
- Update package.json to use the latest version of react-apollo (2.0.4 at time of writing)
- Run npm install && react-native run-ios

My sample app booted up, I could create a new event and see them listed out within the app. Going to the AWS DynamoDB I could easily verify the data was indeed stored there.

---

As a sample app it was easy to get up and running and it’s great that you get bare bones access to the data. It’s the kind of security you don’t get with [Graph.cool](http://Graph.cool) where the reality at the moment is it’s very hard to get to your actual data and export should you want to.

That said, at this moment in time I prefer [Graph.cool](http://Graph.cool) for it’s amazing user experience. For someone learning GraphQL it is just so much nicer experience.

If I was asked to implement a GraphQL service that needed to scale and you owned the data it’s a no brainer though, AWS AppSync gives you all that you need and you can work out the rest. There is just less hand holding.

Essentially AWS AppSync is exactly what I thought it would be and that is a good thing!
