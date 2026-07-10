
export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-12 gap-8 text-sm">
        <div className="md:col-span-5">
          <p className="font-display text-2xl">Scale</p>

          <p className="mt-3 text-foreground/70 max-w-sm leading-relaxed">
            A personal climbing logbook for tracking sessions, projects, and progress.
            Built by climbers who wanted a better way to remember every attempt.
          </p>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Built between attempts
          </p>
        </div>

        <FooterCol
          title="Climb"
          items={["Logbook", "Sessions", "Projects", "Pyramid"]}
        />

        <FooterCol
          title="About"
          items={["Story", "Updates"]}
        />

        <FooterCol
          title="Elsewhere"
          items={["GitHub", "Contact"]}
        />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span>© 2026 Scale</span>
          <span>Made for the days worth remembering</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div className="md:col-span-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
        {title}
      </p>

      <ul className="space-y-2 text-foreground/80">
        {items.map((i) => (
          <li key={i} className="hover:text-foreground cursor-pointer">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}