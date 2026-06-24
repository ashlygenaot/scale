export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-12 gap-8 text-sm">
        <div className="md:col-span-5">
          <p className="font-display text-2xl">Scale</p>

          <p className="mt-3 text-foreground/70 max-w-sm leading-relaxed">
            A logbook for climbers. Built in Bishop, California by two climbers who got tired of spreadsheets.
          </p>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Made with cold fingers
          </p>
        </div>

        <FooterCol
          title="Product"
          items={["Logbook", "Pyramid", "Sessions", "Crags", "Import"]}
        />

        <FooterCol
          title="Read"
          items={["Field notes", "Changelog", "Methodology", "Press kit"]}
        />

        <FooterCol
          title="Contact"
          items={["hello@scale.log", "@scale.log", "Bishop, CA"]}
        />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span>© 2026 Scale Logbook Co.</span>
          <span>v2.4.1 — released Apr 30</span>
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