import { contactPrepareRequestSchema } from "@/lib/contact-draft";
import { ContactPrepareError, prepareContactProposal } from "@/lib/prepare-contact";

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const checked = contactPrepareRequestSchema.safeParse(payload);

  if (!checked.success) {
    return Response.json(
      { code: "invalid_request", message: "Check the message and try again." },
      { status: 400 },
    );
  }

  try {
    const proposal = await prepareContactProposal(checked.data);
    return Response.json({ proposal });
  } catch (error) {
    if (error instanceof ContactPrepareError) {
      const status =
        error.code === "rate_limited"
          ? 429
          : error.code === "malformed_response"
            ? 502
            : 503;

      return Response.json(
        { code: error.code, message: error.message },
        { status },
      );
    }

    return Response.json(
      {
        code: "provider_error",
        message: "The assistant could not prepare the brief. Retry when you are ready.",
      },
      { status: 503 },
    );
  }
}
