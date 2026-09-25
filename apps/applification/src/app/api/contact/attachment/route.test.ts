import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contactAttachmentOwnerFolder } from "@/lib/contact-attachment-owner";

const mocks = vi.hoisted(() => ({
  put: vi.fn(),
  del: vi.fn(),
  start: vi.fn(),
  checkRateLimit: vi.fn(),
  checkBotId: vi.fn(),
  expiryWorkflow: { workflowId: "expire-contact-attachment" },
}));
vi.mock("@vercel/blob", () => ({ put: mocks.put, del: mocks.del }));
vi.mock("workflow/api", () => ({ start: mocks.start }));
vi.mock("@vercel/firewall", () => ({ checkRateLimit: mocks.checkRateLimit }));
vi.mock("botid/server", () => ({ checkBotId: mocks.checkBotId }));
vi.mock("@/workflows/contact-attachment-cleanup", () => ({
  expireContactAttachmentWorkflow: mocks.expiryWorkflow,
}));

import { DELETE, POST } from "./route";

const session = "ea7735e0-5e9c-4ea0-9486-183223a26700";
const otherSession = "0b8a3c1e-2f4d-4a6b-9c8d-7e6f5a4b3c2d";
const ownerSecret = "attachment-owner-secret-for-tests";
const pdfBytes = new TextEncoder().encode("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF");
const maxUploadBytes = 4.25 * 1_024 * 1_024;

function ownedPath(filename: string, owner = session) {
  return `${contactAttachmentOwnerFolder(owner, ownerSecret)}/${filename}`;
}

function upload(
  body: BodyInit | null,
  headers: Record<string, string> = {},
) {
  return POST(
    new Request("https://example.com/api/contact/attachment", {
      method: "POST",
      headers: {
        origin: "https://example.com",
        "x-contact-session": session,
        ...headers,
      },
      body,
    }),
  );
}

function uploadFile(file: File, headers: Record<string, string> = {}) {
  const form = new FormData();
  form.set("file", file);
  return upload(form, headers);
}

function pdf(name = "brief.pdf", type = "application/pdf", bytes: Uint8Array<ArrayBuffer> = pdfBytes) {
  return new File([bytes], name, { type });
}

function remove(body: unknown, headers: Record<string, string> = {}) {
  return DELETE(
    new Request("https://example.com/api/contact/attachment", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "x-contact-session": session,
        ...headers,
      },
      body: JSON.stringify(body),
    }),
  );
}

describe("private attachment upload", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", undefined);
    vi.stubEnv("CONTACT_PUBLIC_BASE_URL", undefined);
    vi.stubEnv("PORTLESS_TAILSCALE_URL", undefined);
    vi.stubEnv("PORTLESS_URL", undefined);
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_store_secret");
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", ownerSecret);
    mocks.put.mockImplementation(async (pathname: string) => ({
      pathname: pathname.replace(/\.pdf$/, "-Xy12ab.pdf"),
    }));
    mocks.del.mockResolvedValue(undefined);
    mocks.start.mockResolvedValue({ runId: "wrun_expiry" });
    mocks.checkRateLimit.mockResolvedValue({ rateLimited: false });
    mocks.checkBotId.mockResolvedValue({ isBot: false, isHuman: true });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("stores a valid PDF privately in the session's folder and schedules its expiry", async () => {
    const response = await uploadFile(pdf());

    expect(response.status).toBe(200);
    const expectedPathname = ownedPath("brief-Xy12ab.pdf");
    expect(await response.json()).toEqual({
      attachment: {
        pathname: expectedPathname,
        filename: "brief.pdf",
        contentType: "application/pdf",
        size: pdfBytes.length,
      },
    });
    expect(mocks.put).toHaveBeenCalledOnce();
    const [pathname, file, options] = mocks.put.mock.calls[0]!;
    expect(pathname).toBe(ownedPath("brief.pdf"));
    expect(pathname).not.toBe(ownedPath("brief.pdf", otherSession));
    expect(file).toBeInstanceOf(File);
    expect(options).toEqual({
      access: "private",
      addRandomSuffix: true,
      contentType: "application/pdf",
      token: "vercel_blob_rw_store_secret",
    });
    expect(mocks.start).toHaveBeenCalledWith(mocks.expiryWorkflow, [expectedPathname]);
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("stores a DOCX with its detected content type", async () => {
    const docx = new TextEncoder().encode("PK\u0003\u0004[Content_Types].xml word/document.xml");
    const type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    mocks.put.mockImplementation(async (pathname: string) => ({ pathname }));

    const response = await uploadFile(new File([docx], "Brief.docx", { type }));

    expect(response.status).toBe(200);
    expect((await response.json()).attachment.contentType).toBe(type);
    expect(mocks.put.mock.calls[0]![2].contentType).toBe(type);
  });

  it("refuses a declared Content-Length over the limit before reading the body", async () => {
    const response = await upload("x", { "content-length": String(maxUploadBytes + 1) });

    expect(response.status).toBe(413);
    expect((await response.json()).code).toBe("size");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("refuses a body over the limit even without a Content-Length", async () => {
    const response = await uploadFile(pdf("big.pdf", "application/pdf", new Uint8Array(maxUploadBytes + 1)));

    expect(response.status).toBe(413);
    expect((await response.json()).code).toBe("size");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("refuses a file over 4 MB that still fits the transport limit", async () => {
    const bytes = new Uint8Array(4 * 1_024 * 1_024 + 1);
    bytes.set(pdfBytes);
    const response = await uploadFile(pdf("large.pdf", "application/pdf", bytes));

    expect(response.status).toBe(413);
    expect((await response.json()).code).toBe("size");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("rejects a request without a file field", async () => {
    const form = new FormData();
    form.set("file", "not a file");
    const noFile = await upload(form);
    expect(noFile.status).toBe(400);
    expect((await noFile.json()).code).toBe("invalid_request");

    const notMultipart = await upload("plain text", { "content-type": "text/plain" });
    expect(notMultipart.status).toBe(400);
    expect((await notMultipart.json()).code).toBe("invalid_request");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it.each([
    ["an unrecognised signature", pdf("brief.pdf", "application/pdf", new TextEncoder().encode("hello")), "signature"],
    ["an extension that doesn't match the contents", pdf("brief.docx"), "filename"],
    ["an unsupported extension", pdf("brief.exe"), "filename"],
    ["a declared type that doesn't match the contents", pdf("brief.pdf", "text/plain"), "type"],
    ["an empty file", pdf("brief.pdf", "application/pdf", new Uint8Array()), "empty"],
  ])("rejects %s with the validation code", async (_label, file, code) => {
    const response = await uploadFile(file);

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe(code);
    expect(mocks.put).not.toHaveBeenCalled();
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("reports storage as unavailable without a Blob token", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
    const response = await uploadFile(pdf());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("storage_unavailable");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("fails closed in production without a strong owner secret", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", "true");
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", "too-short");

    const response = await uploadFile(pdf());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("storage_unavailable");
    expect(mocks.put).not.toHaveBeenCalled();
    // The production guard ran its Firewall and BotID checks first.
    expect(mocks.checkRateLimit).toHaveBeenCalled();
    expect(mocks.checkBotId).toHaveBeenCalledOnce();
  });

  it("uploads in production once the owner secret is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", "true");

    const response = await uploadFile(pdf());

    expect(response.status).toBe(200);
    expect(mocks.put.mock.calls[0]![0]).toBe(ownedPath("brief.pdf"));
  });

  it("deletes the stored blob when its expiry can't be scheduled", async () => {
    mocks.start.mockRejectedValue(new Error("workflow down"));
    const response = await uploadFile(pdf());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("cleanup_unavailable");
    expect(mocks.del).toHaveBeenCalledWith(ownedPath("brief-Xy12ab.pdf"), {
      token: "vercel_blob_rw_store_secret",
    });
  });

  it("still reports cleanup_unavailable if the compensating delete also fails", async () => {
    mocks.start.mockRejectedValue(new Error("workflow down"));
    mocks.del.mockRejectedValue(new Error("blob down"));
    const response = await uploadFile(pdf());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("cleanup_unavailable");
  });

  it("reports a storage error when the upload fails", async () => {
    mocks.put.mockRejectedValue(new Error("blob down"));
    const response = await uploadFile(pdf());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("storage_error");
    expect(mocks.start).not.toHaveBeenCalled();
  });

  describe("request guard", () => {
    it("rejects another origin", async () => {
      const response = await uploadFile(pdf(), { origin: "https://attacker.test" });
      expect(response.status).toBe(403);
      expect((await response.json()).code).toBe("invalid_origin");
      expect(mocks.put).not.toHaveBeenCalled();
    });

    it("accepts the configured public origin", async () => {
      vi.stubEnv("CONTACT_PUBLIC_BASE_URL", "https://applification.test");
      const response = await uploadFile(pdf(), { origin: "https://applification.test" });
      expect(response.status).toBe(200);
    });

    it("rejects a missing or malformed session", async () => {
      const missing = await POST(
        new Request("https://example.com/api/contact/attachment", {
          method: "POST",
          headers: { origin: "https://example.com" },
          body: new FormData(),
        }),
      );
      expect(missing.status).toBe(400);
      expect((await missing.json()).code).toBe("invalid_session");

      const malformed = await uploadFile(pdf(), { "x-contact-session": "not-a-uuid" });
      expect(malformed.status).toBe(400);
      expect(mocks.put).not.toHaveBeenCalled();
    });

    it("stops uploads and deletes while the kill switch is off", async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTACT_WORKFLOW_ENABLED", "false");

      const uploaded = await uploadFile(pdf());
      expect(uploaded.status).toBe(503);
      expect((await uploaded.json()).code).toBe("contact_unavailable");

      const removed = await remove({ pathname: ownedPath("brief-Xy12ab.pdf") });
      expect(removed.status).toBe(503);
      expect((await removed.json()).code).toBe("contact_unavailable");

      expect(mocks.put).not.toHaveBeenCalled();
      expect(mocks.del).not.toHaveBeenCalled();
      expect(mocks.checkRateLimit).not.toHaveBeenCalled();
    });

    it("stops at the production rate limit", async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTACT_WORKFLOW_ENABLED", "true");
      mocks.checkRateLimit.mockResolvedValue({ rateLimited: true });

      const response = await uploadFile(pdf());
      expect(response.status).toBe(429);
      expect(mocks.put).not.toHaveBeenCalled();
    });
  });
});

describe("private attachment removal", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", undefined);
    vi.stubEnv("CONTACT_PUBLIC_BASE_URL", undefined);
    vi.stubEnv("PORTLESS_TAILSCALE_URL", undefined);
    vi.stubEnv("PORTLESS_URL", undefined);
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_store_secret");
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", ownerSecret);
    mocks.del.mockResolvedValue(undefined);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("lets the uploading session delete its own file", async () => {
    const pathname = ownedPath("brief-Xy12ab.pdf");
    const response = await remove({ pathname });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(mocks.del).toHaveBeenCalledWith(pathname, { token: "vercel_blob_rw_store_secret" });
  });

  it("answers not_found for another session's file without deleting it", async () => {
    const response = await remove({ pathname: ownedPath("brief-Xy12ab.pdf", otherSession) });

    expect(response.status).toBe(404);
    expect((await response.json()).code).toBe("not_found");
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("treats a folder signed with a different secret as someone else's", async () => {
    const forged = `${contactAttachmentOwnerFolder(session, "a-different-owner-secret-value")}/brief.pdf`;
    const response = await remove({ pathname: forged });

    expect(response.status).toBe(404);
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it.each([
    ["path traversal", `${contactAttachmentOwnerFolder(session, ownerSecret)}/../brief.pdf`],
    ["a nested path", `${contactAttachmentOwnerFolder(session, ownerSecret)}/nested/brief.pdf`],
    ["a legacy flat path", "contact/unsubmitted/brief.pdf"],
    ["the private CV", "contact/cv/dave-hudson.pdf"],
    ["an unsupported extension", ownedPath("brief.exe")],
  ])("rejects %s", async (_label, pathname) => {
    const response = await remove({ pathname });

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_request");
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("rejects extra fields and malformed bodies", async () => {
    const extra = await remove({ pathname: ownedPath("brief.pdf"), token: "x" });
    expect(extra.status).toBe(400);
    const empty = await remove(null);
    expect(empty.status).toBe(400);
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("reports storage as unavailable without a Blob token", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
    const response = await remove({ pathname: ownedPath("brief.pdf") });

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("storage_unavailable");
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("reports a storage error when the delete fails", async () => {
    mocks.del.mockRejectedValue(new Error("blob down"));
    const response = await remove({ pathname: ownedPath("brief.pdf") });

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("storage_error");
  });

  it("rejects another origin before touching storage", async () => {
    const response = await remove({ pathname: ownedPath("brief.pdf") }, { origin: "https://attacker.test" });

    expect(response.status).toBe(403);
    expect(mocks.del).not.toHaveBeenCalled();
  });
});
