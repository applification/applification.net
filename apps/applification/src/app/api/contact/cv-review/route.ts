import { z } from "zod";
import { contactCvDecisionHook } from "@/workflows/contact-cv-decision-gate";
import { loadOwnerCvReview } from "@/lib/contact-owner-review";

const ownerDecisionSchema = z
  .object({
    capability: z.string().min(1).max(8_192),
    decision: z.enum(["approve", "decline"]),
    confirm: z.string().optional(),
  })
  .strict();

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const checked = ownerDecisionSchema.safeParse(
    form
      ? {
          capability: form.get("capability"),
          decision: form.get("decision"),
          confirm: form.get("confirm") ?? undefined,
        }
      : null,
  );
  if (!checked.success || (checked.data.decision === "approve" && checked.data.confirm !== "yes")) {
    return Response.json({ message: "Confirm the exact CV decision." }, { status: 400 });
  }

  const loaded = await loadOwnerCvReview(checked.data.capability);
  if (!loaded) {
    return Response.json(
      { message: "This review capability is expired, invalid or already used." },
      { status: 410 },
    );
  }

  try {
    await contactCvDecisionHook.resume(loaded.hookToken, {
      decision: checked.data.decision,
      decidedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      { message: "This review decision was already recorded. No second action was taken." },
      { status: 409 },
    );
  }

  const target = new URL("/contact/review/complete", request.url);
  target.searchParams.set("decision", checked.data.decision);
  return Response.redirect(target, 303);
}
