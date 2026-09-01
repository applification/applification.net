import { describe, expect, it } from "vitest";
import {
  ContactAttachmentError,
  maxContactAttachmentBytes,
  validateContactAttachment,
} from "./contact-attachment";

const pdfType = "application/pdf";
const docxType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

describe("contract brief validation", () => {
  it("accepts a declared PDF with a PDF signature", async () => {
    const file = new File([new TextEncoder().encode("%PDF-1.7\nbrief")], "Role brief.pdf", {
      type: pdfType,
    });

    await expect(validateContactAttachment(file)).resolves.toEqual({
      filename: "Role brief.pdf",
      contentType: pdfType,
      size: file.size,
    });
  });

  it("accepts a DOCX package with the required document entries", async () => {
    const packageMarker = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const file = new File(
      [packageMarker, "[Content_Types].xml word/document.xml"],
      "Role brief.docx",
      { type: docxType },
    );

    await expect(validateContactAttachment(file)).resolves.toMatchObject({
      filename: "Role brief.docx",
      contentType: docxType,
    });
  });

  it("rejects mismatched declarations, signatures and filenames", async () => {
    await expect(
      validateContactAttachment(new File(["%PDF-1.7"], "brief.docx", { type: docxType })),
    ).rejects.toMatchObject({ code: "filename" } satisfies Partial<ContactAttachmentError>);

    await expect(
      validateContactAttachment(new File(["not a PDF"], "brief.pdf", { type: pdfType })),
    ).rejects.toMatchObject({ code: "signature" } satisfies Partial<ContactAttachmentError>);

    await expect(
      validateContactAttachment(new File(["%PDF-1.7"], "../brief.pdf", { type: pdfType })),
    ).rejects.toMatchObject({ code: "filename" } satisfies Partial<ContactAttachmentError>);
  });

  it("rejects documents over the documented limit", async () => {
    const oversized = new File([new Uint8Array(maxContactAttachmentBytes + 1)], "brief.pdf", {
      type: pdfType,
    });

    await expect(validateContactAttachment(oversized)).rejects.toMatchObject({
      code: "size",
    } satisfies Partial<ContactAttachmentError>);
  });
});
