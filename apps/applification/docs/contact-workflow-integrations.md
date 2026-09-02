# Contact workflow integrations

The diagram identifies integrations already used in the application. Logos are kept in their supplied white versions on the dark diagram, separate from the workflow colour legend.

| Integration | Where it is used | Source |
| --- | --- | --- |
| Vercel AI Gateway | Both initial extraction and follow-up calls | `src/lib/prepare-contact.ts` |
| Zod | Request schemas and structured model response validation | `src/lib/contact-draft.ts`, `src/lib/prepare-contact.ts` |
| Vercel BotID | Production contact request guard | `src/lib/contact-request-guard.ts`, `src/instrumentation-client.ts` |
| Vercel Blob | Private optional PDF/DOCX storage, linked in the enquiry email | `src/app/api/contact/attachment/route.ts`, `src/workflows/contact-delivery.ts` |
| Vercel Workflows | Durable email delivery and paused CV review | `src/workflows/contact-delivery.ts` |
| Resend | Enquiry email and approved CV attachment | `src/workflows/contact-delivery.ts` |

## Asset sources

Retrieved 2 September 2026. Assets are served locally from `public/images/integrations` without recolouring or changing their proportions.

- `vercel-white.svg`: `Vercel/icon/dark/vercel-icon-dark.svg` from the official [Vercel brand kit](https://vercel.com/geist/brands) download.
- `resend-wordmark-white.svg`: [official Resend wordmark](https://cdn.resend.com/brand/resend-wordmark-white.svg), linked by the [Resend brand kit](https://resend.com/brand).
- `zod-white.png`: the white logo served by [Zod's official website](https://zod.dev), downloaded at 128 pixels from `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-white.622ae253.png&w=128&q=75`.

Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries. Resend and Zod marks belong to their respective owners. The diagram describes technology used by this application.
