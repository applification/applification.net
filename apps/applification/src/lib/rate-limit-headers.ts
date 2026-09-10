export function rateLimitHeaders({
  policy,
  limit,
  remaining,
  windowSeconds,
  resetSeconds,
}: {
  policy: string;
  limit: number;
  remaining: number;
  windowSeconds: number;
  resetSeconds: number;
}) {
  return {
    "RateLimit-Policy": `"${policy}";q=${limit};w=${windowSeconds}`,
    RateLimit: `"${policy}";r=${remaining};t=${resetSeconds}`,
    // Compatibility with clients using the earlier HTTPAPI field names.
    "RateLimit-Limit": String(limit),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(resetSeconds),
  };
}
