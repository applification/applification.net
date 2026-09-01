import { del } from "@vercel/blob";
import { sleep } from "workflow";

export async function expireContactAttachmentWorkflow(pathname: string) {
  "use workflow";

  await sleep("7d");
  await deleteExpiredContactAttachment(pathname);
}

export async function deleteExpiredContactAttachment(pathname: string) {
  "use step";

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || !pathname.startsWith("contact/unsubmitted/")) {
    return { deleted: false };
  }

  try {
    await del(pathname, { token });
    return { deleted: true };
  } catch {
    // Removal and replacement may already have deleted it; expiry stays idempotent.
    return { deleted: false };
  }
}
