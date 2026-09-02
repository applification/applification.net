import { checkBotId } from "botid/server";
import { checkRateLimit } from "@vercel/firewall";

export type ContactOperation = "prepare" | "attachment" | "deliver";

export async function guardContactRequest(request: Request, operation: ContactOperation) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [new URL(request.url).origin];
  if (process.env.CONTACT_PUBLIC_BASE_URL) {
    try { allowedOrigins.push(new URL(process.env.CONTACT_PUBLIC_BASE_URL).origin); }
    catch { return Response.json({ code: "protection_unavailable", message: "The contact service is temporarily unavailable. Please try again shortly." }, { status: 503 }); }
  }
  if (!origin || !allowedOrigins.includes(origin)) {
    return Response.json({ code: "invalid_origin", message: "Open the contact page and try again." }, { status: 403 });
  }
  const session = request.headers.get("x-contact-session");
  if (!session || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session)) {
    return Response.json({ code: "invalid_session", message: "Reload the contact page before trying again." }, { status: 400 });
  }
  // Native counters run outside individual function instances. A client session
  // is an additional fairness bucket, never a replacement for the IP bucket.
  // Local development doesn't call paid inference without an explicit API key.
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") return null;
  try {
    const ip = await checkRateLimit("contact-write", { request });
    if (ip.error) throw new Error("firewall_unavailable");
    if (ip.rateLimited) return limited();
    const visitor = await checkRateLimit("contact-write", { request, rateLimitKey: `session:${session}` });
    if (visitor.error) throw new Error("firewall_unavailable");
    if (visitor.rateLimited) return limited();
    const verification = await checkBotId({ advancedOptions: { checkLevel: "basic" } });
    if (verification.isBot || !verification.isHuman) {
      return Response.json({ code: "bot_blocked", message: "We could not verify this browser. Reload and try again, or contact Dave through LinkedIn." }, { status: 403 });
    }
    return null;
  } catch {
    // Never spend credits or store files when protection cannot be checked.
    console.warn("contact_protection_unavailable", { operation });
    return Response.json({ code: "protection_unavailable", message: "The contact service is temporarily unavailable. Your text is still here. Try again shortly or contact Dave through LinkedIn." }, { status: 503 });
  }
}

function limited() {
  return Response.json({ code: "rate_limited", message: "Too many requests. Please wait up to 15 minutes before trying again. You can continue editing your brief manually." }, { status: 429, headers: { "Retry-After": "900" } });
}

export async function readContactJson(request: Request, maxBytes = 384 * 1024): Promise<unknown> {
  const bytes = await readContactBody(request, maxBytes);
  if (!bytes) return null;
  try { return JSON.parse(new TextDecoder().decode(bytes)) as unknown; }
  catch { return null; }
}

export async function readContactBody(request: Request, maxBytes: number): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > maxBytes) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  } catch { return null; }
}
