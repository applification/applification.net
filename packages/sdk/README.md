# @applification/sdk

Official TypeScript client for the [Applification](https://www.applification.net) public information API: Dave Hudson's profile, availability and contract terms, client work, writing and products.

- Free and read-only. No API key, account or cookie.
- Zero dependencies. Works in Node 18+, Bun, Deno, browsers and edge runtimes.
- Same data as the [MCP server](https://www.applification.net/api/mcp) and the [OpenAPI 3.1 specification](https://www.applification.net/api/openapi.json).

Documentation: <https://www.applification.net/developers>

## Install

```sh
npm install @applification/sdk
```

## Use

```ts
import { Applification } from "@applification/sdk";

const client = new Applification();

const { data } = await client.catalog("profile");
console.log(data.profile.role, data.profile.availability);

const { results } = await client.search({ query: "production AI", type: "client-work" });
const markdown = await client.readAll(results[0]);
```

`search` returns one page (`limit` 1–10, default 5) with `nextOffset`; `searchAll` iterates every page. `read` returns one Markdown section of at most 4,000 characters with `nextSection`; `readAll` joins them.

Errors are thrown as `ApplificationError` with `status`, `code` (`INVALID_QUERY`, `NOT_FOUND` or `UNAVAILABLE`) and, when present, `retryAfter` seconds.

## MCP

```ts
import { MCP_CLIENT_CONFIG } from "@applification/sdk";
// { mcpServers: { applification: { type: "streamable-http", url: "https://www.applification.net/api/mcp" } } }
```

## Pricing

Contract rates are quoted per engagement. The API reports `publishedRate: null`; the SDK never invents a number.
