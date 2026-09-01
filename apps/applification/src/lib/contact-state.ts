import type { ContactDraft } from "./contact-draft";
import { getMissingContactFields } from "./contact-draft";

export type ContactWorkflowState =
  | "route_selection"
  | "brief_preparation"
  | "validation"
  | "review_ready"
  | "visitor_approved"
  | "delivering"
  | "delivered"
  | "recoverable_failure";

export type ContactDeliveryState = "idle" | "delivering" | "delivered";

export function deriveContactWorkflowState({
  delivery,
  draft,
  hasRecoverableError,
  isPreparing,
  visitorApproved,
}: {
  delivery: ContactDeliveryState;
  draft: ContactDraft;
  hasRecoverableError: boolean;
  isPreparing: boolean;
  visitorApproved: boolean;
}): ContactWorkflowState {
  if (delivery === "delivered") return "delivered";
  if (delivery === "delivering") return "delivering";
  if (hasRecoverableError) return "recoverable_failure";
  if (!draft.route) return "route_selection";
  if (isPreparing) return "brief_preparation";

  const validation = validateContactDraft(draft);
  if (!validation.valid) return "validation";
  return visitorApproved ? "visitor_approved" : "review_ready";
}

export function validateContactDraft(draft: ContactDraft) {
  const issues: Array<{ field: string; message: string }> = [];
  const missingFields = getMissingContactFields(draft);

  for (const field of missingFields) {
    issues.push({ field, message: `${contactFieldLabel(field)} is required.` });
  }

  if (draft.replyEmail && !isUsefulEmail(draft.replyEmail)) {
    issues.push({ field: "replyEmail", message: "Add a valid reply email address." });
  }

  if (draft.replyName && draft.replyName.trim().length < 2) {
    issues.push({ field: "replyName", message: "Add the name the reply should be addressed to." });
  }

  return {
    issues,
    missingFields,
    nextIncompleteField: issues[0]?.field ?? null,
    valid: Boolean(draft.route) && issues.length === 0,
  };
}

export function getNextContactQuestion(draft: ContactDraft) {
  const field = validateContactDraft(draft).nextIncompleteField;
  if (!field) {
    return null;
  }

  const questions: Record<string, string> = {
    route: "Is this about contract work, one of Dave's products, or something else?",
    company: "Which company or agency is this for?",
    need: "What role or project do you need help with?",
    timing: "When should the work start, and how long do you expect it to run?",
    workingArrangement: "Is the work remote, hybrid or on-site? Include the location if it matters.",
    replyName: "What name should Dave use when he replies?",
    replyEmail: "What email address should Dave reply to?",
    product: "Which product are you asking about?",
    question: "What would you like to know about the product?",
    topic: "What is your enquiry about?",
    message: "What would you like Dave to know?",
  };

  return questions[field] ?? `Please add ${contactFieldLabel(field).toLowerCase()}.`;
}

export type ContractFit = {
  status: "strong_fit" | "needs_review" | "unlikely_fit";
  reason: string;
  evidence: string[];
};

export function assessContractFit(draft: ContactDraft): ContractFit | null {
  if (draft.route !== "contract") {
    return null;
  }

  const need = `${draft.need ?? ""} ${draft.summary ?? ""}`.toLowerCase();
  const arrangement = (draft.workingArrangement ?? "").toLowerCase();

  if (/\b(permanent|perm role|full[- ]time employee)\b/.test(need)) {
    return {
      status: "unlikely_fit",
      reason: "Dave is looking for contract work rather than a permanent role.",
      evidence: ["Permanent role mentioned", "Contract work only"],
    };
  }

  if (/\b(data scientist|data science|python specialist|rag specialist|big data)\b/.test(need)) {
    return {
      status: "unlikely_fit",
      reason: "This appears to need a data-science specialist rather than hands-on AI product engineering.",
      evidence: ["Specialist data work", "Product engineering focus"],
    };
  }

  if (
    /\b(on[- ]site|onsite|office only)\b/.test(arrangement) &&
    !/\b(remote|north east|newcastle|hybrid)\b/.test(arrangement)
  ) {
    return {
      status: "unlikely_fit",
      reason: "The working arrangement does not appear to match remote UK or North East hybrid work.",
      evidence: ["On-site requirement", "Remote UK preference"],
    };
  }

  const evidence: string[] = [];
  if (/\b(react|typescript|frontend|full[- ]stack|node|tailwind|convex)\b/.test(need)) {
    evidence.push("Relevant web stack");
  }
  if (/\b(ai|agent|llm|mcp|product)\b/.test(need)) {
    evidence.push("AI product work");
  }
  if (/\b(greenfield|architecture|rebuild|small team|product team)\b/.test(need)) {
    evidence.push("Product shaping fit");
  }
  if (/\b(remote|north east|newcastle|hybrid)\b/.test(arrangement)) {
    evidence.push("Working arrangement fit");
  }

  if (evidence.length >= 2) {
    return {
      status: "strong_fit",
      reason: "The brief matches Dave's product engineering focus and preferred way of working.",
      evidence,
    };
  }

  return {
    status: "needs_review",
    reason: "The brief is complete enough to send, but fit needs Dave's judgement.",
    evidence: evidence.length ? evidence : ["No automatic fit signal"],
  };
}

export function contactWorkflowStateLabel(state: ContactWorkflowState) {
  const labels: Record<ContactWorkflowState, string> = {
    route_selection: "Choose a route",
    brief_preparation: "AI preparing",
    validation: "Details needed",
    review_ready: "Ready for review",
    visitor_approved: "Visitor approved",
    delivering: "Sending",
    delivered: "Delivered",
    recoverable_failure: "Message kept",
  };
  return labels[state];
}

function isUsefulEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function contactFieldLabel(field: string) {
  const labels: Record<string, string> = {
    route: "Enquiry route",
    company: "Company or agency",
    need: "Role or project need",
    timing: "Timing",
    workingArrangement: "Working arrangement",
    replyName: "Reply name",
    replyEmail: "Reply email",
    product: "Product",
    question: "Question",
    topic: "Topic",
    message: "Message",
  };
  return labels[field] ?? field;
}
