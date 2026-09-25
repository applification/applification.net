type SecurityHeaderOptions = {
  /** `next dev` needs eval for React debugging and a websocket for HMR. */
  development?: boolean;
  /** Vercel preview deployments load the toolbar and comments from vercel.live. */
  preview?: boolean;
};

// Always enforced: no third-party framing, plugins, <base> hijacking or
// cross-origin form posts. BotID serves its challenge from same-origin proxy
// paths that allow same-origin framing, so framing is 'self', not 'none'.
export function enforcedContentSecurityPolicy({ development = false }: SecurityHeaderOptions = {}) {
  return [
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

// The full allowlist ships as Report-Only until it has been checked against a
// Vercel preview with BotID, Analytics and the embeds (see
// docs/runbooks/contact-workflow.md). Pages are statically generated, so
// per-request nonces aren't available and inline scripts stay allowed.
export function contentSecurityPolicy({ development = false, preview = false }: SecurityHeaderOptions = {}) {
  const vercelLive = preview ? ["https://vercel.live"] : [];
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(development ? ["'unsafe-eval'"] : []),
      "https://platform.twitter.com",
      ...vercelLive,
    ],
    "style-src": ["'self'", "'unsafe-inline'", ...vercelLive],
    // Articles and link previews may show remote https images.
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "media-src": ["'self'"],
    "font-src": ["'self'", "data:", ...vercelLive],
    "connect-src": ["'self'", ...(development ? ["ws:", "wss:"] : []), ...vercelLive],
    "frame-src": [
      "'self'",
      "https://www.youtube-nocookie.com",
      "https://platform.twitter.com",
      "https://syndication.twitter.com",
      ...vercelLive,
    ],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
  };
  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!development) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function securityHeaders(options: SecurityHeaderOptions = {}) {
  return [
    { key: "Content-Security-Policy", value: enforcedContentSecurityPolicy(options) },
    { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy(options) },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    // Vercel adds HSTS at the edge; sending it here also covers other hosts.
    ...(options.development
      ? []
      : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
  ];
}
