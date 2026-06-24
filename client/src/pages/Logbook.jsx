import { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/ui/Nav";
import Footer from "../components/ui/Footer";

const weekLoad = [
  { d: "Mon", hrs: 1.2, kind: "Indoor" },
  { d: "Tue", hrs: 0, kind: "Rest" },
  { d: "Wed", hrs: 2.4, kind: "Board" },
  { d: "Thu", hrs: 0, kind: "Rest" },
  { d: "Fri", hrs: 1.8, kind: "Indoor" },
  { d: "Sat", hrs: 4.6, kind: "Outside" },
  { d: "Sun", hrs: 3.1, kind: "Outside" },
];

const maxLoad = Math.max(...weekLoad.map((w) => w.hrs));

const projects = [
  {
    name: "Lurking Fear",
    grade: "V8",
    crag: "Buttermilks",
    tries: 47,
    last: "2d ago",
    status: "Close",
  },
  {
    name: "Acid Wash sit",
    grade: "V10",
    crag: "Happy Boulders",
    tries: 22,
    last: "6d ago",
    status: "Working",
  },
  {
    name: "Red 8 — gym proj",
    grade: "~V8",
    crag: "The Spot",
    tries: 14,
    last: "today",
    status: "Linking",
  },
  {
    name: "Direction",
    grade: "V9",
    crag: "Way Lake",
    tries: 8,
    last: "12d ago",
    status: "Cold",
  },
];

const recent = [
  { d: "Apr 28", route: "The Mandala", g: "V12", r: "Send" },
  { d: "Apr 26", route: "High Plains Drifter", g: "V7", r: "Flash" },
  { d: "Apr 22", route: "Acid Wash", g: "V9", r: "Send" },
  { d: "Apr 18", route: "Red 8 (proj)", g: "~V8", r: "Worked" },
  { d: "Apr 15", route: "Set 4 / Yellow", g: "V5", r: "Send" },
];

const fingerData = [
  { wk: "W1", v: 38 },
  { wk: "W2", v: 41 },
  { wk: "W3", v: 40 },
  { wk: "W4", v: 44 },
  { wk: "W5", v: 46 },
  { wk: "W6", v: 45 },
  { wk: "W7", v: 49 },
  { wk: "W8", v: 52 },
];

const fingerMax = 60;

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard — Scale";
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      <main>
        {/* HEADER */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  Logbook · M. Reyes
                </p>

                <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
                  Week of <em className="text-primary">Apr 26 — May 2</em>
                </h1>
              </div>

              <div className="flex items-center gap-3 text-[13px]">
                <button className="font-mono text-[11px] uppercase tracking-wider px-3 py-2 border border-border hover:border-foreground/60">
                  Export CSV
                </button>

                <Link
                  to="/sessions/new"
                  className="bg-foreground text-background px-3.5 py-2 text-sm rounded-sm hover:bg-foreground/85"
                >
                  + New Entry
                </Link>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-y-2 border-foreground/80 divide-x divide-border">
              <Kpi label="Sessions / 7d" value="5" sub="+1 vs prior" />
              <Kpi
                label="Wall time"
                value="13.1"
                unit="hr"
                sub="moderate load"
              />
              <Kpi label="Sends / 7d" value="9" sub="2 outdoor" />
              <Kpi
                label="Hardest"
                value="V12"
                sub="Apr 28 · 3rd go"
                accent
              />
            </div>
          </div>
        </section>

        {/* keep the rest of your JSX exactly as-is */}
      </main>

      <Footer />
    </div>
  );
}

function Kpi({ label, value, unit, sub, accent }) {
  return (
    <div className="px-5 py-6">
      <p className="font-mono text-[10px] uppercase text-muted-foreground">
        {label}
      </p>

      <p className={`text-4xl mt-2 ${accent ? "text-primary" : ""}`}>
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </p>

      {sub && (
        <p className="font-mono text-[11px] text-muted-foreground mt-2">
          {sub}
        </p>
      )}
    </div>
  );
}