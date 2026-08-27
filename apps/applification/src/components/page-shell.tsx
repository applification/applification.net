type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
        <span className="shell-marker">Ready for StoryLoops</span>
      </section>
    </main>
  );
}
