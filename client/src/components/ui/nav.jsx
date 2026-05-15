import { Link } from "react-router-dom";

export function Nav() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-medium tracking-tight text-foreground">
            Scale
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v2.4
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-foreground/80">
          <Link to="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>

          <a href="/#logbook" className="hover:text-foreground">
            Logbook
          </a>

          <a href="/#progress" className="hover:text-foreground">
            Progress
          </a>

          <a href="#training" className="hover:text-foreground">
            Training
          </a>

          <a href="#crags" className="hover:text-foreground">
            Crags
          </a>

          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4 text-[13px]">
          <Link
            to="/login"
            className="hidden sm:inline text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="bg-foreground text-background px-3.5 py-1.5 rounded-sm hover:bg-foreground/85 transition-colors"
          >
            Start a logbook
          </Link>
        </div>
      </div>
    </header>
  );
}