import { get } from "@vercel/blob";
import { verifyAttachmentAccessToken } from "@/lib/contact-attachment-access";

export async function GET(request: Request) {
  const accessToken = new URL(request.url).searchParams.get("token");
  const secret = process.env.CONTACT_ATTACHMENT_ACCESS_SECRET;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!accessToken || !secret || !blobToken) {
    return notFound();
  }

  const access = verifyAttachmentAccessToken(accessToken, secret);
  if (!access) {
    return Response.json(
      { code: "link_expired", message: "This private document link is invalid or has expired." },
      { status: 403 },
    );
  }

  try {
    const result = await get(access.pathname, {
      access: "private",
      token: blobToken,
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || result.blob.contentType !== access.contentType) {
      return notFound();
    }

    return new Response(result.stream, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(access.filename)}`,
        "Content-Type": access.contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}

function notFound() {
  return Response.json(
    { code: "not_found", message: "No private document matches this link." },
    { status: 404 },
  );
}
