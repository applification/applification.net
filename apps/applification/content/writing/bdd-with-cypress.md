---
title: BDD with Cypress
date: '2019-06-04'
updated: '2022-02-13'
type: post
summary: >-
  This is a quick tutorial on how to set up Cypress to work with BDD and Cypress
  Testing Library. As usual this is a note to myself so I remember how to set
  things up the next time I need to do this!
topics:
  - react
  - testing
featured: false
draft: false
slug: bdd-with-cypress
legacyId: '4'
---
I like to keep my end-to-end tests separate from my codebase, and for this example we’ll need something to test. So…. Codesandbox?

```
mkdir Cypress

npm init -y

npm install cypress — save-dev

npm install — save-dev cypress-cucumber-preprocessor

npm install — save-dev @testing-library/cypress

“cypress”: “cypress open”

“npm run cypress”
```

![](/images/writing/bdd-with-cypress-01-38734d0ad4.png)

```
cypress/plugins/index.js
```

Cypress Config setup:

**[TheBrainFamily/cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#cypress-configuration)**  
*[Run cucumber/gherkin-syntaxed specs with ](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#cypress-configuration)**[cypress.io](http://cypress.io)**[ - TheBrainFamily/cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#cypress-configuration)*[github.com](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#cypress-configuration)

---

`cypress/integration/`put your BDD file

I want to open a social network page

@focus

Scenario: Opening a social network page

Given I open Google page

Then I see “google” in the title

---

“cypress-cucumber-preprocessor”: {

“nonGlobalStepDefinitions”: true

}

```
npm i -s cosmiconfig
```

---

Cypress-Testing-Library

in `cypress/support/index.js`

`import 'cypress-testing-library/add-commands`

---

Polyfill your fetch Requests to log XHR

```
let polyfill
```

```
before(() => {
  const pollyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'
  cy.request(pollyfillUrl).then(response => {
    pollyfill = response.body
  })
})
```

```
Cypress.on('window:before:load', win => {
  delete win.fetch
  win.eval(pollyfill)
  win.fetch = win.unfetch
})
```

---
