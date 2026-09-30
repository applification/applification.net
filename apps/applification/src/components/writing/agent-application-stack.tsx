import { ArrowDown, Database, MessagesSquare, Monitor, Server, ShieldCheck, Smartphone, Waypoints, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

function Node({ title, detail, Icon, accent = false }: { title: string; detail: string; Icon: LucideIcon; accent?: boolean }) {
  return (
    <div className={`relative flex min-h-[70px] items-center gap-3 rounded-xl border bg-[var(--workflow-node)] px-4 py-3 ${accent ? "border-[var(--writing-accent-text)]" : "border-[var(--app-border)]"}`}>
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${accent ? "bg-[var(--workflow-agent-soft)] text-[var(--workflow-agent)]" : "bg-[var(--app-control)] text-[var(--app-text-secondary)]"}`}>
        <Icon aria-hidden="true" size={17} />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold leading-5 text-[var(--app-text-primary)]">{title}</div>
        <div className="mt-1 text-xs leading-[1.5] text-[var(--app-text-secondary)]">{detail}</div>
      </div>
    </div>
  );
}

function Connector({ label }: { label?: string }) {
  return <div data-stack-connector aria-hidden="true" className="flex h-8 min-h-8 shrink-0 items-center justify-center gap-2 text-[var(--writing-accent-text)]"><ArrowDown size={20} strokeWidth={1.2} />{label ? <span className="font-caption text-[10px] text-[var(--app-text-muted)]">{label}</span> : null}</div>;
}

function Clients({ agent = false }: { agent?: boolean }) {
  const clients = agent ? ["ChatGPT", "Codex", "Other hosts"] : ["iOS", "Android", "Web"];
  return <div>
    <div className="grid grid-cols-3 gap-2">
      {clients.map((client, index) => {
        const Icon = agent ? MessagesSquare : index === 2 ? Monitor : Smartphone;
        return <div key={client} className="flex h-[64px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--workflow-node)] text-[var(--app-text-primary)]"><Icon aria-hidden="true" size={18} strokeWidth={1.5} /><span className="text-[11px] font-medium">{client}</span></div>;
      })}
    </div>
    <svg aria-hidden="true" className="h-7 w-full text-[var(--app-border)]" viewBox="0 0 300 28" preserveAspectRatio="none"><path d="M50 0v13h200V0M150 0v28" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
  </div>;
}

function Column({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return <section aria-label={title} className="flex min-w-0 flex-col">
    <div className="mb-5 min-h-[64px]"><h3 className="font-heading text-[26px] leading-tight text-[var(--app-text-primary)]">{title}</h3><p className="mt-2 text-xs leading-5 text-[var(--app-text-secondary)]">{label}</p></div>
    {children}
  </section>;
}

function Ownership({ label, host = false, stretch = false, children }: { label: string; host?: boolean; stretch?: boolean; children: ReactNode }) {
  return <div className={`rounded-xl border p-3 ${stretch ? "flex flex-1 flex-col [&_[data-stack-connector]]:flex-1" : ""} ${host ? "border-dashed border-[var(--app-text-muted)]" : "border-[var(--writing-accent-text)]"}`}>
    <p className={`font-caption mb-4 text-[11px] font-semibold ${host ? "text-[var(--app-text-secondary)]" : "text-[var(--writing-accent-text)]"}`}>{label}</p>
    {children}
  </div>;
}

function Experience({ host = false }: { host?: boolean }) {
  return <div className="rounded-xl bg-[var(--workflow-node)] px-4 py-4">
    <p className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text-primary)]"><Monitor aria-hidden="true" size={16} />{host ? "The host's UI & UX" : "Your product's UI & UX"}</p>
    {host ? <div className="mt-4"><Clients agent /></div> : null}
    <ul className="mt-3 space-y-1.5 text-xs leading-[1.5] text-[var(--app-text-secondary)]">
      {(host ? ["Conversation, history and attachments", "Reasoning and tool coordination", "Ongoing work and notifications"] : ["Screens, navigation and interactions", "Chat, history and attachments", "Orchestration and notifications"]).map(item => <li key={item} className="border-l border-[var(--app-border)] pl-3">{item}</li>)}
    </ul>
    <p className="mt-4 border-t border-[var(--app-border)] pt-3 text-xs font-medium leading-[1.5] text-[var(--app-text-primary)]">{host ? "A familiar experience across products" : "Design, build and maintain for your apps"}</p>
  </div>;
}

export function AgentApplicationStack() {
  return <figure id="agent-application-stack" data-rich-block="agent-application-stack" className="scroll-mt-24 my-10 overflow-hidden rounded-[18px] border border-[var(--app-border)] bg-[var(--app-muted-section)]">
    <div className="border-b border-[var(--app-border)] px-5 py-4"><p className="font-caption text-[11px] font-semibold tracking-[0.5px] text-[var(--writing-accent-text)]">WHO BUILDS THE EXPERIENCE?</p></div>
    <div className="grid gap-9 p-4 min-[600px]:grid-cols-2 min-[600px]:gap-5 min-[600px]:p-5">
      <Column title="Traditional stack" label="The product builds the whole experience.">
        <Ownership label="YOU BUILD & MAINTAIN" stretch>
          <Clients />
          <Experience />
          <Connector />
          <Node title="App backend / API" detail="Operations for your app clients" Icon={Server} />
          <Connector />
          <Node title="Domain & business rules" detail="Permissions and valid changes" Icon={ShieldCheck} />
          <Connector />
          <Node title="Product database" detail="Authoritative data and saved decisions" Icon={Database} />
        </Ownership>
      </Column>
      <Column title="Agent application" label="The host provides the surrounding experience.">
        <Ownership label="THE AGENT HOST PROVIDES" host>
          <Experience host />
        </Ownership>
        <Connector label="tools ⇄ results & UI" />
        <Ownership label="YOU BUILD & MAINTAIN">
          <Node title="Your MCP App" detail="MCP tools + task-specific UI. Recipe cards, weekly plans and cooking steps inside the host." Icon={Waypoints} accent />
          <Connector />
          <Node title="Domain & business rules" detail="Permissions and valid changes" Icon={ShieldCheck} />
          <Connector />
          <Node title="Product database" detail="Authoritative data and saved decisions" Icon={Database} />
        </Ownership>
      </Column>
    </div>
    <figcaption className="border-t border-[var(--app-border)] bg-[var(--app-card)] px-5 py-4 text-[13px] leading-[1.6] text-[var(--app-text-secondary)]">Build the parts that make your product useful. Let the host carry more of the conversation and coordination. Host capabilities vary; a dedicated app can still use the same domain when the job needs it.</figcaption>
  </figure>;
}
