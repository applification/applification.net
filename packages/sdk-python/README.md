# applification

Official Python client for the [Applification](https://www.applification.net) public information API: Dave Hudson's profile, availability and contract terms, client work, writing and products.

- Free and read-only. No API key, account or cookie.
- Standard library only. Python 3.9+.
- Same data as the [MCP server](https://www.applification.net/api/mcp) and the [OpenAPI 3.1 specification](https://www.applification.net/api/openapi.json).

Documentation: <https://www.applification.net/developers>

## Install

```sh
pip install applification
```

## Use

```python
from applification import Applification

client = Applification()

profile = client.catalog("profile")["data"]["profile"]
print(profile["role"], profile["availability"])

results = client.search("production AI", type="client-work")["results"]
markdown = client.read_all(results[0]["type"], results[0]["slug"])
```

`search` returns one page (`limit` 1–10, default 5) with `nextOffset`; `search_all` iterates every page. `read` returns one Markdown section of at most 4,000 characters with `nextSection`; `read_all` joins them.

Errors raise `ApplificationError` with `status`, `code` (`INVALID_QUERY`, `NOT_FOUND` or `UNAVAILABLE`) and, when present, `retry_after` seconds.

## MCP

```python
from applification import MCP_CLIENT_CONFIG
# {"mcpServers": {"applification": {"type": "streamable-http", "url": "https://www.applification.net/api/mcp"}}}
```

## Pricing

Contract rates are quoted per engagement. The API reports `publishedRate: null`; the client never invents a number.
