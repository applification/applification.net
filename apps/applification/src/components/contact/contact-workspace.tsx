"use client";

import {
  Bot,
  Check,
  ChevronsUpDown,
  FileText,
  FileUp,
  Link as LinkIcon,
  Paperclip,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { contactAttachmentSchema } from "@/lib/contact-attachment";
import type { ContactRoute } from "@/lib/contact";
import {
  applyContactProposal,
  changeContactRoute,
  contactDraftSchema,
  createContactDraft,
  setContactAttachment,
  type ContactDraft,
} from "@/lib/contact-draft";
import {
  assessContractFit,
  contactFieldLabel,
  contactWorkflowStateLabel,
  deriveContactWorkflowState,
  getNextContactQuestion,
  validateContactDraft,
  type ContactDeliveryState,
} from "@/lib/contact-state";
import { portfolioProducts } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const routes: Array<{
  description: string;
  label: string;
  route: ContactRoute;
  shortLabel: string;
}> = [
  {
    route: "contract",
    label: "Contract enquiry",
    description: "A role, project or small-team build.",
    shortLabel: "Contract",
  },
  {
    route: "product",
    label: "Product enquiry",
    description: "A question about one of my products.",
    shortLabel: "Product",
  },
  {
    route: "general",
    label: "General enquiry",
    description: "Anything useful that does not fit the other routes.",
    shortLabel: "General",
  },
];

const routePrompts: Record<ContactRoute, string> = {
  contract:
    "Tell me about the company, the work and when you need someone. You can attach a contract brief or add a link.",
  product:
    "Which product are you asking about, and what would you like to know?",
  general: "What would you like Dave to know?",
};

type ContactMessage = {
  author: "assistant" | "visitor";
  id: number;
  text: string;
};

type EditableContactField = Exclude<
  keyof ContactDraft,
  "attachment" | "route" | "version"
>;

const routeReviewFields: Record<ContactRoute, EditableContactField[]> = {
  contract: ["company", "need", "timing", "workingArrangement", "briefLink"],
  product: ["product", "question", "context"],
  general: ["topic", "message"],
};

const reviewFieldLabels: Record<EditableContactField, string> = {
  summary: "Summary",
  replyName: "Your name",
  replyEmail: "Reply address",
  company: "Company or agency",
  need: "Role or project need",
  timing: "Timing",
  workingArrangement: "Working arrangement",
  briefLink: "Contract brief link",
  product: "Product",
  question: "Question",
  context: "Useful context",
  topic: "Topic",
  message: "Message",
};

type DeliveryResult = {
  route: ContactRoute;
  sentFields: string[];
  cvFollowUpRequiresApproval: boolean;
};

function AssistantMessageLabel() {
  return (
    <div className="flex items-center gap-2 font-caption text-[10px] font-bold tracking-[0.7px] text-[var(--app-label-text)] uppercase">
      <Bot aria-hidden="true" className="size-4" />
      Enquiry assistant
    </div>
  );
}

export function ContactWorkspace({
  initialProduct,
  initialRoute,
}: {
  initialProduct?: string;
  initialRoute: ContactRoute | null;
}) {
  const [draft, setDraft] = useState<ContactDraft>(() =>
    createContactDraft({ product: initialProduct, route: initialRoute }),
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    initialRoute
      ? [{ author: "assistant", id: 1, text: routePrompts[initialRoute] }]
      : [],
  );
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [attachmentStatus, setAttachmentStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [routeChooserExpanded, setRouteChooserExpanded] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [editingField, setEditingField] = useState<EditableContactField | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [visitorApproved, setVisitorApproved] = useState(false);
  const [delivery, setDelivery] = useState<ContactDeliveryState>("idle");
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<DeliveryResult | null>(null);
  const [website, setWebsite] = useState("");
  const draftRef = useRef(draft);
  const startedAtRef = useRef(0);
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fieldPrefix = useId();

  useEffect(() => {
    startedAtRef.current = currentTimestamp();
  }, []);

  function resetDeliveryForDraftChange() {
    setVisitorApproved(false);
    setDelivery("idle");
    setDeliveryError(null);
    setDeliveryResult(null);
    idempotencyKeyRef.current = crypto.randomUUID();
  }

  function chooseRoute(nextRoute: ContactRoute) {
    if (nextRoute === draftRef.current.route) {
      return;
    }

    if (nextRoute !== "contract" && draftRef.current.attachment) {
      void deletePrivateAttachment(draftRef.current.attachment.pathname);
      setAttachmentStatus("The contract document was removed when the route changed.");
    }

    const nextDraft = changeContactRoute(draftRef.current, nextRoute);
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    setRouteChooserExpanded(false);
    setReviewMode(false);
    resetDeliveryForDraftChange();
    setPrepareError(null);
    setMessages((current) => [
      ...current,
      { author: "assistant", id: Date.now(), text: routePrompts[nextRoute] },
    ]);
  }

  function submitOpening(prompt: PromptInputMessage) {
    const opening = prompt.text.trim();
    if (opening) {
      void prepareBrief(opening, true);
    }
  }

  async function prepareBrief(opening: string, appendVisitorMessage: boolean) {
    if (isPreparing) {
      return;
    }

    if (appendVisitorMessage) {
      setMessages((current) => [
        ...current,
        { author: "visitor", id: Date.now(), text: opening },
      ]);
    }

    setIsPreparing(true);
    setPrepareError(null);

    try {
      const response = await fetch("/api/contact/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: draftRef.current, message: opening }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setPrepareError(readPrepareError(payload));
        setLastFailedMessage(canRetryPrepare(payload) ? opening : null);
        return;
      }

      const proposal =
        payload && typeof payload === "object" && "proposal" in payload
          ? payload.proposal
          : null;
      const applied = applyContactProposal(draftRef.current, proposal);

      if (!applied.accepted) {
        throw new Error(
          applied.reason === "stale"
            ? "The brief changed while the assistant was working. Retry this message against the latest version."
            : "The assistant proposed an unsafe or conflicting change. Nothing changed. Please retry.",
        );
      }

      draftRef.current = applied.draft;
      setDraft(applied.draft);
      resetDeliveryForDraftChange();
      const nextQuestion = getNextContactQuestion(applied.draft);
      setMessages((current) => [
        ...current,
        {
          author: "assistant",
          id: Date.now() + 1,
          text:
            nextQuestion ??
            "That is everything I need. Open the brief when you want to check and send it.",
        },
      ]);
      setMessage((current) => (current.trim() === opening ? "" : current));
      setLastFailedMessage(null);
    } catch (error) {
      setPrepareError(
        error instanceof Error
          ? error.message
          : "The assistant could not prepare the brief. Retry when you are ready.",
      );
      setLastFailedMessage(opening);
    } finally {
      setIsPreparing(false);
    }
  }

  function restart() {
    if (draftRef.current.attachment) {
      void deletePrivateAttachment(draftRef.current.attachment.pathname);
    }

    const initialDraft = createContactDraft({ product: initialProduct, route: initialRoute });
    draftRef.current = initialDraft;
    setDraft(initialDraft);
    setMessage("");
    setMessages(
      initialRoute
        ? [{ author: "assistant", id: 1, text: routePrompts[initialRoute] }]
        : [],
    );
    setPrepareError(null);
    setLastFailedMessage(null);
    setAttachmentStatus(null);
    setBriefExpanded(false);
    setRouteChooserExpanded(false);
    setReviewMode(false);
    setEditingField(null);
    setEditingValue("");
    resetDeliveryForDraftChange();
    startedAtRef.current = currentTimestamp();
  }

  async function uploadContactAttachment(file: File) {
    if (draftRef.current.route !== "contract" || isUploading) {
      return;
    }

    setIsUploading(true);
    setAttachmentStatus("Checking and storing the document privately...");
    const form = new FormData();
    form.set("file", file);

    try {
      const response = await fetch("/api/contact/attachment", {
        method: "POST",
        body: form,
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(readPrepareError(payload));
      }

      const attachmentInput =
        payload && typeof payload === "object" && "attachment" in payload
          ? payload.attachment
          : null;
      const checked = contactAttachmentSchema.safeParse(attachmentInput);
      if (!checked.success) {
        throw new Error("Private storage returned an invalid document record. Nothing was attached.");
      }

      const previous = draftRef.current.attachment;
      const nextDraft = setContactAttachment(draftRef.current, checked.data);
      draftRef.current = nextDraft;
      setDraft(nextDraft);
      resetDeliveryForDraftChange();
      setAttachmentStatus(`${checked.data.filename} is attached privately.`);

      if (previous) {
        void deletePrivateAttachment(previous.pathname);
      }
    } catch (error) {
      setAttachmentStatus(
        error instanceof Error
          ? error.message
          : "The document could not be attached. You can retry or use an HTTPS link.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeContactAttachment() {
    const attachment = draftRef.current.attachment;
    if (!attachment) {
      return;
    }

    const nextDraft = setContactAttachment(draftRef.current, null);
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    resetDeliveryForDraftChange();
    setAttachmentStatus(`${attachment.filename} was removed.`);
    void deletePrivateAttachment(attachment.pathname);
  }

  function editDraftField(field: EditableContactField, value: string) {
    const nextDraft: ContactDraft = {
      ...draftRef.current,
      version: draftRef.current.version + 1,
    };

    if (value === "") {
      delete nextDraft[field];
    } else {
      Object.assign(nextDraft, { [field]: value });
    }

    const checked = contactDraftSchema.safeParse(nextDraft);
    if (!checked.success) {
      return;
    }

    draftRef.current = checked.data;
    setDraft(checked.data);
    resetDeliveryForDraftChange();
  }

  function startEditingField(field: EditableContactField) {
    setEditingField(field);
    setEditingValue(draftRef.current[field] ?? "");
  }

  function saveEditingField() {
    if (!editingField) {
      return;
    }

    editDraftField(editingField, editingValue.trim());
    setEditingField(null);
    setEditingValue("");
  }

  function cancelEditingField() {
    setEditingField(null);
    setEditingValue("");
  }

  function renderFieldEditor(field: EditableContactField) {
    const issue = validation.issues.find((item) => item.field === field);
    const fieldId = `${fieldPrefix}-${field}-editor`;
    const emptyRequiredField =
      isRequiredReviewField(field, route) && editingValue.trim() === "";

    return (
      <Field className="mt-3" data-invalid={Boolean(issue) || undefined}>
        <FieldLabel className="sr-only" htmlFor={fieldId}>
          {reviewFieldLabels[field]}
        </FieldLabel>
        {field === "product" ? (
          <Select
            disabled={delivery !== "idle"}
            onValueChange={setEditingValue}
            value={editingValue}
          >
            <SelectTrigger aria-invalid={Boolean(issue)} className="h-11 w-full text-base" id={fieldId}>
              <SelectValue placeholder="Choose a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {portfolioProducts.map((product) => (
                  <SelectItem key={product.slug} value={product.slug}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : isLongReviewField(field) ? (
          <Textarea
            aria-invalid={Boolean(issue)}
            className="min-h-24 text-base leading-[1.5]"
            disabled={delivery !== "idle"}
            id={fieldId}
            onChange={(event) => setEditingValue(event.target.value)}
            rows={4}
            value={editingValue}
          />
        ) : (
          <Input
            aria-invalid={Boolean(issue)}
            className="h-11 text-base"
            disabled={delivery !== "idle"}
            id={fieldId}
            inputMode={field === "replyEmail" ? "email" : undefined}
            onChange={(event) => setEditingValue(event.target.value)}
            type={field === "replyEmail" ? "email" : field === "briefLink" ? "url" : "text"}
            value={editingValue}
          />
        )}
        <FieldError>{issue?.message}</FieldError>
        <div className="flex gap-2">
          <Button
            disabled={emptyRequiredField || delivery !== "idle"}
            onClick={saveEditingField}
            size="sm"
            type="button"
          >
            Save change
          </Button>
          <Button onClick={cancelEditingField} size="sm" type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </Field>
    );
  }

  async function sendApprovedBrief() {
    if (!validation.valid || delivery === "delivering") {
      return;
    }

    setVisitorApproved(true);
    setDelivery("delivering");
    setDeliveryError(null);

    try {
      const response = await fetch("/api/contact/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          draft: draftRef.current,
          idempotencyKey: idempotencyKeyRef.current,
          startedAt: startedAtRef.current,
          website,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(readPrepareError(payload));
      }

      const runId =
        payload && typeof payload === "object" && "runId" in payload
          ? payload.runId
          : null;
      if (typeof runId !== "string") {
        throw new Error("The durable handoff returned no tracking reference. Your brief was not marked sent.");
      }

      await waitForDelivery(runId);
    } catch (error) {
      setDelivery("idle");
      setDeliveryError(
        error instanceof Error
          ? error.message
          : "Delivery failed without a false success. Your reviewed brief is still available to retry.",
      );
    }
  }

  async function waitForDelivery(runId: string) {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const response = await fetch(`/api/contact/deliver?runId=${encodeURIComponent(runId)}`);
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(readPrepareError(payload));
      }

      if (payload && typeof payload === "object" && "status" in payload) {
        if (payload.status === "completed" && "result" in payload) {
          const result = readDeliveryResult(payload.result);
          if (!result) {
            throw new Error("Delivery completed without a valid receipt. Please contact Dave through LinkedIn.");
          }
          setDeliveryResult(result);
          setDelivery("delivered");
          setMessages((current) => [
            ...current,
            { author: "assistant", id: Date.now(), text: "Your reviewed enquiry has been sent to Dave." },
          ]);
          return;
        }
        if (payload.status === "failed") {
          throw new Error(readPrepareError(payload));
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }

    throw new Error("Delivery is still being processed. Retry the status check without changing your brief.");
  }

  const route = draft.route;
  const selectedRoute = routes.find((item) => item.route === route);
  const briefPrepared = Object.keys(draft).some(
    (field) => field !== "version" && field !== "route",
  );
  const validation = validateContactDraft(draft);
  const progress: Array<[string, boolean]> = [
    ["Route confirmed", Boolean(route)],
    ["Brief prepared by AI", briefPrepared],
    ["Details checked by app", validation.valid],
    ["Your approval to send", visitorApproved],
  ];
  const reviewFields = route
    ? [...routeReviewFields[route], "replyName", "replyEmail"] satisfies EditableContactField[]
    : [];
  const remainingIssueCount = validation.issues.length;
  const nextIncompleteField = validation.nextIncompleteField;
  const workflowState = deriveContactWorkflowState({
    delivery,
    draft,
    hasRecoverableError: Boolean(prepareError || deliveryError),
    isPreparing,
    visitorApproved,
  });
  const contractFit =
    route === "contract" && (draft.need || draft.workingArrangement)
      ? assessContractFit(draft)
      : null;
  const reviewHeadline = getReviewHeadline(draft);
  const deliveryTitle = deliveryResult
    ? deliveryResult.route === "contract"
      ? "Contract enquiry sent"
      : deliveryResult.route === "product"
        ? "Product enquiry sent"
        : "General enquiry sent"
    : null;
  const expandedBrief = reviewMode ? (
    <>
      <Separator />
      <div className="max-h-[min(24svh,260px)] overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-5 px-4 py-4 sm:px-5">
          <section
            aria-labelledby={`${fieldPrefix}-prepared-message`}
            className="rounded-2xl bg-[var(--app-muted-section)] p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className="font-caption text-[10px] font-bold tracking-[0.7px] text-[var(--app-label-text)] uppercase"
                  id={`${fieldPrefix}-prepared-message`}
                >
                  Enquiry overview
                </p>
                {editingField === "summary" ? (
                  renderFieldEditor("summary")
                ) : (
                  <div className="mt-2">
                    <p className="font-heading text-[clamp(1.3rem,3vw,1.7rem)] leading-[1.15]">
                      {reviewHeadline}
                    </p>
                    {draft.summary ? (
                      <p className="mt-2 text-[15px] leading-[1.5] text-[var(--app-text-secondary)]">
                        {draft.summary}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
              {editingField !== "summary" ? (
                <Button
                  className="shrink-0"
                  disabled={delivery !== "idle" || Boolean(editingField)}
                  onClick={() => startEditingField("summary")}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Pencil data-icon="inline-start" />
                  Change
                </Button>
              ) : null}
            </div>
          </section>

          <section aria-labelledby={`${fieldPrefix}-brief-details`}>
            <div className="flex items-center justify-between gap-3">
              <p
                className="font-caption text-[10px] font-bold tracking-[0.7px] text-[var(--app-label-text)] uppercase"
                id={`${fieldPrefix}-brief-details`}
              >
                Brief details
              </p>
              <Badge variant={validation.valid ? "outline" : "secondary"}>
                {validation.valid ? "Checked by the app" : "Needs a correction"}
              </Badge>
            </div>
            <ul className="mt-2 divide-y divide-[var(--app-border)] border-y border-[var(--app-border)]">
              {reviewFields
                .filter(
                  (field) => Boolean(draft[field]) || isRequiredReviewField(field, route),
                )
                .map((field) => (
                  <li
                    className="grid gap-2 py-3 sm:grid-cols-[145px_minmax(0,1fr)_auto] sm:items-start"
                    key={field}
                  >
                    <p className="font-caption text-[11px] font-bold tracking-[0.5px] text-[var(--app-label-text)] uppercase">
                      {reviewFieldLabels[field]}
                    </p>
                    <div className="min-w-0">
                      {editingField === field ? (
                        renderFieldEditor(field)
                      ) : (
                        <p className="text-[15px] leading-[1.5]">
                          {formatReviewValue(field, draft[field] ?? "")}
                        </p>
                      )}
                    </div>
                    {editingField !== field ? (
                      <Button
                        className="justify-self-start sm:justify-self-end"
                        disabled={delivery !== "idle" || Boolean(editingField)}
                        onClick={() => startEditingField(field)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        Change
                      </Button>
                    ) : null}
                  </li>
                ))}
            </ul>
          </section>

          {route === "contract" ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-section)] p-4">
              {draft.attachment ? (
                <div className="flex items-start gap-3">
                  <FileUp aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--app-action)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{draft.attachment.filename}</p>
                    <p className="mt-1 text-[12px] text-[var(--app-text-muted)]">
                      Private document, {formatFileSize(draft.attachment.size)}
                    </p>
                  </div>
                  <Button disabled={delivery !== "idle"} onClick={removeContactAttachment} type="button" variant="ghost">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--app-text-secondary)]">
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon aria-hidden="true" className="size-4" /> HTTPS brief link
                  </span>
                  <span aria-hidden="true">or</span>
                  <Button disabled={isUploading} onClick={() => fileInputRef.current?.click()} type="button" variant="outline">
                    <FileUp data-icon="inline-start" />
                    Add PDF or DOCX
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {contractFit ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-section)] p-4">
              <p className="font-caption text-[10px] font-bold tracking-[0.65px] text-[var(--app-label-text)] uppercase">
                Contract fit / {formatContractFitStatus(contractFit.status)}
              </p>
              <p className="mt-2 text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                {contractFit.reason}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Contract fit evidence">
                {contractFit.evidence.map((item) => (
                  <li className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-2.5 py-1 text-[12px] font-semibold" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {validation.issues.length ? (
            <div className="rounded-2xl border border-[var(--app-border)] p-4" role="alert">
              <p className="font-caption text-[10px] font-bold tracking-[0.65px] text-[var(--app-label-text)] uppercase">
                Next incomplete step
              </p>
              <p className="mt-2 text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                {validation.issues[0]?.message}
              </p>
            </div>
          ) : null}

          <div aria-atomic="true" aria-live="polite">
            {deliveryError ? (
              <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-section)] p-4" role="alert">
                <p className="text-sm leading-[1.5]">{deliveryError}</p>
                <Button className="mt-3" onClick={() => void sendApprovedBrief()} type="button" variant="outline">
                  Retry approved brief
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-[var(--app-border)] bg-[var(--app-muted-section)] px-4 py-3 sm:flex-row sm:items-center sm:px-5">
        <p className="mr-auto font-caption text-[11px] tracking-[0.5px] text-[var(--app-text-muted)] uppercase">
          Nothing sends without your approval
        </p>
        <Button
          className="min-h-11 rounded-full px-5"
          disabled={
            !validation.valid ||
            Boolean(editingField) ||
            delivery === "delivering" ||
            delivery === "delivered"
          }
          onClick={() => void sendApprovedBrief()}
          type="button"
        >
          {delivery === "delivering"
            ? "Sending securely..."
            : delivery === "delivered"
              ? "Enquiry sent"
              : "Approve and send"}
        </Button>
      </div>
    </>
  ) : (
    <>
      <Separator />
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(280px,1fr)] sm:px-5">
        <div className="min-w-0">
          <p className="font-caption text-[10px] font-bold tracking-[0.7px] text-[var(--app-label-text)] uppercase">
            Brief so far
          </p>
          <p className="mt-1.5 text-sm leading-[1.5] text-[var(--app-text-secondary)]">
            {draft.summary ??
              "Send a message and the assistant will turn it into a structured brief."}
          </p>
        </div>
        <ol className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          {progress.map(([label, complete]) => (
            <li className="flex items-center gap-2" key={label}>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  complete
                    ? "border-[var(--app-action)] bg-[var(--app-action)] text-[var(--app-text-on-action)]"
                    : "border-[var(--app-border)] text-transparent",
                )}
              >
                <Check aria-hidden="true" className="size-3" strokeWidth={2.6} />
              </span>
              <span className={complete ? "" : "text-[var(--app-text-secondary)]"}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );

  return (
    <section
      aria-labelledby="contact-heading"
      className="flex-1 bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)]"
    >
      <div className="mx-auto w-full max-w-[1040px] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[780px] text-center">
          <p className="font-caption text-xs font-bold tracking-[1.2px] text-[var(--app-label-text)] uppercase">
            Contact / AI workflow
          </p>
          <h1
            className="font-heading mt-4 text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.035em]"
            id="contact-heading"
          >
            Start with a message. End with a checked brief.
          </h1>
          <p className="mx-auto mt-5 max-w-[690px] text-[clamp(1.0625rem,2vw,1.1875rem)] leading-[1.58] text-[var(--app-text-secondary)]">
            The assistant structures your enquiry. The app checks the details.
            Nothing reaches me until you review and approve it.
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-[24px] border border-[var(--app-border)] bg-[var(--app-card)] shadow-[0_30px_80px_-48px_#0b1220]">
          <header className="flex min-h-14 items-center justify-between gap-4 border-b border-[var(--app-border)] px-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full bg-[var(--workflow-live)]" aria-hidden="true" />
              <p className="font-caption truncate text-[11px] font-bold tracking-[0.7px] uppercase">
                <span className="sm:hidden">Contact</span>
                <span className="hidden sm:inline">Applification contact</span>
              </p>
              <span className="hidden rounded-full bg-[var(--app-control)] px-2.5 py-1 font-caption text-[10px] font-bold tracking-[0.45px] text-[var(--app-label-text)] uppercase sm:inline-flex">
                {contactWorkflowStateLabel(workflowState)}
              </span>
            </div>
            <Button className="min-h-11" onClick={restart} size="sm" type="button" variant="ghost">
              <RotateCcw data-icon="inline-start" />
              Restart
            </Button>
          </header>

          <div
            className="flex h-[calc(100svh-88px)] min-h-[440px] max-h-[590px] flex-col sm:h-[clamp(590px,68svh,730px)] sm:min-h-0 sm:max-h-none"
            data-contact-workspace-body
          >
            <Conversation className="bg-[var(--app-section)]">
              <ConversationContent className="mx-auto w-full max-w-[820px] gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-8">
                <Message from="assistant">
                  <MessageContent className="w-full max-w-[720px] gap-3 rounded-2xl bg-[var(--app-muted-section)] p-3 text-base leading-[1.55] sm:gap-4 sm:p-5">
                    <AssistantMessageLabel />
                    <p>
                      <span className="sm:hidden">
                        Tell me what brings you here, or choose a route. You will
                        review the brief before it is sent.
                      </span>
                      <span className="hidden sm:inline">
                        Tell me what brings you here, or choose a route. I will
                        prepare a checked brief for you to review before anything
                        is sent.
                      </span>
                    </p>
                    {route && !routeChooserExpanded ? (
                      <div
                        className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[var(--app-action)] bg-[var(--app-selected)] px-3 sm:hidden"
                        data-contact-selected-route
                      >
                        <span className="truncate font-semibold">{selectedRoute?.shortLabel}</span>
                        <Button
                          className="min-h-11 shrink-0 px-2"
                          onClick={() => setRouteChooserExpanded(true)}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          Change
                        </Button>
                      </div>
                    ) : null}
                    <ToggleGroup
                      aria-label="Choose an enquiry route"
                      className={cn(
                        "w-full grid-cols-1 gap-2 sm:grid sm:grid-cols-3",
                        route && !routeChooserExpanded ? "hidden" : "grid",
                      )}
                      data-contact-route-options
                      onValueChange={(value) => {
                        if (value) {
                          chooseRoute(value as ContactRoute);
                        }
                      }}
                      type="single"
                      value={route ?? ""}
                      variant="outline"
                    >
                      {routes.map((item) => (
                        <ToggleGroupItem
                          aria-label={item.label}
                          className="h-11 min-h-11 w-full items-center justify-start whitespace-normal px-3 py-2 text-left data-[state=on]:border-[var(--app-action)] data-[state=on]:bg-[var(--app-selected)] sm:h-auto sm:min-h-[74px] sm:flex-col sm:items-start sm:py-3"
                          key={item.route}
                          value={item.route}
                        >
                          <span className="font-semibold">{item.label}</span>
                          <span className="hidden text-[13px] leading-[1.35] font-normal text-[var(--app-text-secondary)] sm:block">
                            {item.description}
                          </span>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </MessageContent>
                </Message>

                {messages.map((item) => (
                  <Message from={item.author === "visitor" ? "user" : "assistant"} key={item.id}>
                    <MessageContent
                      className={
                        item.author === "visitor"
                          ? "max-w-[680px] rounded-2xl bg-[var(--app-action)] px-4 py-3 text-base leading-[1.55] text-[var(--app-text-on-action)]"
                          : "max-w-[720px] rounded-2xl bg-[var(--app-muted-section)] px-4 py-3 text-base leading-[1.55]"
                      }
                    >
                      {item.author === "assistant" ? <AssistantMessageLabel /> : null}
                      <p>{item.text}</p>
                    </MessageContent>
                  </Message>
                ))}

                <div aria-atomic="true" aria-live="polite">
                  {isPreparing ? (
                    <Message from="assistant">
                      <MessageContent className="rounded-2xl bg-[var(--app-muted-section)] px-4 py-3 text-sm text-[var(--app-text-secondary)]">
                        <AssistantMessageLabel />
                        <span className="flex items-center gap-2">
                          <Sparkles aria-hidden="true" className="size-4 text-[var(--app-action)]" />
                          Preparing the brief...
                        </span>
                      </MessageContent>
                    </Message>
                  ) : prepareError ? (
                    <Message from="assistant">
                      <MessageContent className="max-w-[720px] rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-section)] p-4" role="alert">
                        <AssistantMessageLabel />
                        <p className="text-sm leading-[1.5]">{prepareError}</p>
                        {lastFailedMessage ? (
                          <Button
                            className="mt-3 min-h-11"
                            onClick={() => void prepareBrief(lastFailedMessage, false)}
                            type="button"
                            variant="outline"
                          >
                            Retry message
                          </Button>
                        ) : null}
                      </MessageContent>
                    </Message>
                  ) : null}
                </div>
              </ConversationContent>
              <ConversationScrollButton aria-label="Scroll to the latest message" />
            </Conversation>

            <div className="shrink-0 border-t border-[var(--app-border)] bg-[var(--app-card)] p-3 sm:p-4">
              <div className="mx-auto max-w-[820px]">
                {deliveryResult ? (
                  <Alert
                    aria-live="polite"
                    className="min-h-[132px] items-center rounded-2xl p-5 sm:pr-52"
                    variant="success"
                  >
                    <ShieldCheck aria-hidden="true" />
                    <AlertTitle className="font-heading text-[clamp(1.45rem,3vw,1.9rem)] leading-[1.1]">
                      {deliveryTitle}
                    </AlertTitle>
                    <AlertDescription className="mt-1 max-w-[560px] text-[15px] leading-[1.5] text-balance">
                      Dave has received your checked brief
                      {draft.replyEmail ? ` and will reply to ${draft.replyEmail}` : ""}.
                      {deliveryResult.cvFollowUpRequiresApproval
                        ? " Any CV follow-up still requires Dave's separate approval."
                        : ""}
                    </AlertDescription>
                    <AlertAction className="static col-span-2 mt-3 sm:absolute sm:top-1/2 sm:right-5 sm:mt-0 sm:-translate-y-1/2">
                      <Button className="rounded-full" onClick={restart} type="button" variant="outline">
                        <RotateCcw data-icon="inline-start" />
                        Send another enquiry
                      </Button>
                    </AlertAction>
                  </Alert>
                ) : (
                  <>
                <div className="rounded-2xl transition-shadow has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-[var(--app-action)]">
                  {route ? (
                    <Collapsible
                      className="rounded-t-2xl border border-b-0 border-[var(--app-border)] bg-[var(--app-card)]"
                      onOpenChange={(open) => {
                        setBriefExpanded(open);
                        if (!open) {
                          cancelEditingField();
                        }
                      }}
                      open={briefExpanded}
                    >
                    <div className="flex min-h-14 items-center gap-2 px-2 sm:px-3">
                      <CollapsibleTrigger asChild>
                        <Button
                          className="min-w-0 flex-1 justify-start rounded-xl px-2 hover:bg-[var(--app-muted-section)]"
                          type="button"
                          variant="ghost"
                        >
                          <FileText className="hidden sm:block" data-icon="inline-start" />
                          <span className="truncate font-semibold">
                            <span className="sm:hidden">Brief</span>
                            <span className="hidden sm:inline">{selectedRoute?.label}</span>
                          </span>
                          <Badge
                            className="ml-auto hidden font-caption tracking-[0.35px] uppercase sm:inline-flex"
                            variant={remainingIssueCount ? "secondary" : "outline"}
                          >
                            {remainingIssueCount
                              ? `${remainingIssueCount} ${remainingIssueCount === 1 ? "detail" : "details"} needed`
                              : "Ready to review"}
                          </Badge>
                          <ChevronsUpDown className="hidden sm:block" data-icon="inline-end" />
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        className="shrink-0 rounded-full"
                        onClick={() => {
                          if (validation.valid) {
                            if (reviewMode && briefExpanded) {
                              setBriefExpanded(false);
                              cancelEditingField();
                              return;
                            }

                            setReviewMode(true);
                            setBriefExpanded(true);
                            return;
                          }

                          setReviewMode(false);
                          setBriefExpanded(false);
                          requestAnimationFrame(() => messageInputRef.current?.focus());
                        }}
                        size="sm"
                        type="button"
                      >
                        <span className="sm:hidden">
                          {validation.valid
                            ? reviewMode && briefExpanded
                              ? "Close"
                              : "Review"
                            : "Add detail"}
                        </span>
                        <span className="hidden sm:inline">
                          {validation.valid
                            ? reviewMode && briefExpanded
                              ? "Close review"
                              : "Review and send"
                            : `Add ${contactFieldLabel(nextIncompleteField ?? "detail").toLowerCase()}`}
                        </span>
                      </Button>
                    </div>
                      <CollapsibleContent>{expandedBrief}</CollapsibleContent>
                    </Collapsible>
                  ) : null}
                  <PromptInput
                    className={cn(
                      "[&>[data-slot=input-group]]:h-14! [&>[data-slot=input-group]]:flex-row! [&>[data-slot=input-group]]:border-[var(--app-border)]! [&>[data-slot=input-group]]:bg-[var(--app-muted-section)] [&>[data-slot=input-group]]:opacity-100! [&>[data-slot=input-group]]:ring-0! [&>[data-slot=input-group]]:shadow-none sm:[&>[data-slot=input-group]]:h-auto! sm:[&>[data-slot=input-group]]:flex-col!",
                      route
                        ? "[&>[data-slot=input-group]]:rounded-t-none [&>[data-slot=input-group]]:rounded-b-2xl"
                        : "[&>[data-slot=input-group]]:rounded-2xl",
                    )}
                    onSubmit={submitOpening}
                  >
                    <PromptInputBody>
                      <PromptInputTextarea
                        aria-label="Describe your enquiry"
                        className="max-h-28 min-h-11 py-2.5 text-base leading-[1.5] text-[var(--app-text-primary)] caret-[var(--app-action)] placeholder:text-[var(--app-text-secondary)] placeholder:opacity-100 sm:max-h-48 sm:min-h-14 sm:py-2"
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={route ? "Add a detail..." : "Describe your enquiry..."}
                        ref={messageInputRef}
                        value={message}
                      />
                    </PromptInputBody>
                    <PromptInputFooter className="w-auto! shrink-0 self-stretch p-2! sm:w-full! sm:self-auto sm:px-2.5! sm:pt-1.5! sm:pb-2!">
                      {route === "contract" ? (
                        <PromptInputTools>
                          <PromptInputButton
                            aria-label="Attach a contract brief"
                            className="size-10 p-0 sm:h-auto sm:w-auto sm:px-2.5"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            size="sm"
                          >
                            <Paperclip data-icon="inline-start" />
                            <span className="hidden sm:inline">
                              {isUploading ? "Attaching..." : "Attach brief"}
                            </span>
                          </PromptInputButton>
                        </PromptInputTools>
                      ) : null}
                      <PromptInputSubmit
                        className="size-10 rounded-xl"
                        disabled={!message.trim() || isPreparing}
                        status={isPreparing ? "submitted" : prepareError ? "error" : "ready"}
                      />
                    </PromptInputFooter>
                  </PromptInput>
                </div>
                <input
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadContactAttachment(file);
                    }
                  }}
                  ref={fileInputRef}
                  type="file"
                />
                <div hidden>
                  <label htmlFor={`${fieldPrefix}-website`}>Website</label>
                  <input
                    autoComplete="off"
                    id={`${fieldPrefix}-website`}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    value={website}
                  />
                </div>
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className={cn(
                    "px-2",
                    attachmentStatus || route === "contract" ? "min-h-5 pt-2" : "hidden",
                  )}
                >
                  {attachmentStatus ? (
                    <p className="text-[13px] leading-[1.4] text-[var(--app-text-secondary)]">
                      {attachmentStatus}
                    </p>
                  ) : route === "contract" ? (
                    <p className="text-[12px] text-[var(--app-text-muted)]">
                      Optional PDF or DOCX, 4 MB maximum. Documents stay out of the AI conversation.
                    </p>
                  ) : null}
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-[820px] items-start gap-3 px-1 text-sm leading-[1.5] text-[var(--app-text-secondary)]">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--app-action)]" />
          <p>Your enquiry is only sent after you review and approve it.</p>
        </div>
      </div>

    </section>
  );
}

function readPrepareError(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return "The assistant could not prepare the brief. Retry when you are ready.";
}

function canRetryPrepare(payload: unknown) {
  return !(
    payload &&
    typeof payload === "object" &&
    "code" in payload &&
    payload.code === "not_configured"
  );
}

function isLongReviewField(field: EditableContactField) {
  return ["summary", "need", "question", "context", "message"].includes(field);
}

function isRequiredReviewField(
  field: EditableContactField,
  route: ContactRoute | null,
) {
  if (!route) {
    return false;
  }

  const required: Record<ContactRoute, EditableContactField[]> = {
    contract: ["company", "need", "timing", "workingArrangement", "replyName", "replyEmail"],
    product: ["product", "question", "replyName", "replyEmail"],
    general: ["topic", "message", "replyName", "replyEmail"],
  };

  return required[route].includes(field);
}

function formatReviewValue(field: EditableContactField, value: string) {
  if (field === "product") {
    return portfolioProducts.find((product) => product.slug === value)?.name ?? value;
  }

  return value;
}

function getReviewHeadline(draft: ContactDraft) {
  if (draft.route === "contract") {
    return draft.need ?? "Contract enquiry";
  }
  if (draft.route === "product") {
    return draft.question ?? "Product enquiry";
  }
  if (draft.route === "general") {
    return draft.topic ?? "General enquiry";
  }
  return "Enquiry brief";
}

function formatContractFitStatus(status: "strong_fit" | "unlikely_fit" | "needs_review") {
  if (status === "strong_fit") {
    return "Strong signal";
  }
  if (status === "unlikely_fit") {
    return "Unlikely fit";
  }
  return "Needs review";
}

function readDeliveryResult(value: unknown): DeliveryResult | null {
  if (
    !value ||
    typeof value !== "object" ||
    !("route" in value) ||
    !("sentFields" in value) ||
    !("cvFollowUpRequiresApproval" in value)
  ) {
    return null;
  }

  if (
    !["contract", "product", "general"].includes(String(value.route)) ||
    !Array.isArray(value.sentFields) ||
    !value.sentFields.every((field) => typeof field === "string") ||
    typeof value.cvFollowUpRequiresApproval !== "boolean"
  ) {
    return null;
  }

  return {
    route: value.route as ContactRoute,
    sentFields: value.sentFields,
    cvFollowUpRequiresApproval: value.cvFollowUpRequiresApproval,
  };
}

async function deletePrivateAttachment(pathname: string) {
  await fetch("/api/contact/attachment", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pathname }),
  }).catch(() => null);
}

function formatFileSize(size: number) {
  return `${Math.max(1, Math.round(size / 1_024))} KB`;
}

function currentTimestamp() {
  return Date.now();
}
