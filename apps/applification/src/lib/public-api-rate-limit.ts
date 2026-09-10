import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { publicApiLimit, publicApiWindowSeconds } from "./public-api-policy";
import { rateLimitHeaders } from "./rate-limit-headers";

// This is an instance-local courtesy limit for free public reads. Contact
// protection continues to use Vercel's independent, regional firewall counters.
export function createPublicApiRateLimiter({
  limit = publicApiLimit,
  windowSeconds = publicApiWindowSeconds,
  maxClients = 10_000,
} = {}) {
  const counts = new Map<string, number>();
  let currentWindow = -1;
  let overflowCount = 0;

  return (request: Request, now = Date.now()) => {
    const windowMs = windowSeconds * 1000;
    const window = Math.floor(now / windowMs);
    if (window !== currentWindow) {
      counts.clear();
      overflowCount = 0;
      currentWindow = window;
    }

    // Vercel overwrites x-vercel-forwarded-for. Other hosts must overwrite
    // x-forwarded-for at their trusted ingress, never append untrusted input.
    const forwarded = request.headers.get(
      process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : "x-forwarded-for",
    );
    const address = forwarded?.split(",")[0]?.trim() ?? "";
    const key = createHash("sha256")
      .update(isIP(address) ? address : "unknown-client")
      .digest("hex");
    // Bound memory without evicting active clients and restoring their quota.
    // New clients share a fallback bucket if this window's table is full.
    const overflow = !counts.has(key) && counts.size >= maxClients;
    let used = overflow ? overflowCount : (counts.get(key) ?? 0);
    const allowed = used < limit;
    if (allowed && request.method !== "OPTIONS") {
      used += 1;
      if (overflow) overflowCount = used;
      else counts.set(key, used);
    }

    const resetSeconds = Math.ceil(((window + 1) * windowMs - now) / 1000);
    return {
      allowed: request.method === "OPTIONS" || allowed,
      resetSeconds,
      headers: rateLimitHeaders({
        policy: "public-read",
        limit,
        remaining: Math.max(0, limit - used),
        windowSeconds,
        resetSeconds,
      }),
    };
  };
}

// Route bundles in one runtime share the same counters, including during HMR.
const runtime = globalThis as typeof globalThis & {
  applificationPublicApiLimiter?: ReturnType<typeof createPublicApiRateLimiter>;
};
export const checkPublicApiRateLimit =
  (runtime.applificationPublicApiLimiter ??= createPublicApiRateLimiter());
