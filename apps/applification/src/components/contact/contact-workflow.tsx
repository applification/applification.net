"use client";

import { portfolioProducts } from "@/lib/portfolio";
import { ExternalLink } from "@/components/external-link";
import { ChevronDown, ChevronLeft, ChevronRight, Mail, Pause, Play, RotateCcw, Sparkles, UserRound } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

type NodeId = "product" | "blob" | "input" | "ai" | "followup" | "review" | "send" | "pause" | "owner" | "resume" | "cv" | "noCv";
type Tone = "yellow" | "green" | "cyan" | "pink";
type DiagramNode = { id: NodeId; title: string; detail: string; completionNote?: string; products?: boolean; tone: Tone; ai?: boolean; titleLines?: string[]; integration?: "ai" | "email" | "blob" | "botid" | "workflow" };
const nodes: DiagramNode[] = [
  { id: "blob", title: "Optional PDF / DOCX", detail: "Private storage. Not read by AI.", tone: "cyan", integration: "blob" },
  { id: "input", title: "Tell me what you need", detail: "Role or project brief", tone: "yellow", integration: "botid" },
  { id: "ai", title: "AI prepares the brief", detail: "Extracts facts from your message", tone: "green", ai: true, integration: "ai" },
  { id: "followup", title: "AI updates the brief", detail: "Interprets your follow-up reply", tone: "green", ai: true, integration: "ai" },
  { id: "review", title: "You review & approve", detail: "Check the details before sending", tone: "yellow" },
  { id: "send", title: "Email Dave the enquiry", detail: "Includes your private review link", tone: "cyan", integration: "email" },
  { id: "pause", title: "Workflow execution pauses", titleLines: ["Workflow execution", "pauses"], detail: "Email sent. Waiting for a decision.", tone: "pink", integration: "workflow" },
  { id: "owner", title: "Dave approves or declines", detail: "Uses the emailed review link", tone: "yellow" },
  { id: "resume", title: "Workflow execution resumes", titleLines: ["Workflow execution", "resumes"], detail: "Continues from the saved state", tone: "cyan", integration: "workflow" },
  { id: "cv", title: "Email sent with CV", detail: "Approved CV attached to your email", tone: "cyan", integration: "email" },
  { id: "noCv", title: "No CV sent", detail: "Declined or approval expired", tone: "cyan" },
];

type Position = [number, number, number, number];
type Edge = { id: string; d: string; label?: string; labelAt?: [number, number]; tone?: Tone; optional?: boolean };
const desktop: Record<NodeId, Position> = {
  product: [30, 235, 280, 138],
  blob: [30, 235, 280, 104],
  input: [30, 75, 280, 104], ai: [365, 75, 280, 104],
  followup: [365, 235, 280, 104], review: [700, 235, 280, 104],
  send: [700, 455, 280, 122],
  pause: [700, 625, 280, 114], owner: [365, 625, 280, 104], resume: [30, 625, 280, 114],
  cv: [30, 800, 280, 104], noCv: [365, 800, 280, 76],
};
const desktopEdges: Edge[] = [
  { id: "input-blob", d: "M170 179V235", label: "OPTIONAL CONTRACT FILE", labelAt: [170, 209], tone: "yellow", optional: true },
  { id: "blob-send", d: "M290 339V509H700", label: "PRIVATE DOWNLOAD LINK", labelAt: [500, 509], tone: "cyan", optional: true },
  { id: "input-ai", d: "M310 113H365", tone: "yellow" },
  { id: "ai-review", d: "M645 113H840V235", label: "DETAILS COMPLETE", labelAt: [840, 181], tone: "green" },
  { id: "ai-followup", d: "M505 179V235", label: "MISSING DETAILS? YOU REPLY", labelAt: [505, 209], tone: "green" },
  { id: "followup-review", d: "M645 273H700", tone: "green" },
  { id: "review-send", d: "M840 339V455", label: "YOU APPROVE", labelAt: [840, 365], tone: "yellow" },
  { id: "send-pause", d: "M840 577V625", tone: "pink" },
  { id: "pause-owner", d: "M700 668H645", tone: "pink" },
  { id: "owner-resume", d: "M395 625V599H280V625", label: "APPROVE", labelAt: [338, 599], tone: "yellow" },
  { id: "resume-cv", d: "M170 739V800", tone: "cyan" },
  { id: "owner-noCv", d: "M505 729V800", label: "DECLINE / EXPIRE", labelAt: [505, 758] },
];
const mobile: Record<NodeId, Position> = {
  product: [46, 390, 308, 150],
  blob: [46, 700, 308, 106],
  input: [46, 80, 308, 104], ai: [46, 220, 308, 106],
  followup: [46, 390, 308, 106], review: [46, 535, 308, 106],
  send: [46, 1000, 308, 124],
  pause: [46, 1180, 308, 114], owner: [46, 1330, 308, 106],
  resume: [46, 1490, 308, 114], cv: [46, 1630, 308, 106], noCv: [46, 1800, 308, 76],
};
const mobileEdges: Edge[] = [
  { id: "input-blob", d: "M46 118H10V753H46", tone: "yellow", optional: true },
  { id: "blob-send", d: "M354 753H388V1039H354", tone: "cyan", optional: true },
  { id: "input-ai", d: "M200 184V220", tone: "yellow" },
  { id: "ai-review", d: "M354 259H378V503H200V535", tone: "green" },
  { id: "ai-followup", d: "M200 326V390", label: "MISSING DETAILS? YOU REPLY", labelAt: [200, 359], tone: "green" },
  { id: "followup-review", d: "M200 496V535", tone: "green" },
  { id: "review-send", d: "M200 641V675H366V987H200V1000", label: "YOU APPROVE", labelAt: [200, 675], tone: "yellow" },
  { id: "send-pause", d: "M200 1124V1180", tone: "pink" },
  { id: "pause-owner", d: "M200 1294V1330", tone: "pink" },
  { id: "owner-resume", d: "M200 1436V1490", label: "DAVE APPROVES", labelAt: [200, 1460], tone: "yellow" },
  { id: "resume-cv", d: "M200 1604V1630" },
  { id: "owner-noCv", d: "M354 1369H378V1760H200V1800", label: "DECLINE / EXPIRE", labelAt: [200, 1760] },
];
type ExampleRoute = "contract" | "product" | "general";
type AnimationStep = { node: NodeId; edge: string; duration: number; caption: string };
const examples: { route: ExampleRoute; label: string; description: string }[] = [
  { route: "contract", label: "Contract", description: "Includes an optional job spec and the paused CV review." },
  { route: "product", label: "Product", description: "A product question, completed when the enquiry is emailed." },
  { route: "general", label: "General", description: "A general enquiry, completed when the enquiry is emailed." },
];
const contractSequence: AnimationStep[] = [
  { node: "input", edge: "input-ai", duration: 1100, caption: "Start with a contract enquiry about a role or project. Vercel BotID protects contact requests in production. You can also complete the brief manually and skip AI." },
  { node: "ai", edge: "ai-followup", duration: 1800, caption: "AI Gateway handles the model call. Zod validates its structured JSON before the app accepts the facts and asks for missing details." },
  { node: "followup", edge: "followup-review", duration: 2200, caption: "You reply in the chat. A new AI Gateway call updates the brief, with Zod checking the response. This can repeat until the details are complete." },
  { node: "blob", edge: "input-blob", duration: 1600, caption: "This contract example also includes an optional PDF or DOCX. Vercel Blob stores it privately. The file stays out of the AI conversation." },
  { node: "review", edge: "review-send", duration: 2000, caption: "You review, edit and approve the brief. Your approval starts delivery." },
  { node: "blob", edge: "blob-send", duration: 1600, caption: "After your approval, the enquiry email includes a private download link to the stored job specification." },
  { node: "send", edge: "send-pause", duration: 1800, caption: "Resend sends Dave the enquiry email. The email includes the private review link and, if uploaded, a private link to the job specification. The email is sent before workflow execution pauses." },
  { node: "pause", edge: "", duration: 4200, caption: "The email has been sent. Workflow execution now pauses with its state preserved, waiting up to 14 days for Dave to use the review link and make a decision." },
  { node: "owner", edge: "pause-owner", duration: 2300, caption: "The contract enquiry email includes a private review action. While workflow execution is paused, Dave opens it and approves or declines sending the CV." },
  { node: "resume", edge: "owner-resume", duration: 2000, caption: "Dave approves. That decision resumes the durable function from where it paused." },
  { node: "cv", edge: "resume-cv", duration: 1800, caption: "The resumed workflow uses Resend to email you the approved CV as an attachment. A decline or expired review ends the process without sending a CV." },
];

function emailOnlySequence(route: "product" | "general"): AnimationStep[] {
  return contractSequence
    .filter(({ node }) => ["input", "ai", "followup", "review", "send"].includes(node))
    .map(step => {
      if (step.node === "input") return {
        ...step,
        caption: route === "product"
          ? "This example starts with a question about one of Dave’s products. Vercel BotID protects the contact request."
          : "This example starts with a general enquiry. Vercel BotID protects the contact request.",
      };
      if (step.node === "send") return {
        ...step,
        edge: "",
        caption: route === "product"
          ? "Resend emails your product question and contact details to Dave. Your enquiry is complete."
          : "Resend emails your message and contact details to Dave. Your enquiry is complete.",
      };
      return step;
    });
}
const sequences: Record<ExampleRoute, AnimationStep[]> = {
  contract: contractSequence,
  product: emailOnlySequence("product").flatMap(step => {
    if (step.node === "ai") return [
      { ...step, edge: "ai-product", caption: "AI captures the product question. Zod checks the response. If the product is missing, the app asks which one you mean." },
      { node: "product" as const, edge: "product-followup", duration: 2400, caption: `The app asks “Which product are you asking about?” You can name ${portfolioProducts.map(product => product.name).join(", ")}. A product already captured in your message or selected on arrival skips this question.` },
    ];
    if (step.node === "followup") return [{ ...step, caption: "You name the product in your reply. A separate AI call updates the brief, and Zod checks the product against the four supported names. The app then asks for any remaining question or reply details." }];
    return [step];
  }),
  general: emailOnlySequence("general"),
};

const emailNodeIds: NodeId[] = ["input", "ai", "followup", "review", "send"];
const emailDesktopEdges = desktopEdges.filter(edge => ["input-ai", "ai-review", "ai-followup", "followup-review", "review-send"].includes(edge.id));
const emailMobile = { ...mobile, send: [46, 800, 308, 124] as Position };
const emailMobileEdges = mobileEdges
  .filter(edge => emailDesktopEdges.some(item => item.id === edge.id))
  .map(edge => edge.id === "review-send" ? { ...edge, d: "M200 641V674H378V780H200V800", labelAt: [200, 674] as [number, number] } : edge);

const productDesktopEdges: Edge[] = [
  ...emailDesktopEdges,
  { id: "ai-product", d: "M390 179V208H170V235", label: "PRODUCT MISSING?", labelAt: [170, 208], tone: "cyan" },
  { id: "product-followup", d: "M310 287H365", tone: "yellow" },
];
const productMobile = { ...emailMobile, followup: [46, 590, 308, 106] as Position, review: [46, 735, 308, 106] as Position, send: [46, 1000, 308, 124] as Position };
const productMobileEdges: Edge[] = [
  { id: "input-ai", d: "M200 184V220", tone: "yellow" },
  { id: "ai-product", d: "M200 326V390", label: "PRODUCT MISSING?", labelAt: [200, 359], tone: "cyan" },
  { id: "product-followup", d: "M200 540V590", tone: "yellow" },
  { id: "ai-followup", d: "M354 275H378V565H200V590", tone: "green" },
  { id: "ai-review", d: "M354 259H390V710H200V735", tone: "green" },
  { id: "followup-review", d: "M200 696V735", tone: "green" },
  { id: "review-send", d: "M200 841V874H378V980H200V1000", label: "YOU APPROVE", labelAt: [200, 874], tone: "yellow" },
];

function nodesForRoute(route: ExampleRoute): DiagramNode[] {
  if (route === "contract") return nodes;
  const routeNodes: DiagramNode[] = nodes.filter(node => emailNodeIds.includes(node.id));
  if (route === "product") routeNodes.splice(2, 0, { id: "product", title: "Which product?", detail: "You name it in your reply", tone: "yellow", products: true });
  return routeNodes.map(node => {
    if (node.id === "input") return {
      ...node,
      title: route === "product" ? "Ask about a product" : "Tell me about your enquiry",
      detail: route === "product" ? "Product name and your question" : "Your message and contact details",
    };
    if (node.id === "ai") return { ...node, detail: route === "product" ? "Captures your product question" : "Captures the details of your enquiry" };
    if (node.id === "followup" && route === "product") return { ...node, detail: "Adds the product from your reply" };
    if (node.id === "send") return {
      ...node,
      title: route === "product" ? "Email Dave your question" : "Email Dave your message",
      detail: "Your enquiry and contact details",
      completionNote: "Enquiry complete",
    };
    return node;
  });
}

function WorkflowSvg({ route, small, active, running }: { route: ExampleRoute; small?: boolean; active: AnimationStep | null; running: boolean }) {
  const id = useId().replaceAll(":", "");
  const contract = route === "contract";
  const product = route === "product";
  const positions = small ? (contract ? mobile : product ? productMobile : emailMobile) : desktop;
  const edges = contract ? (small ? mobileEdges : desktopEdges) : product ? (small ? productMobileEdges : productDesktopEdges) : (small ? emailMobileEdges : emailDesktopEdges);
  const workflowTop = small ? (contract || product ? 900 : 700) : 390;
  const diagramNodes = nodesForRoute(route);
  return (
    <svg aria-hidden="true" className={`w-full ${small ? "mx-auto block max-w-[520px] min-[1024px]:hidden" : "hidden min-[1024px]:block"}`} data-workflow-diagram={route} viewBox={small ? (contract ? "0 0 400 1910" : product ? "0 0 400 1160" : "0 0 400 960") : (contract ? "0 0 1000 942" : "0 0 1000 610")}>
      <text x={small ? 46 : 30} y="35" fill="var(--loop-muted)" fontSize={small ? 15 : 13} className="font-caption">{route.toUpperCase()} ENQUIRY</text>
      <rect x={small ? 8 : 12} y={workflowTop} width={small ? 384 : 976} height={contract ? (small ? 995 : 535) : (small ? 245 : 205)} rx="12" fill="var(--loop-cyan-bg)" fillOpacity="0.35" stroke="var(--loop-cyan)" strokeOpacity="0.4" />
      <image href="/images/integrations/vercel-white.svg" x={small ? 28 : 30} y={workflowTop + (small ? 19 : 20)} width="18" height="16" />
      <text x={small ? 58 : 60} y={workflowTop + 34} fill="var(--loop-cyan)" fontSize={small ? 16 : 14} fontWeight="600" className="font-caption">VERCEL WORKFLOWS</text>
      <text x={small ? 28 : 30} y={workflowTop + (small ? 73 : 79)} fill="var(--loop-cyan)" fontSize={20} className="font-data" fontWeight="600">{'"use workflow"'}</text>
      {!small ? <text x="30" y="498" fill="var(--loop-muted)" fontSize="13">{contract ? "Pause. Save state. Resume." : "Reliable email delivery with retries."}</text> : null}
      <defs>
        <marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M1 1L5 3.5L1 6" fill="none" stroke="context-stroke" strokeWidth="1.3" /></marker>
      </defs>
      {edges.map(edge => {
        const highlighted = active?.edge === edge.id;
        const color = `var(--loop-${edge.tone ?? "cyan"})`;
        return <g key={edge.id} data-workflow-edge={edge.id}>
          <path d={edge.d} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={edge.optional ? "5 4" : undefined} opacity="0.45" markerEnd={`url(#${id}-arrow)`} />
          {highlighted && running ? <path className="contact-workflow-trace" d={edge.d} fill="none" stroke={color} strokeWidth="2.5" pathLength="100" markerEnd={`url(#${id}-arrow)`} /> : null}
          {edge.label && edge.labelAt ? <g transform={`translate(${edge.labelAt.join(" ")})`}><rect x={-edge.label.length * 3.7 - 8} y="-11" width={edge.label.length * 7.4 + 16} height="22" rx="4" fill="var(--loop-bg)" /><text textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={small ? 14 : 12} className="font-caption" letterSpacing="0.6">{edge.label}</text></g> : null}
        </g>;
      })}
      {diagramNodes.map(node => {
        const [x, y, w, h] = positions[node.id];
        const selected = active?.node === node.id;
        const humanReview = node.id === "review" || node.id === "owner";
        const humanLabel = humanReview ? "Human review" : node.id === "product" ? "Human input" : null;
        const contentHeight = h - (node.integration || humanLabel ? 28 : 0) - (node.completionNote ? 18 : 0) - (node.products ? 62 : 0);
        const titleX = 16;

        return <g key={node.id} transform={`translate(${x} ${y})`} data-workflow-node={node.id} data-active={selected}>
          <rect width={w} height={h} rx="8" className="transition-[fill] duration-200 motion-reduce:transition-none" fill={selected ? `color-mix(in srgb, var(--loop-${node.tone}-bg) 89%, var(--loop-${node.tone}) 11%)` : `var(--loop-${node.tone}-bg)`} stroke={`var(--loop-${node.tone})`} strokeWidth={selected ? 2.5 : 1} strokeDasharray={node.id === "pause" ? "6 4" : undefined} opacity={selected ? 1 : 0.85} />
          {node.ai ? <><rect x={w-43} y="10" width="31" height="20" rx="4" fill="var(--loop-green)" /><text x={w-27.5} y="24" textAnchor="middle" fontSize={small ? 15 : 12} fontWeight="700" fill="var(--loop-bg)">AI</text></> : null}
          <text x={titleX} y={node.titleLines ? 24 : contentHeight/2-4} fontSize={small ? 20 : 16} fontWeight="600" fill={`var(--loop-${node.tone})`}>
            {(node.titleLines ?? [node.title]).map((line, index) => <tspan key={line} x={titleX} dy={index ? 21 : 0}>{line}</tspan>)}
          </text>
          <text x="16" y={node.titleLines ? contentHeight-15 : contentHeight/2+19} fontSize={small ? 16 : 12} fill="var(--loop-muted)">{node.detail}</text>
          {node.completionNote ? <text x="16" y={contentHeight/2+37} fontSize={small ? 16 : 12} fill="var(--loop-cyan)">{node.completionNote}</text> : null}
          {humanLabel ? <g data-human-review={humanReview || undefined} data-human-input={node.id === "product" || undefined} transform={`translate(16 ${h-24})`}>
            <UserRound aria-hidden="true" width="16" height="16" color="var(--loop-yellow)" strokeWidth="1.8" />
            <text x="24" y="13" fill="var(--loop-muted)" fontSize={small ? 14 : 12}>{humanLabel}</text>
          </g> : null}
          {node.products ? <g aria-hidden="true">
            {portfolioProducts.map((product, index) => <g key={product.slug} transform={`translate(${16 + (index % 2) * ((w - 40) / 2 + 8)} ${h - 62 - (humanLabel ? 28 : 0) + Math.floor(index / 2) * 28})`}>
              <rect width={(w - 40) / 2} height="23" rx="4" fill="var(--loop-yellow)" fillOpacity="0.08" stroke="var(--loop-yellow)" strokeOpacity="0.3" />
              <text x="8" y="16" fill="var(--loop-yellow)" fontSize={small ? 15 : 12}>{product.name}</text>
            </g>)}
          </g> : null}
          {node.integration ? <g data-integration={node.integration} transform={`translate(16 ${h-24})`}>
            {node.integration === "ai" ? <>
              <image href="/images/integrations/vercel-white.svg" width="16" height="14" y="1" />
              <text x="24" y="13" fill="var(--loop-muted)" fontSize={small ? 14 : 12}>AI Gateway</text>
              <image href="/images/integrations/zod-white.png" x="132" width="20" height="17" />
              <text x="159" y="13" fill="var(--loop-muted)" fontSize={small ? 14 : 12}>Zod validation</text>
            </> : (node.integration === "blob" || node.integration === "botid" || node.integration === "workflow") ? <>
              <image href="/images/integrations/vercel-white.svg" width="16" height="14" y="1" />
              <text x="24" y="13" fill="var(--loop-muted)" fontSize={small ? 14 : 12}>{node.integration === "workflow" ? "Vercel workflow" : node.integration === "blob" ? "Vercel Blob" : "Vercel BotID protection"}</text>
            </> : <>
              <image href="/images/integrations/resend-wordmark-white.svg" width="65" height="17" />
              <text x="80" y="13" fill="var(--loop-muted)" fontSize={small ? 14 : 12}>{node.id === "cv" ? "CV attachment" : "Email delivery"}</text>
            </>}
          </g> : null}
        </g>;
      })}
    </svg>
  );
}

function WorkflowStepTitle({ text, animate }: { text: string; animate: boolean }) {
  if (!animate) return <>{text}</>;
  return <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">
      {Array.from(text).map((character, index) => <span
        key={index}
        className="workflow-typing-character"
        style={{ animationDelay: `${index * 18}ms` }}
      >{character}</span>)}
    </span>
  </>;
}

export function ContactWorkflow() {
  const reduceMotion = useReducedMotion();
  const previewRef = useRef<HTMLSpanElement>(null);
  const previewVisible = useInView(previewRef, { once: true, amount: 0.6 });
  const exampleId = useId();
  const [route, setRoute] = useState<ExampleRoute>("contract");
  const sequence = sequences[route];
  const example = examples.find(item => item.route === route)!;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const complete = step >= sequence.length;
  const running = open && !reduceMotion && !paused && !complete;
  const active = !reduceMotion ? sequence[Math.min(step, sequence.length - 1)] : null;
  const activeNode = active ? nodesForRoute(route).find(node => node.id === active.node) : null;
  const showStepControls = !reduceMotion && (paused || complete);
  function moveStep(direction: -1 | 1) {
    setPaused(true);
    setStep(current => Math.max(0, Math.min(sequence.length - 1, Math.min(current, sequence.length - 1) + direction)));
  }
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep(current => current + 1), Math.max(3000, sequence[step].duration * 1.4));
    return () => window.clearTimeout(timer);
  }, [running, step, sequence]);

  return (
    <details className="contact-workflow-disclosure mx-auto max-w-[1100px] overflow-clip rounded-2xl border border-[var(--app-border)] text-sm leading-relaxed text-[var(--app-text-secondary)]" onToggle={event => setOpen(event.currentTarget.open)}>
      <summary className={`cursor-pointer list-none items-center gap-4 px-4 transition-colors hover:bg-[var(--app-muted-section)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--app-focus)] sm:px-5 motion-reduce:transition-none ${open ? "flex min-h-16 justify-between py-3" : "grid grid-cols-[1fr_auto] py-4 sm:grid-cols-[200px_1fr_auto] sm:gap-6 sm:py-5"}`}>
        <span ref={previewRef} aria-hidden="true" data-preview-active={previewVisible && !open && !reduceMotion} className={`workflow-preview col-span-2 row-start-2 items-center justify-center rounded-xl bg-[var(--loop-bg)] px-4 py-3 sm:col-span-1 sm:row-start-1 ${open ? "hidden" : "flex"}`}>
          <span className="workflow-preview-step workflow-preview-ai flex flex-col items-center gap-1 text-[var(--loop-green)]">
            <Sparkles className="size-5" /><span className="font-caption text-[11px]">AI</span>
          </span>
          <span className="workflow-preview-connector workflow-preview-first mx-2 mb-5 h-px w-8 overflow-hidden bg-[var(--loop-muted)]/35" />
          <span className="workflow-preview-step workflow-preview-human flex flex-col items-center gap-1 text-[var(--loop-yellow)]">
            <UserRound className="size-5" /><span className="font-caption text-[11px]">Review</span>
          </span>
          <span className="workflow-preview-connector workflow-preview-second mx-2 mb-5 h-px w-8 overflow-hidden bg-[var(--loop-muted)]/35" />
          <span className="workflow-preview-step workflow-preview-email flex flex-col items-center gap-1 text-[var(--loop-cyan)]">
            <Mail className="size-5" /><span className="font-caption text-[11px]">Email</span>
          </span>
        </span>
        <span className="min-w-0 sm:col-start-2 sm:row-start-1">
          <span className={`font-heading block font-medium leading-tight text-[var(--app-text-primary)] ${open ? "text-xl" : "text-2xl"}`}>{open ? "AI chat enquiry workflow" : "See how this AI chat enquiry works"}</span>
          {!open && <span className="mt-1.5 block text-sm leading-relaxed">Follow this chat from your message to human review and email delivery.</span>}
        </span>
        <span className="flex shrink-0 items-center gap-2 text-[var(--app-label-text)] sm:col-start-3 sm:row-start-1">
          {open && <span className="text-sm font-medium">Hide</span>}
          <ChevronDown aria-hidden="true" className="workflow-disclosure-chevron size-5" />
        </span>
      </summary>
      <div className="px-4 pt-3 pb-5 sm:px-5">
        <p className="mb-5" data-workflow-overview>Choose an example to see how AI, human review and email delivery work together.</p>
        <figure className="overflow-clip rounded-xl border border-[var(--app-border)] bg-[var(--loop-bg)]" aria-label="Complete enquiry workflow" data-workflow-running={running} data-example-route={route} data-workflow-complete={complete}>
          <figcaption className="z-10 border-b border-[var(--app-border)] bg-[var(--loop-header)] px-4 pt-2 pb-5 sm:px-5 min-[1024px]:sticky min-[1024px]:top-20" data-workflow-narration>
            <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 text-[var(--loop-cyan)]">
              <span className="font-caption text-xs font-semibold tracking-wide">{example.label.toUpperCase()} EXAMPLE{active ? ` · STEP ${Math.min(step + 1, sequence.length)} OF ${sequence.length}` : ""}</span>
              {reduceMotion ? <span className="text-xs text-[var(--loop-muted)]">Static view · reduced motion</span> : <div className="flex items-center gap-1">
                {showStepControls && <button type="button" aria-label="Previous step" title="Previous step" disabled={step === 0} onClick={() => moveStep(-1)} className="inline-flex size-11 items-center justify-center rounded hover:bg-[var(--loop-cyan-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--loop-cyan)] disabled:cursor-not-allowed disabled:opacity-35">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>}
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded px-2 text-xs hover:bg-[var(--loop-cyan-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--loop-cyan)]" onClick={() => { if (complete) { setStep(0); setPaused(false); } else setPaused(value => !value); }}>
                  {running ? <Pause size={14} aria-hidden="true" /> : complete ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                  {complete ? "Replay animation" : paused ? "Resume animation" : "Pause animation"}
                </button>
                {showStepControls && <button type="button" aria-label="Next step" title="Next step" disabled={step >= sequence.length - 1} onClick={() => moveStep(1)} className="inline-flex size-11 items-center justify-center rounded hover:bg-[var(--loop-cyan-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--loop-cyan)] disabled:cursor-not-allowed disabled:opacity-35">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>}
              </div>}
            </div>
            <div className="mt-2 border-l-2 pl-4" style={{ borderColor: `var(--loop-${activeNode?.tone ?? "cyan"})` }} aria-live={paused ? "polite" : "off"} aria-atomic="true">
              <p className="text-lg font-semibold leading-snug" style={{ color: `var(--loop-${activeNode?.tone ?? "cyan"})` }} data-workflow-step-title>
                <WorkflowStepTitle key={`${route}-${step}-${open}`} text={activeNode?.title ?? "From your message to Dave’s inbox"} animate={!!active && running} />
              </p>
              <p className="mt-2 text-base leading-relaxed text-[var(--loop-muted)] min-[1024px]:min-h-[3em]">{active?.caption ?? (route === "contract" ? "Prepare and approve the enquiry, then send it. The contract workflow pauses for Dave’s CV decision before resuming." : "Prepare and approve the enquiry, then email it to Dave. This flow finishes at email delivery.")}</p>
            </div>
          </figcaption>
          <fieldset className="border-b border-[var(--app-border)] px-4 py-3">
            <legend className="sr-only">Example enquiry</legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-caption text-[11px] font-semibold tracking-wide text-[var(--loop-muted)]">CHOOSE AN EXAMPLE</span>
              <div className="grid w-full grid-cols-3 gap-2 min-[640px]:w-auto">
                {examples.map(item => <label key={item.route} className="relative cursor-pointer">
                  <input type="radio" name={`${exampleId}-route`} value={item.route} checked={route === item.route} className="peer sr-only" onChange={() => { setRoute(item.route); setStep(0); setPaused(false); }} />
                  <span className="flex min-h-11 items-center justify-center rounded-md border border-[var(--loop-muted)] px-3 text-sm text-[var(--loop-muted)] peer-checked:border-[var(--loop-cyan)] peer-checked:bg-[var(--loop-cyan-bg)] peer-checked:font-semibold peer-checked:text-[var(--loop-cyan)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--loop-cyan)]">{item.label}</span>
                </label>)}
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--loop-muted)]">{example.description}</p>
          </fieldset>
          <ul aria-label="Workflow colour legend" className="grid grid-cols-2 gap-x-5 gap-y-3 border-b border-[var(--app-border)] px-4 py-4 text-xs min-[640px]:flex min-[640px]:flex-wrap">
            {[
              { tone: "yellow", label: "Human action", colour: "Yellow" },
              { tone: "green", label: "AI call", colour: "Green" },
              { tone: "cyan", label: "Automated step or outcome", colour: "Blue" },
              { tone: "pink", label: "Workflow execution paused", colour: "Pink" },
            ].filter(item => route === "contract" || item.tone !== "pink").map(item => <li key={item.tone} className="flex items-start gap-2 text-[var(--loop-muted)]">
              <span aria-hidden="true" className="mt-0.5 size-3 shrink-0 rounded-sm" style={{ backgroundColor: `var(--loop-${item.tone})` }} />
              <span><span className="font-semibold" style={{ color: `var(--loop-${item.tone})` }}>{item.colour}</span> · {item.label}</span>
            </li>)}
          </ul>
          <WorkflowSvg route={route} active={active} running={running} />
          <WorkflowSvg route={route} active={active} running={running} small />
          <p className="font-caption border-t border-[var(--app-border)] px-4 py-3 text-[11px] font-semibold tracking-wide text-[var(--loop-muted)]">ILLUSTRATED EXAMPLE · NOT YOUR ENQUIRY STATUS</p>
          <ol className="sr-only">
            <li>Vercel BotID protects contact requests in production.</li>
            <li>{route === "contract" ? "Describe the role or project." : route === "product" ? "Choose a product and describe your question." : "Describe your enquiry."}</li>
            <li>Write or paste a brief. AI extracts facts through Vercel AI Gateway. Zod validates the structured JSON before the brief updates. Manual entry skips AI.</li>
            {route === "product" ? <li>If the product is missing, the app asks which one you mean: {portfolioProducts.map(product => product.name).join(", ")}. The next AI call records your reply. A product already identified skips that question.</li> : null}
            <li>The app asks for missing details. A separate AI call interprets your reply and updates the brief. This can repeat until the brief is complete.</li>
            {route === "contract" ? <li>An optional contract PDF or DOCX is stored privately in Vercel Blob, outside the AI conversation. Dashed connectors show this optional file branch.</li> : null}
            <li>You review and edit the brief, then explicitly approve sending. {route === "contract" ? "The email includes a private download link to any uploaded file." : "The email includes your enquiry and contact details."}</li>
            <li>The server rechecks the brief. Vercel Workflow emails it to Dave through Resend, retrying transient failures. The app confirms the provider receipt.</li>
            <li>Durable functions use the {'"use workflow"'} directive.</li>
            {route === "contract" ? <li>Workflow execution pauses and saves its state. The contract enquiry email includes a private review action for Dave. Approval resumes workflow execution and sends an email with the CV attached; decline or expiry sends no CV.</li> : <li>Your enquiry is complete once emailed to Dave.</li>}
          </ol>
        </figure>
        <p className="mt-3 flex flex-wrap items-center gap-x-1">Built with <ExternalLink href="https://vercel.com/workflows" className="link-sweep inline-flex min-h-11 items-center font-semibold text-[var(--app-label-text)]"><span className="link-sweep-label">Vercel Workflows</span></ExternalLink></p>
        {route === "contract" ? <p className="mt-4">Paste a brief’s text for AI extraction. PDF and DOCX attachments are stored privately in Vercel Blob and linked in the enquiry email. Dashed lines show this optional file branch. The assistant does not read the files. Links are passed on with your enquiry, not opened automatically.</p> : <p className="mt-4">{route === "product" ? "Share your product question" : "Write your message"}, then review the details before sending. You can also fill in the brief manually and skip AI.</p>}
      </div>
    </details>
  );
}
