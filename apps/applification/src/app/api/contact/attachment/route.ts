import { guardContactRequest, readContactBody, readContactJson } from "@/lib/contact-request-guard";
import { del, put } from "@vercel/blob";
import { start } from "workflow/api";
import {
  ContactAttachmentError,
  contactAttachmentSchema,
  deleteContactAttachmentSchema,
  validateContactAttachment,
} from "@/lib/contact-attachment";
import { expireContactAttachmentWorkflow } from "@/workflows/contact-attachment-cleanup";

export async function POST(request: Request) {
  const blocked = await guardContactRequest(request, "attachment");
  if (blocked) return blocked;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4.25 * 1_024 * 1_024) {
    return Response.json(
      { code: "size", message: "The contract brief must be 4 MB or smaller." },
      { status: 413 },
    );
  }

  const bytes = await readContactBody(request, 4.25 * 1_024 * 1_024);
  if (!bytes) {
    return Response.json({ code: "size", message: "The contract brief could not be read. Choose a file of 4 MB or smaller." }, { status: 413 });
  }
  const form = await new Response(bytes, { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { code: "invalid_request", message: "Choose one PDF or DOCX contract brief." },
      { status: 400 },
    );
  }

  try {
    const document = await validateContactAttachment(file);
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return Response.json(
        {
          code: "storage_unavailable",
          message: "Private document storage is not configured. You can use an HTTPS brief link instead.",
        },
        { status: 503 },
      );
    }

    const blob = await put(`contact/unsubmitted/${document.filename}`, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: document.contentType,
      token,
    });
    const attachment = contactAttachmentSchema.parse({
      pathname: blob.pathname,
      ...document,
    });

    try {
      await start(expireContactAttachmentWorkflow, [attachment.pathname]);
    } catch {
      await del(attachment.pathname, { token }).catch(() => undefined);
      return Response.json(
        {
          code: "cleanup_unavailable",
          message: "The document could not be given a safe expiry. Nothing was attached.",
        },
        { status: 503 },
      );
    }

    return Response.json({ attachment });
  } catch (error) {
    if (error instanceof ContactAttachmentError) {
      return Response.json(
        { code: error.code, message: error.message },
        { status: error.code === "size" ? 413 : 400 },
      );
    }

    return Response.json(
      {
        code: "storage_error",
        message: "The document could not be stored privately. Nothing was attached.",
      },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  const blocked = await guardContactRequest(request, "attachment");
  if (blocked) return blocked;
  const payload: unknown = await readContactJson(request);
  const checked = deleteContactAttachmentSchema.safeParse(payload);

  if (!checked.success) {
    return Response.json({ code: "invalid_request" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return Response.json({ code: "storage_unavailable" }, { status: 503 });
  }

  try {
    await del(checked.data.pathname, { token });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ code: "storage_error" }, { status: 503 });
  }
}
