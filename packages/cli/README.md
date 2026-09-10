# @applification/cli

Official command-line tool for the [Applification](https://www.applification.net) public information API. Search Dave Hudson's client work, writing and products, read content as Markdown, print the catalog and get the MCP configuration. Free, read-only, no API key.

Documentation: <https://www.applification.net/developers>

```sh
npx @applification/cli catalog --section pricing
npx @applification/cli search "production AI" --type client-work
npx @applification/cli read client-work logically --all
npx @applification/cli mcp
```

Or install globally:

```sh
npm install -g @applification/cli
applification --help
```

Output is JSON for `catalog` and `search`, Markdown for `read` (add `--json` for the full response). Exit codes: `0` success, `1` unavailable, `2` usage or invalid query, `3` not found. Errors are written to stderr as JSON.

Built on [`@applification/sdk`](https://www.npmjs.com/package/@applification/sdk).
