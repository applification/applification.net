---
title: Thoughts on Testing Library
date: '2021-02-11'
updated: '2022-02-18'
type: post
summary: Testing Library
topics:
  - react
  - testing
featured: false
draft: false
slug: testing-library
legacyId: '27'
---
Testing the front-end was always a pain point for me. [Enzyme](https://enzymejs.github.io/enzyme/) was ok, [Jest](https://jestjs.io) was better. Yet both had me digging into the internals of components, writing and changing code to make tests happy that made no material improvement to code quality. I could have 100% code coverage yet little trust in the actual tests.

![](/images/writing/testing-library-01-6e4b2c254a.png)

[Testing Library](https://testing-library.com) was the first approach to testing that enabled me to write tests in a productive way. The philosophy is:

> The more your tests resemble the way your software is used, the more confidence they can give you

Testing Library is opinionated and only provides methods and utilities that encourage writing tests that closely resemble how your web pages are used. This means we avoid testing:

1. The internal state of a component
2. Internal methods of a component
3. Lifecycle methods of a component
4. Child components

By avoiding [testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) your tests become more maintainable because tests only break when your app breaks, not the implementation details. It also builds confidence as the tests interact with the app in the same way as end-users.

## Supported Frameworks

The core of the library is the [Dom Testing Library](https://testing-library.com/docs/dom-testing-library/intro/) which provides a lightweight library for querying and interacting with DOM nodes (simulates with JSDOM/Jest or in the browser). However, it is framework agnostic and there is support for many frameworks including:

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)
- [Puppeteer testing Library](https://testing-library.com/docs/pptr-testing-library/intro)

## Final Thoughts

Testing Library is testing done right. It forces you to write tests in a maintainable way that give confidence in your app. I still believe there is a place for Jest unit tests on the backend but my philosophy is as Guillermo Rauch said:

> [Write tests, not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
