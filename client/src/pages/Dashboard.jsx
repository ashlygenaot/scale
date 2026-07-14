import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/ui/nav";
import Footer from "@/components/ui/footer";

const API = "http://localhost:3000/api";


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

const getWeather = async (lat, lon) => {
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`
  ).then((res) => res.json());
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [locationName, setLocationName] = useState("Loading...");
  const [weather, setWeather] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.name || user?.username || "Climber";

  const maxLoad = Math.max(
  ...(dashboard?.weekLoad?.map((w) => w.hrs) || [0]),
  1
);

  useEffect(() => {
    document.title = "Dashboard — Scale";
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");

        console.log("Token being sent:", token);

        const res = await fetch(`${API}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
      console.log("Dashboard data:", data);
        setDashboard(data);
      } 
      catch (err) {
        console.error(err);
      }
    }

    loadDashboard();
  }, []);

  const { start, end } = getCurrentWeekRange();
  const weekLabel = formatWeekRange(start, end);

  useEffect(() => {
    async function load() {
      try {
        const { lat, lon } = await getUserLocation();

        const data = await getWeather(lat, lon);

        setWeather({
          temperature: data.current.temperature_2m,
          windspeed: data.current.wind_speed_10m,
          winddirection: data.current.wind_direction_10m,
        });

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
        Dashboard · Hello! {displayName}
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
    <Kpi
  label="Sessions"
  value={dashboard?.stats.sessionsLastWeek ?? 0}
/>

<Kpi
  label="Wall Time"
  value={dashboard?.stats.hours ?? 0}
  unit="hr"
/>

<Kpi
  label="Sends"
  value={dashboard?.stats.sends ?? 0}
/>

<Kpi
  label="Hardest"
  value={dashboard?.stats.hardestGrade ?? "-"}
  accent
/>
  </div>
</div>
        </section>

        {/* 01 — WEEK LOAD */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12">

            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase text-muted-foreground mb-2">
                01 — Weekly load
              </p>
              <h2 className="font-display text-2xl mb-6">Hours on the wall</h2>

              <div className="border-y-2 border-foreground/80 py-6">
                <div className="grid grid-cols-7 gap-3 items-end h-48">
                  {dashboard?.weekLoad.map((w) => (
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
            </div>
        </section>

        {/* Projects */}
<section className="border-b border-border bg-secondary/30">
  <div className="mx-auto max-w-6xl px-6 py-16">

    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          02 — Open projects
        </p>
        <h2 className="font-display text-3xl">
          Four lines, in order of obsession.
        </h2>
      </div>

      <a
        href="/projects"
        className="font-mono text-xs underline underline-offset-4 hover:text-foreground text-muted-foreground"
      >
        See all →
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
          {dashboard?.projects?.map((project) => (
            <tr
              key={project.name}
              className="border-b border-border hover:bg-background/60 transition-colors"
            >
              <td className="py-3 pr-4 font-medium">{project.name}</td>
              <td className="py-3 pr-4 font-mono">{project.grade}</td>
              <td className="py-3 pr-4 text-foreground/80">{project.location}</td>
              <td className="py-3 pr-4 font-mono">{project.tries}</td>
              <td className="py-3 pr-4 font-mono text-muted-foreground">
                {project.last}
              </td>
              <td className="py-3 pr-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  {project.status}
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
          03 — Recent entries
        </p>
        <h2 className="font-display text-2xl mb-6">Last five climbs</h2>
      </div>

      {/* BORDER WRAPPER (this is what you lost) */}
      <div className="border-y-2 border-foreground/80">
        <table className="w-full text-[13px] tabular-nums">
          <thead>
  <tr className="border-b border-border text-left">
    <th className="py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      Date
    </th>
    <th className="py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      Route
    </th>
    <th className="py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      Grade
    </th>
    <th className="py-3 text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">
      Result
    </th>
  </tr>
</thead>
          <tbody>
           {dashboard?.recent?.map((r, i) => (
  <tr
    key={r._id || i}
    className="border-b border-border hover:bg-background/60 transition-colors"
  >
    <td className="py-3 pr-4 font-mono text-muted-foreground">
      {new Date(r.date).toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
})}
    </td>

    <td className="py-3 pr-4 font-medium">
      {r.name || r.routeName || "Unnamed"}
    </td>

    <td className="py-3 pr-4 font-mono">
      {r.grade}
    </td>

    <td className="py-3 text-right font-mono text-primary">
      {r.status}
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
  04 — Conditions · {locationName}
</p>

<h2 className="font-display text-2xl mb-6">
  {weather ? "Conditions update" : "Loading conditions..."}
</h2>

{weather && (
  <dl className="space-y-3 font-mono text-[13px] border-y-2 border-foreground/80 py-5">
    {[
      ["Temperature", `${weather.temperature}°F`],
      ["Wind speed", `${weather.windspeed} mph`],
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