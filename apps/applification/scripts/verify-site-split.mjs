// Run against the real Next server: node scripts/verify-site-split.mjs [base-url].
// Host headers exercise production hostname selection without changing DNS.
import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";

const base = process.argv[2] ?? "http://localhost:3333";
let checks = 0;
async function request(host, path) {
  const url = new URL(`${base}${path}`);
  const transport = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = transport.get(
      url,
      {
        headers: {
          Host: host,
          "User-Agent": "Googlebot",
          "x-applification-site": "spoofed",
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const headers = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (Array.isArray(value))
              value.forEach((item) => headers.append(key, item));
            else if (value !== undefined) headers.set(key, value);
          }
          resolve(
            new Response(Buffer.concat(chunks), {
              status: res.statusCode,
              headers,
            }),
          );
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15000, () =>
      req.destroy(new Error(`Timed out: ${host}${path}`)),
    );
  });
}
async function html(host, path = "/") {
  const response = await request(host, path);
  assert.equal(response.status, 200, `${host}${path}`);
  return response.text();
}
function contains(body, value, label) {
  assert.ok(body.includes(value), label ?? value);
  checks += 1;
}

const business = await html("applification.net");
contains(business, "MCP integrations &amp; MCP Apps");
contains(business, 'rel="canonical" href="https://applification.net"');
contains(business, 'content="Applification"');
contains(business, 'href="/contact?route=general"');
contains(business, "Commercial production work".toLowerCase());
const profile = await html("dave.applification.net");
contains(profile, "Dave Hudson | Contract frontend &amp; product engineer");
contains(profile, 'rel="canonical" href="https://dave.applification.net"');
contains(profile, 'content="Dave Hudson"');
contains(profile, 'href="/contact?route=contract"');
contains(profile, "/cv/Dave-Hudson-CV.pdf");
assert.ok(!profile.includes("Illustrative workflows"));
checks += 1;
const alias = await request("www.applification.net", "/");
assert.equal(alias.status, 200);
checks += 1;
for (const path of [
  "/about",
  "/client-work",
  "/client-work/eruptiv",
  "/client-work/peppy-health",
  "/writing",
]) {
  const page = await html("dave.applification.net", path);
  contains(
    page,
    `rel="canonical" href="https://dave.applification.net${path}"`,
  );
  contains(page, 'property="og:site_name" content="Dave Hudson"');
}
contains(
  await html("dave.applification.net", "/privacy"),
  'rel="canonical" href="https://applification.net/privacy"',
);
for (const [host, path, destination] of [
  [
    "applification.net",
    "/about?route=contract",
    "https://dave.applification.net/about?route=contract",
  ],
  [
    "www.applification.net",
    "/client-work/eruptiv",
    "https://dave.applification.net/client-work/eruptiv",
  ],
  [
    "applification.net",
    "/agent/writing",
    "https://dave.applification.net/agent/writing",
  ],
  [
    "applification.net",
    "/markdown/about",
    "https://dave.applification.net/markdown/about",
  ],
  [
    "dave.applification.net",
    "/products/loami?ref=cv",
    "https://applification.net/products/loami?ref=cv",
  ],
  [
    "dave.applification.net",
    "/markdown/products/contexture",
    "https://applification.net/markdown/products/contexture",
  ],
]) {
  const response = await request(host, path);
  assert.equal(response.status, 308, path);
  assert.equal(response.headers.get("location"), destination);
  checks += 2;
}
for (const host of ["applification.net", "dave.applification.net"]) {
  const logically = await html(host, "/client-work/logically");
  contains(
    logically,
    'rel="canonical" href="https://applification.net/client-work/logically"',
  );
  const robots = await html(host, "/robots.txt");
  contains(robots, `Sitemap: https://${host}/sitemap.xml`);
  const sitemap = await html(host, "/sitemap.xml");
  contains(sitemap, `<loc>https://${host}</loc>`);
  if (host === "applification.net") {
    contains(sitemap, "/products/contexture");
    assert.ok(!sitemap.includes("/writing/") && !sitemap.includes("/about"));
    checks += 1;
  } else {
    contains(sitemap, "/client-work/eruptiv");
    assert.ok(
      !sitemap.includes("/products/") &&
        !sitemap.includes("/client-work/logically"),
    );
    checks += 1;
  }
  const markdown = await html(host, "/markdown");
  contains(markdown, `Source: https://${host}/`);
  contains(
    markdown,
    host === "applification.net" ? "Scoped delivery" : "Download CV (PDF)",
  );
  const agent = await html(host, "/agent");
  contains(
    agent,
    host === "applification.net" ? "Your systems and data" : "Dave Hudson",
  );
}
const cv = await request("dave.applification.net", "/cv/Dave-Hudson-CV.pdf");
assert.equal(cv.status, 200);
assert.match(cv.headers.get("content-type") ?? "", /application\/pdf/);
assert.equal(
  Buffer.from(await cv.arrayBuffer())
    .subarray(0, 4)
    .toString(),
  "%PDF",
);
checks += 3;
const catalog = await (
  await request("applification.net", "/api/v1/catalog?section=profile")
).json();
assert.equal(catalog.data.profile.url, "https://dave.applification.net");
assert.equal(catalog.data.profile.businessUrl, "https://applification.net");
checks += 2;
for (const [host, title, name] of [
  ["applification.net", "Discuss your integration.", "Applification"],
  ["dave.applification.net", "Tell me about the contract.", "Dave Hudson"],
]) {
  const contact = await html(host, "/contact");
  contains(contact, title);
  contains(contact, `property="og:site_name" content="${name}"`);
}
const socialImages = [];
for (const host of ["applification.net", "dave.applification.net"]) {
  const response = await request(host, "/opengraph-image");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /image\/png/);
  socialImages.push(Buffer.from(await response.arrayBuffer()));
  checks += 2;
}
assert.ok(
  !socialImages[0].equals(socialImages[1]),
  "social images reflect each identity",
);
checks += 1;
console.log(
  `PASS: ${checks} assertions against ${base}: both host identities, metadata, migration redirects, sitemaps, robots, Agent/Markdown, catalog, CV download and contact entry points.`,
);
