---
title: Node v22 Experiments
date: '2024-08-23'
updated: '2024-08-23'
type: post
summary: Experiments with the latest features of Node version 22
topics:
  - typescript
  - testing
featured: false
draft: false
slug: node-22-experiments
legacyId: '48'
---
Pushed along by Deno and Bun, Node have made some really nice strides recently to bring a modern Node experience.

Version 22 has some really nice out of the box features that mean you need a lot less dependencies and get a much more modern coding experience.

This is just some quick notes on the new features based on a video I watched where Matteo Collina chatted with Jason Lengstorf.

[Watch on YouTube](https://www.youtube.com/watch?v=evCnOaVaOTo)

**TypeScript Support**  
Working with TypeScript is so much easier, just install TypeScript, tsx and some node types then you’re good to go!

```
npm i typescript tsx 
npm i --save-dev @types/node
```

Then it’s as simple as:

```
node index.ts 
```

**Watch Mode Support**  
Enabling watch mode in Node (as far as I can recall) has always involved installing a third party package called `nodemon`. Not anymore!

Simply use the new `—watch` flag

```
node --watch index.ts
```

**Environment Variables**  
Need to use a `.env` file, well you’d have had to install a third party package like `dotenv`. No longer!

Out of the box environment variables can be passed in with the `—env-file` flag

```
node --env-file=.env index.ts
```

**Styling Text**  
If you’ve written any kind of CLI or bash script you’ve probably found yourself wanting to colour the text, which meant a third party package like `chalk`. No more!

Use the in-built `styleText` util.

```
import { styleText } from "node:util";

console.log(styleText(["yellow", "underline"], "Yellow underlined text"));
```

**ParseArgs**  
Similarly if your CLI used args then it was often a pain to read and validate those arguments without a third party package. Now you can use `parseArgs`

```
import { parseArgs } from "node:util";

const options = {
  name: {
    type: "string" as const,
  },
};

const args = process.argv.slice(2); // Skip the first two elements (node and script path)
let name = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--name" && i + 1 < args.length) {
    name = args[i + 1];
    break;
  }
}

const { values, positionals } = parseArgs({ args, options });

console.log(values, positionals);
console.log(styleText(["yellow", "underline"], `Yellow underlined text - ${name}`));
```

**Current Directory**  
Something that used to be fiddly is now a 1 liner

```
console.log(import.meta.dirname)
```

**Globs & Read Stream**  
Working with the filesystem using globs and streaming the result to the terminal is now really easy

```
import { glob } from "node:fs/promises";
import { createReadStream } from "node:fs";

for await (const file of glob(import.meta.dirname + "/*")) {
  console.log(styleText("red", file));
  if (file.endsWith("ts")) {
    const stream = createReadStream(file);

    for await (const chunk of stream) {
      console.log(styleText("green", chunk.toString().toUpperCase()));
    }
  }
}
```

**Test Runner**  
Running tests used to involve a third party package such as `Jest` now you can run them out of the box using the new node test runner.

```
import { test } from "node:test";
import assert from "node:assert/strict";

test("NoJest", function () {
  const res = NoJest();
  assert.equal(res, "Hey no Jest needed!");
});
```

---

A code repo where you can run these new features [https://github.com/DaveHudson/node-22-experiments](https://github.com/DaveHudson/node-22-experiments)
