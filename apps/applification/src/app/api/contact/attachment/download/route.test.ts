import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAttachmentAccessToken } from "@/lib/contact-attachment-access";

const mocks = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@vercel/blob", () => ({ get: mocks.get }));

import { GET } from "./route";

const secret = "attachment-access-secret-for-tests";
const pathname = "contact/unsubmitted/0123456789abcdef0123456789abcdef/brief-Xy12ab.pdf";
const fileBytes = new TextEncoder().encode("%PDF-1.7 private brief");

function token(
  overrides: Partial<Parameters<typeof createAttachmentAccessToken>[0]> = {},
  signingSecret = secret,
) {
  return createAttachmentAccessToken(
    {
      pathname,
      filename: "brief.pdf",
      contentType: "application/pdf",
      expiresAt: Date.now() + 60_000,
      ...overrides,
    },
    signingSecret,
  );
}

function download(accessToken?: string) {
  const url = new URL("https://example.com/api/contact/attachment/download");
  if (accessToken !== undefined) url.searchParams.set("token", accessToken);
  return GET(new Request(url));
}

function storedBlob(contentType = "application/pdf", statusCode = 200) {
  return {
    statusCode,
    stream: new Response(fileBytes).body,
    blob: { pathname, contentType, size: fileBytes.length },
  };
}

describe("private attachment download", () => {
  beforeEach(() => {
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", secret);
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_store_secret");
    mocks.get.mockResolvedValue(storedBlob());
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("streams the file as a private, non-sniffable download", async () => {
    const response = await download(token());

    expect(response.status).toBe(200);
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(fileBytes);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toBe("attachment; filename*=UTF-8''brief.pdf");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.get).toHaveBeenCalledWith(pathname, {
      access: "private",
      token: "vercel_blob_rw_store_secret",
      useCache: false,
    });
  });

  it("percent-encodes non-ASCII and space characters in the filename", async () => {
    const docxType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    mocks.get.mockResolvedValue(storedBlob(docxType));
    const response = await download(token({ filename: "Café brief – v2.docx", contentType: docxType }));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(docxType);
    const disposition = response.headers.get("content-disposition") ?? "";
    expect(disposition).toBe("attachment; filename*=UTF-8''Caf%C3%A9%20brief%20%E2%80%93%20v2.docx");
    // The header itself must be plain ASCII.
    expect(disposition).toMatch(/^[\x20-\x7e]+$/);
  });

  it("refuses a forged or tampered link", async () => {
    const forged = await download(token({}, "some-other-secret-value-1234"));
    expect(forged.status).toBe(403);
    expect((await forged.json()).code).toBe("link_expired");

    const [body, signature] = token().split(".");
    const tamperedBody = Buffer.from(
      JSON.stringify({ ...JSON.parse(Buffer.from(body!, "base64url").toString()), filename: "other.pdf" }),
    ).toString("base64url");
    const tampered = await download(`${tamperedBody}.${signature}`);
    expect(tampered.status).toBe(403);

    const garbage = await download("not-a-token");
    expect(garbage.status).toBe(403);
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("refuses an expired link", async () => {
    const response = await download(token({ expiresAt: Date.now() - 1 }));

    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe("link_expired");
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("answers not_found when the link or configuration is missing", async () => {
    const noToken = await download();
    expect(noToken.status).toBe(404);
    expect((await noToken.json()).code).toBe("not_found");

    vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
    expect((await download(token())).status).toBe(404);

    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_store_secret");
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", undefined);
    expect((await download(token())).status).toBe(404);
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("answers not_found when the stored type differs from the signed type", async () => {
    mocks.get.mockResolvedValue(storedBlob("text/html"));
    const response = await download(token());

    expect(response.status).toBe(404);
    expect((await response.json()).code).toBe("not_found");
  });

  it("answers not_found when the blob is gone, unchanged or unreadable", async () => {
    mocks.get.mockResolvedValueOnce(null);
    expect((await download(token())).status).toBe(404);

    mocks.get.mockResolvedValueOnce(storedBlob("application/pdf", 304));
    expect((await download(token())).status).toBe(404);

    mocks.get.mockRejectedValueOnce(new Error("blob down"));
    expect((await download(token())).status).toBe(404);
  });
});
