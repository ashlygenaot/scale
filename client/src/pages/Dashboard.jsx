import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const API = "http://localhost:3000/api";

const weekLoad = [
  { d: "Mon", hrs: 1.2 },
  { d: "Tue", hrs: 0 },
  { d: "Wed", hrs: 2.4 },
  { d: "Thu", hrs: 0 },
  { d: "Fri", hrs: 1.8 },
  { d: "Sat", hrs: 4.6 },
  { d: "Sun", hrs: 3.1 },
];

const maxLoad = Math.max(...weekLoad.map((w) => w.hrs));

const projects = [
  { name: "Lurking Fear", grade: "V8", crag: "Buttermilks", tries: 47, last: "2d ago", status: "Close" },
  { name: "Acid Wash sit", grade: "V10", crag: "Happy Boulders", tries: 22, last: "6d ago", status: "Working" },
  { name: "Red 8 — gym proj", grade: "~V8", crag: "The Spot", tries: 14, last: "today", status: "Linking" },
  { name: "Direction", grade: "V9", crag: "Way Lake", tries: 8, last: "12d ago", status: "Cold" },
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

function getCurrentWeekRange(date = new Date()) {
  const d = new Date(date);

  // get Monday as start of week
  const day = d.getDay(); // 0 = Sunday
  const diffToMonday = (day === 0 ? -6 : 1) - day;

  const start = new Date(d);
  start.setDate(d.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}

function formatWeekRange(start, end) {
  const options = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", options)} — ${end.toLocaleDateString("en-US", options)}`;
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => reject(err)
    );
  });
}

async function getWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );
  return await res.json();
}

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard — Scale";
  }, []);

     const { start, end } = getCurrentWeekRange();
     const weekLabel = formatWeekRange(start, end);

     const [locationName, setLocationName] = useState("Loading...");
     const [weather, setWeather] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.name || user?.username || "Climber";

  useEffect(() => {
  async function load() {
    try {
      const { lat, lon } = await getUserLocation();

      const data = await getWeather(lat, lon);
      setWeather(data.current_weather);

      const geo = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      ).then((r) => r.json());

      setLocationName(geo.city || geo.locality || "Unknown area");
    } catch (err) {
      console.log(err);
      setLocationName("Location unavailable");
    }
  }

  load();
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
        Dashboard · {displayName}
      </p>

      <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
        Week of <em className="text-primary">{weekLabel}</em>
      </h1>
    </div>

    <Link
      to="/sessions/new"
      className="bg-foreground text-background px-3.5 py-2 text-sm rounded-sm"
    >
      + New entry
    </Link>
  </div>

  <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-y-2 border-foreground/80 divide-x divide-border">
    <Kpi label="Sessions / 7d" value="5" sub="+1 vs prior" />
    <Kpi label="Wall time" value="13.1" unit="hr" />
    <Kpi label="Sends / 7d" value="9" sub="2 outdoor" />
    <Kpi label="Hardest" value="V12" sub="Apr 28 · 3rd go" accent />
  </div>
</div>
        </section>

        {/* 01 — WEEK LOAD */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-12 gap-12">

            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase text-muted-foreground mb-2">
                01 — Weekly load
              </p>
              <h2 className="font-display text-2xl mb-6">Hours on the wall</h2>

              <div className="border-y-2 border-foreground/80 py-6">
                <div className="grid grid-cols-7 gap-3 items-end h-48">
                  {weekLoad.map((w) => (
                    <div key={w.d} className="flex flex-col items-center justify-end gap-2 h-full">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {w.hrs}
                      </span>

                      <div
                        className={`w-full ${w.hrs === 0 ? "bg-border h-px" : "bg-primary"}`}
                        style={{
                          height: w.hrs === 0 ? "1px" : `${(w.hrs / maxLoad) * 100}%`,
                        }}
                      />

                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {w.d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Finger strength trend */}
<div className="lg:col-span-5">
  <div className="flex items-baseline justify-between mb-6">
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        02 — Hangboard
      </p>
      <h2 className="font-display text-2xl">7s @ 20mm, +kg</h2>
    </div>
    <span className="font-mono text-xs text-muted-foreground">8 wks</span>
  </div>

  {/* WRAPPER BORDER (this is what you lost) */}
  <div className="border-y-2 border-foreground/80 py-6">
    <svg
      viewBox="0 0 320 160"
      className="w-full h-48"
      preserveAspectRatio="none"
    >
      {/* grid */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          x2="320"
          y1={i * 40}
          y2={i * 40}
          stroke="currentColor"
          strokeOpacity="0.08"
        />
      ))}

      {/* line */}
      <polyline
        fill="none"
        stroke="var(--rust)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={fingerData
          .map((p, i) => {
            const padding = 20
            const width = 320 - padding * 2
            const x = padding + (i / (fingerData.length - 1)) * width
            const y = 160 - (p.v / fingerMax) * 160
            return `${x},${y}`
          })
          .join(" ")}
      />

      {/* dots */}
      {fingerData.map((p, i) => {
        const padding = 20
        const width = 320 - padding * 2
        const x = padding + (i / (fingerData.length - 1)) * width
        const y = 160 - (p.v / fingerMax) * 160

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="var(--rust)"
          />
        )
      })}
    </svg>

    {/* WEEK LABELS (this is what disappeared) */}
    <div className="grid grid-cols-8 mt-2">
      {fingerData.map((p) => (
        <span
          key={p.wk}
          className="font-mono text-[10px] text-muted-foreground text-center"
        >
          {p.wk}
        </span>
      ))}
    </div>
  </div>

  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
    +14 kg over 8 weeks. Deload due in 2.
  </p>
</div>
</div>
        </section>

        {/* Projects */}
<section className="border-b border-border bg-secondary/30">
  <div className="mx-auto max-w-6xl px-6 py-16">

    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          03 — Open projects
        </p>
        <h2 className="font-display text-3xl">
          Four lines, in order of obsession.
        </h2>
      </div>

      <a
        href="#all"
        className="font-mono text-xs underline underline-offset-4 hover:text-foreground text-muted-foreground"
      >
        See all 11 →
      </a>
    </div>

    <div className="border-y-2 border-foreground/80">
      <table className="w-full text-[13px] tabular-nums">
        <thead>
          <tr className="border-b border-foreground/20 text-left">
            {["Project", "Grade", "Crag", "Tries", "Last", "Status"].map((h) => (
              <th
                key={h}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal py-3 pr-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr
              key={p.name}
              className="border-b border-border hover:bg-background/60 transition-colors"
            >
              <td className="py-3 pr-4 font-medium">{p.name}</td>
              <td className="py-3 pr-4 font-mono">{p.grade}</td>
              <td className="py-3 pr-4 text-foreground/80">{p.crag}</td>
              <td className="py-3 pr-4 font-mono">{p.tries}</td>
              <td className="py-3 pr-4 font-mono text-muted-foreground">
                {p.last}
              </td>
              <td className="py-3 pr-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
</section>

        {/* Recent + conditions */}
<section className="border-b border-border">
  <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-12 gap-12">

    {/* RECENT ENTRIES */}
    <div className="lg:col-span-7">
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          04 — Recent entries
        </p>
        <h2 className="font-display text-2xl mb-6">Last five climbs</h2>
      </div>

      {/* BORDER WRAPPER (this is what you lost) */}
      <div className="border-y-2 border-foreground/80">
        <table className="w-full text-[13px] tabular-nums">
          <tbody>
            {recent.map((r, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-background/60 transition-colors"
              >
                <td className="py-3 pr-4 font-mono text-muted-foreground w-20">
                  {r.d}
                </td>
                <td className="py-3 pr-4 font-medium">
                  {r.route}
                </td>
                <td className="py-3 pr-4 font-mono">
                  {r.g}
                </td>
                <td className="py-3 text-right font-mono text-primary">
                  {r.r}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* CONDITIONS (keep as-is if yours is working) */}
    <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-border">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
  05 — Conditions · {locationName}
</p>

<h2 className="font-display text-2xl mb-6">
  {weather ? "Conditions update" : "Loading conditions..."}
</h2>

{weather && (
  <dl className="space-y-3 font-mono text-[13px] border-y-2 border-foreground/80 py-5">
    {[
      ["Temperature", `${weather.temperature}°C`],
      ["Wind speed", `${weather.windspeed} km/h`],
      ["Wind direction", `${weather.winddirection}°`],
    ].map(([k, v]) => (
      <div key={k} className="flex items-baseline justify-between">
        <dt className="text-muted-foreground">{k}</dt>
        <dd className="tabular-nums">{v}</dd>
      </div>
    ))}
  </dl>
)}

<p className="mt-5 text-sm text-foreground/75 leading-relaxed">
  {weather
    ? "Real-time weather based on your current location."
    : "Fetching conditions..."}
</p>
    </aside>

  </div>
</section>

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
        {value} {unit && <span className="text-sm">{unit}</span>}
      </p>

      {sub && (
        <p className="font-mono text-[11px] text-muted-foreground mt-2">
          {sub}
        </p>
      )}
    </div>
  );
}