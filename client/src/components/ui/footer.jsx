
export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
  <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row justify-between gap-10">

    <div className="max-w-md">
      <h2 className="font-display text-2xl">
        Scale
      </h2>

      <p className="mt-3 text-foreground/70 leading-relaxed">
        A personal climbing logbook I built to track sessions,
        projects, and progress over time.
      </p>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        React • Express • MongoDB • Tailwind CSS
      </p>
    </div>
      <div className="mt-6 flex flex-col items-end gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <a
          href="https://github.com/ashlygenaot"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/ashly-genao-taveras/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>

        <a
          href="mailto:ashlygenao94@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          Contact
        </a>

      <p className="pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">

              Designed & developed by Ashly Genao Taveras · 2026

            </p>

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