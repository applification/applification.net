import { z } from "zod";

export const maxContactAttachmentBytes = 4 * 1_024 * 1_024;

export const contactAttachmentSchema = z
  .object({
    pathname: z.string().min(1).max(1_024),
    filename: z.string().min(1).max(120),
    contentType: z.enum([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
    size: z.number().int().positive().max(maxContactAttachmentBytes),
  })
  .strict();

export const deleteContactAttachmentSchema = z
  .object({
    pathname: z.string().startsWith("contact/unsubmitted/").max(1_024),
  })
  .strict();

export class ContactAttachmentError extends Error {
  constructor(
    public readonly code:
      | "empty"
      | "filename"
      | "signature"
      | "size"
      | "type",
    message: string,
  ) {
    super(message);
  }
}

export async function validateContactAttachment(file: File) {
  if (file.size === 0) {
    throw new ContactAttachmentError("empty", "Choose a non-empty PDF or DOCX document.");
  }

  if (file.size > maxContactAttachmentBytes) {
    throw new ContactAttachmentError("size", "The contract brief must be 4 MB or smaller.");
  }

  if (!isSafeFilename(file.name)) {
    throw new ContactAttachmentError(
      "filename",
      "Use a simple PDF or DOCX filename without folders or special control characters.",
    );
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const actualType = detectDocumentType(bytes);

  if (!actualType) {
    throw new ContactAttachmentError(
      "signature",
      "The selected file is not a recognisable PDF or DOCX document.",
    );
  }

  const expectedExtension = actualType === "application/pdf" ? "pdf" : "docx";
  if (extension !== expectedExtension) {
    throw new ContactAttachmentError(
      "filename",
      `The filename extension does not match the ${expectedExtension.toUpperCase()} document.`,
    );
  }

  if (file.type !== actualType) {
    throw new ContactAttachmentError(
      "type",
      "The document's declared type does not match its contents.",
    );
  }

  return {
    filename: file.name,
    contentType: actualType,
    size: file.size,
  } as const;
}

function detectDocumentType(bytes: Uint8Array) {
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return "application/pdf" as const;
  }

  const zipSignature =
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08));

  if (zipSignature) {
    const packageNames = new TextDecoder("latin1").decode(bytes);
    if (
      packageNames.includes("[Content_Types].xml") &&
      packageNames.includes("word/document.xml")
    ) {
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const;
    }
  }

  return null;
}

function isSafeFilename(filename: string) {
  return (
    filename.length <= 120 &&
    filename === filename.trim() &&
    !filename.includes("/") &&
    !filename.includes("\\") &&
    !/[\u0000-\u001f\u007f]/.test(filename) &&
    /^[\p{L}\p{N} ._()\-]+\.(pdf|docx)$/iu.test(filename)
  );
}
