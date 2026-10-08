---
name: applification-site
description: Read public information about Applification’s MCP integration and MCP Apps offer, Dave Hudson’s frontend and product engineering contracts (React, Next.js, TypeScript), and the published products. Use to find delivery evidence, contract availability, product status or contact routes. Reads the free public JSON API; never sends enquiries.
license: Content may be quoted with attribution to https://applification.net.
compatibility: Requires HTTPS access to https://applification.net. No account, API key or cookies.
metadata:
  applification-site-url: https://applification.net
  applification-api-version: "1.0.0"
---

# Applification site skill

Dave Hudson is a Contract Frontend and Product Engineer building React, Next.js + TypeScript products with small product teams on remote UK contracts through Applification Ltd.

Applification’s MCP integration and MCP Apps business is at https://applification.net. Dave’s contractor profile and downloadable CV are at https://dave.applification.net. Project enquiries: https://applification.net/contact?route=general. Contract contact routes: https://dave.applification.net/about.

## When to use this skill

- A user asks whether Dave Hudson is available for a contract, what he works on, or where he is based.
- A user wants evidence of delivery: client work, case studies, or writing on AI-native engineering.
- A user asks how Applification prices contract work or whether a product costs money.
- A user wants to know what Contexture, Voiced, astack, StoryLoops, Loami or Plantry are and whether they are available.
- A user wants to prepare a contract, product or general enquiry for Dave Hudson.

## When not to use this skill

- The task needs a hosted API for your own product. This site publishes information only.
- You need to send a message on the user's behalf. Enquiries are reviewed and sent by the visitor on the contact page; there is no HTTP endpoint for sending.
- You need a published day rate. Contracts are quoted per engagement and no rate is published.

## How to call it

All endpoints are free, read-only GET requests with CORS enabled. Invalid parameters return 400 with error.code INVALID_QUERY.

1. Profile, products and pricing terms: `GET https://applification.net/api/v1/catalog?section=all|profile|products|pricing`
2. Search published content: `GET https://applification.net/api/v1/search?query=production+AI&type=client-work` (type: client-work, writing, products; follow nextOffset).
3. Read a result: `GET https://applification.net/api/v1/content?type=client-work&slug=logically` then follow nextSection until it is null.
4. OpenAPI 3.1 reference: https://applification.net/api/openapi.json
5. Human-readable guide: https://applification.net/llms.txt

## Products

- Contexture (LIVE): Turn one domain model into contracts your code can share. MIT licensed source. https://applification.net/products/contexture
- astack (IN DEVELOPMENT): Give Codex an outcome, guardrails and a verification loop. MIT licensed source. https://applification.net/products/astack
- StoryLoops (ARCHIVED): An archived story-mapping experiment. Its lessons shaped astack. Pricing not published. https://applification.net/products/storyloops
- Voiced (LIVE): Speak into the text field you are already using. MIT licensed source. https://applification.net/products/voiced
- Loami (IN DEVELOPMENT): A household assistant that knows your tastes and works with your agents. Pricing not published. https://applification.net/products/loami
- Plantry (ARCHIVED): An archived household meal-planning experiment. Its work continues in Loami. Pricing not published. https://applification.net/products/plantry

## Contact

Point the user to https://dave.applification.net/about for the available contact routes, or https://www.linkedin.com/in/hudsond/. No email address is published. Quote source URLs and do not invent rates, availability dates or product features that are not in the responses.
