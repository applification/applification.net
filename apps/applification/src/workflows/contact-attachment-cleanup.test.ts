import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ del: vi.fn() }));
vi.mock("@vercel/blob", () => ({ del: mocks.del }));

import { deleteExpiredContactAttachment } from "./contact-attachment-cleanup";

const pathname = "contact/unsubmitted/0123456789abcdef0123456789abcdef/brief-Xy12ab.pdf";

describe("expired attachment cleanup step", () => {
  beforeEach(() => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_store_secret");
    mocks.del.mockResolvedValue(undefined);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("deletes an unsubmitted upload", async () => {
    await expect(deleteExpiredContactAttachment(pathname)).resolves.toEqual({ deleted: true });
    expect(mocks.del).toHaveBeenCalledWith(pathname, { token: "vercel_blob_rw_store_secret" });
  });

  it("never deletes anything outside the unsubmitted uploads folder", async () => {
    await expect(deleteExpiredContactAttachment("contact/cv/dave-hudson.pdf")).resolves.toEqual({
      deleted: false,
    });
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("does nothing without a Blob token", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
    await expect(deleteExpiredContactAttachment(pathname)).resolves.toEqual({ deleted: false });
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("stays idempotent when the file was already removed", async () => {
    mocks.del.mockRejectedValue(new Error("not found"));
    await expect(deleteExpiredContactAttachment(pathname)).resolves.toEqual({ deleted: false });
  });
});
