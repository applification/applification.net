# Runbook: contact workflow

How to configure, verify, switch off and troubleshoot the AI-assisted contact service at `/contact`, including contract CV reviews. For how it is built, see [architecture](../architecture.md#contact-workflow).

## Quick reference

| Situation | First action |
| --- | --- |
| Abuse, spam or unexpected AI spend | [Switch the service off](#switch-the-service-off) |
| Visitors see "temporarily unavailable" (503 `protection_unavailable`) | [Protection unavailable](#protection-unavailable-503) |
| Preparation fails (`budget_exhausted`, `timeout`, `malformed_response`) | [Preparation failures](#preparation-failures) |
| An enquiry didn't arrive | [Delivery failures](#delivery-failures) |
| "CV follow-up needs recovery" email | [CV delivery failed](#cv-delivery-failed) |
| Review link says expired or unavailable | [Review link problems](#review-link-problems) |
| A secret may have leaked | [Rotate secrets](#rotate-secrets) |

## What runs where

- **Visitor browser:** `/contact`, rendered by `contact-workspace.tsx`.
- **Route handlers** (Vercel Functions):
  - `POST /api/contact/prepare`: the AI proposal.
  - `POST` and `DELETE /api/contact/attachment`: the private brief upload.
  - `POST /api/contact/deliver`: starts delivery. `GET ?runId=` polls it.
  - `GET /api/contact/attachment/download?token=`: the owner-only download.
  - `POST /api/contact/cv-review`: the owner's CV decision.
- **Durable workflows** (Vercel Workflow):
  - `deliverContactEnquiryWorkflow` emails Dave.
  - `contractCvReviewWorkflow` waits up to 14 days for the CV decision.
  - `expireContactAttachmentWorkflow` deletes each upload 7 days after it was made.
- **External services:**
  - Vercel Firewall: the `contact-write` rule.
  - Vercel BotID, at the Basic level.
  - Vercel Blob: a private store.
  - Vercel AI Gateway: a budgeted key.
  - Resend: email.

Every write request passes `guardContactRequest` first. The checks run in this order:
1. The kill switch.
2. The Origin allowlist.
3. The `x-contact-session` header.
4. The Firewall limit, checked once per IP and once per session.
5. BotID.

If Firewall or BotID can't be reached, the request fails closed with a 503 and **nothing is spent, stored or sent**.

## Configuration

### Environment variables (Vercel project `applification`, Production)

| Variable | Required | Purpose / notes |
| --- | --- | --- |
| `CONTACT_WORKFLOW_ENABLED` | Yes | `true` to enable. Anything else in production disables the page **and** every contact write API. |
| `CONTACT_AI_GATEWAY_API_KEY` | Recommended | A budgeted AI Gateway key used only for contact preparation. It takes precedence over `AI_GATEWAY_API_KEY`. Preparation never falls back to OIDC. |
| `AI_GATEWAY_API_KEY` | Fallback | Used if no contact-only key is set. |
| `CONTACT_AI_MODEL` | Optional | Overrides the preparation model. |
| `BLOB_READ_WRITE_TOKEN` | Yes | Connects the **private** Blob store. Vercel sets it when the store is connected. |
| `RESEND_API_KEY` | Yes | A sending-only Resend key. |
| `CONTACT_DELIVERY_TO` | Yes | Dave's inbox. Enquiries only ever go here. |
| `CONTACT_DELIVERY_FROM` | Yes | A sender on a Resend-verified domain. |
| `CONTACT_PUBLIC_BASE_URL` | Yes | For example `https://www.applification.net`. Used in email links and as an extra allowed Origin. |
| `CONTACT_ATTACHMENT_ACCESS_SECRET` | Yes | At least 24 random characters. It signs attachment download links **and** the per-session upload folders. |
| `CONTACT_OWNER_REVIEW_SECRET` | Yes | At least 32 random characters. It signs the owner review links. |
| `CONTACT_RATE_LIMIT_SECRET` | Yes | Salts the in-memory abuse buckets. |
| `CONTACT_CV_BLOB_PATHNAME` | For CVs | A private Blob path under `contact/cv/`, for example `contact/cv/dave-hudson.pdf`. |
| `CONTACT_CV_FILENAME` | Optional | The filename the recipient sees (default `Dave-Hudson-CV.pdf`). |
| `CONTACT_CV_VERSION` | For CVs | A label recorded with each CV sent. Change it whenever the PDF changes. |

Generate secrets with `openssl rand -base64 48`. `.env.example` lists the same variables for local development.

### Vercel settings

- **Firewall:** an SDK rate-limit rule named `contact-write`. It allows 30 requests per 15-minute fixed window. The code checks it twice, once keyed by IP and once by browser session. Its counters are regional.
- **BotID:** enabled for the project. The client instrumentation lives in `src/instrumentation-client.ts`, and it must be deployed with the API guards.
- **Blob:** a store with **private** access, connected to the project.
- **Workflow:** enabled. The workflow routes are generated under `/.well-known/workflow/v1/*`. Check that they are not publicly invocable (see [Verify a deployment](#verify-a-deployment)).
- **AI Gateway:** the contact key has a small budget, currently $5, **without automatic refill**. Short in-flight overruns are possible.

## Verify a deployment

Run these on a Vercel **preview** before promoting any change that touches contact, BotID, headers or dependencies.

1. **Check the page.** Open `/contact` in a real browser. Local tests can't exercise BotID's production classification.
2. **Prepare a brief.** Send a short message and confirm that a proposal appears.
3. **Test attachments.** Upload a small PDF, remove it, then upload it again.
4. **Deliver.** Send a test enquiry to yourself, then confirm the email arrives and the page shows "sent".
5. **Test a contract enquiry.** Open the review link from the email, download the brief, then decline (or approve with a test CV).
6. **Check the CSP.** Keep DevTools → Console open throughout. There should be **no** `Content-Security-Policy-Report-Only` violations. See [Promote the full CSP](#promote-the-full-csp).
7. **Probe the workflow routes.** Confirm that they refuse public calls:

   ```bash
   curl -si -X POST https://<deployment>/.well-known/workflow/v1/flow | head -1   # expect 401/403/404, never 200
   ```
8. **Check the headers.**

   ```bash
   curl -sI https://<deployment>/ | grep -iE 'content-security|x-frame|strict-transport|referrer|permissions'
   ```

## Switch the service off

Use this for abuse, a spike in spend, a provider outage, or anything else you can't diagnose quickly.

1. In Vercel, set `CONTACT_WORKFLOW_ENABLED=false` for Production.
2. **Redeploy.** Environment changes only apply to new deployments.

Once the new deployment is live:

| Area | What changes |
| --- | --- |
| `/contact` | Returns 404 |
| Contact links in the header and CTAs | Hidden |
| `prepare`, `attachment` and `deliver` | Return **503 `contact_unavailable`** before any Firewall, BotID, AI, Blob or email call |
| Still working: delivery status polling | Enquiries already in flight can still report their outcome |
| Still working: owner review and CV decisions | Continue to work |
| Still working: attachment downloads | Continue to work |

To turn the service back on, set `true` and redeploy.

For **targeted** abuse where the service can stay on, tighten the `contact-write` Firewall rule or add a WAF block instead. You don't need to redeploy for those.

## Troubleshooting

### Protection unavailable (503)

Visitors see "The contact service is temporarily unavailable". The runtime logs show `contact_protection_unavailable` with the operation name.

1. Check that the `contact-write` Firewall rule exists and is enabled.
2. Check that BotID is enabled and that `instrumentation-client.ts` is in the current deployment.
3. If `CONTACT_PUBLIC_BASE_URL` is malformed, every write also returns 503. Check its value.

### Rate limited (429)

`rate_limited` from the guard means the Firewall rule tripped for that IP or session (a 15-minute window). The deliver route also returns 429 for:
- a filled honeypot field
- a brief sent less than 1.5 seconds, or more than 24 hours, after the page opened
- more than 5 deliveries from one IP in 15 minutes, counted per instance

These are expected under abuse. For legitimate visitors, check whether a shared IP, such as an office NAT, is the cause.

### Preparation failures

| Code | Meaning | Action |
| --- | --- | --- |
| `budget_exhausted` | The AI Gateway key's budget is used up | Review the usage, then top up the key deliberately in Vercel |
| `free_tier_limited`, `rate_limited` | A provider-side limit | Wait. Visitors can finish the brief manually |
| `timeout` | Two 25-second attempts both timed out | Check the provider's status. Consider changing `CONTACT_AI_MODEL` |
| `malformed_response` | The model repeatedly broke the schema | Check the logs, which contain issue codes and field paths only (never visitor text). Consider another model |
| `not_configured` | No Gateway key is set | Set `CONTACT_AI_GATEWAY_API_KEY` |

The manual path needs no AI, so visitors can always complete and send a brief while the service is on.

### Delivery failures

1. **Find the run.** Look in Vercel → Workflow → runs for `deliverContactEnquiryWorkflow`. The visitor's page polls the same `runId`.
2. **`FatalError: Contact delivery is not configured`** means `RESEND_API_KEY`, `CONTACT_DELIVERY_TO` or `CONTACT_DELIVERY_FROM` is missing. Fix it and redeploy. The visitor's brief stays in their browser, so they can retry.
3. **Resend 429 or 5xx** errors retry automatically. A permanent rejection (4xx) fails the run. Check the sending domain and the key's permissions in Resend.
4. **Duplicates** are prevented twice over: by the Idempotency-Key the browser sends, and by Resend's `Idempotency-Key: contact/<key>`. A retry with the same key never sends a second email.

### CV delivery failed

After an approval, the workflow tries to send the CV up to five times (after 5s, 15s, 30s and 30s). If that fails, it emails Dave with the subject **"[Applification] CV follow-up needs recovery for <name>"**, and the run ends as `delivery_failed`. Send the CV manually from your own mail client.

If the private CV isn't configured (`CONTACT_CV_BLOB_PATHNAME`, `CONTACT_CV_VERSION` or `BLOB_READ_WRITE_TOKEN` missing, or the blob isn't a PDF), `prepareContractCvReview` fails the CV review run. The enquiry email is still delivered, but its review link will show as unavailable.

### Review link problems

- **Expired or unavailable.** A review lasts **14 days** from the visitor's approval, and each link works once. After a decision, or once the review expires, reply to the enquirer by email instead.
- **"Already recorded" (409).** A decision was already made, for example from a double submit. No second action is taken.
- **Attachment link expired.** Links on the review page last 1 hour, and a fresh one is issued each time the page loads. Links in the email last up to 7 days. **The uploaded file itself is deleted 7 days after upload**, even though the review stays open for 14. Download the brief within the first week (audit S11).

## Routine tasks

### Update the CV

1. Upload the new PDF to the private Blob store at `CONTACT_CV_BLOB_PATHNAME`, overwriting the old file.
2. Change `CONTACT_CV_VERSION`, for example to `2026-10`, and redeploy.

Each waiting review records the CV's size and version when it starts. If you replace the PDF while reviews are pending, approving one of them fails with "The reviewed CV version is unavailable" and triggers the recovery email instead of sending a different CV. So update the CV when no reviews are pending, or send those CVs manually.

### Rotate secrets

Rotate a secret in Vercel, then redeploy. The table shows what each rotation breaks.

| Secret | Effect of rotation | When |
| --- | --- | --- |
| `CONTACT_ATTACHMENT_ACCESS_SECRET` | Attachment links already sent stop working. Visitors who uploaded a brief before the deploy must upload it again, because their upload folder no longer matches. | At any time. Prefer a quiet period. |
| `CONTACT_OWNER_REVIEW_SECRET` | **Every pending review link stops working.** Those reviews can then only expire. | When no reviews are pending, or after replying to pending enquirers by email. |
| `CONTACT_RATE_LIMIT_SECRET` | Resets the in-memory abuse counters. | At any time. |
| `RESEND_API_KEY` | Create the new key first, then revoke the old one after deploying. | At any time. |
| `CONTACT_AI_GATEWAY_API_KEY` | Give the new key a budget before switching to it. | At any time. |
| `BLOB_READ_WRITE_TOKEN` | Managed by Vercel. Reconnect the store to reissue it. | Only if it has leaked. |

### Promote the full CSP

The full allowlist in `src/lib/security-headers.ts` is sent as `Content-Security-Policy-Report-Only`. Only the baseline (`frame-ancestors`, `object-src`, `base-uri` and `form-action`) is enforced.

To promote the full policy:
1. **Check a preview.** Run a Vercel preview through [Verify a deployment](#verify-a-deployment) with the Console open. There should be no report-only violations from BotID, Analytics, the YouTube or tweet embeds, or the Vercel toolbar.
2. **Update `securityHeaders()`.** Send `contentSecurityPolicy()` as `Content-Security-Policy`, drop the Report-Only header, and update `security-headers.test.ts`.
3. **Re-verify.** Run the preview checks again with the policy enforced before promoting to production.

## Data retention

| Data | Where | Retention |
| --- | --- | --- |
| Uploaded briefs | Private Vercel Blob, under `contact/unsubmitted/<session-tag>/` | Deleted 7 days after upload by `expireContactAttachmentWorkflow` |
| Enquiry content | Dave's inbox (Resend), and Workflow run inputs | As per the mailbox, and Vercel's Workflow run retention |
| Draft in progress | The visitor's browser only | Until they leave or restart |
| AI requests | AI Gateway provider | Message text only; attachments and their metadata are never sent |

The privacy page (`/privacy`, with copy in `src/lib/content/privacy.ts`) must stay consistent with this table.

## Local development

`bun run dev` serves `https://applification.localhost` through Portless, and the contact service is enabled automatically.

What changes locally:
- The guard **skips Firewall and BotID** in development and test. It still checks the Origin, the session header and request bodies.
- Attachment folders use a fixed development key when `CONTACT_ATTACHMENT_ACCESS_SECRET` is unset.

Rules to keep:
- Preparation calls the real AI Gateway, and only when a key is set. Leave the key unset unless you mean to spend.
- **Never run production with `NODE_ENV=development`**, because that disables the Firewall and BotID checks.
