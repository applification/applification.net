# @applification/sdk

Official TypeScript client for the [Applification Public Information API](https://www.applification.net/agents): read Dave Hudson's public profile, product catalog and commercial terms, search published client work and writing, and read content in bounded Markdown sections.

Free, read-only, no API key. Source lives in [applification/applification.net](https://github.com/applification/applification.net/tree/main/packages/applification-sdk). OpenAPI reference: <https://www.applification.net/api/openapi.json>. Agent discovery: <https://www.applification.net/.well-known/ard.json>.

## Install

```bash
npm install @applification/sdk
```

Requires Node 18+ or any runtime with global `fetch`.

## Usage

```ts
import { createClient } from "@applification/sdk";

const client = createClient();

const { data } = await client.getCatalog("pricing");
console.log(data.pricing.contract.label); // "Quoted per engagement"

const { results, nextOffset } = await client.search({
  query: "production AI",
  type: "client-work",
});

for await (const section of client.readAllSections({
  type: "client-work",
  slug: results[0].slug,
})) {
  console.log(section.sections[section.section].title, section.content);
}
```

Errors throw `ApplificationApiError` with `status`, `code` (`INVALID_QUERY`, `NOT_FOUND` or `HTTP_<status>`) and `retryAfter` seconds when the server sent it. Back off on 429 and 503.

## Options

```ts
createClient({
  baseUrl: "https://www.applification.net", // default
  fetch: customFetch,
  headers: { "User-Agent": "my-agent/1.0" },
});
```

## Licence

MIT © Applification Ltd
