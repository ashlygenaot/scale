import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const API = "http://localhost:3000/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [progression, setProgression] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [summaryRes, progRes] = await Promise.all([
          fetch(`${API}/analytics/summary`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API}/analytics/progression`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const summaryData = await summaryRes.json();
        const progData = await progRes.json();

        setSummary(summaryData);
        setProgression(progData);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 font-mono text-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Logbook
            </p>
            <h1 className="text-4xl font-display mt-2">
              Your Climbing Dashboard
            </h1>
          </div>

          <Link
            to="/sessions/new"
            className="bg-foreground text-background px-4 py-2 text-sm"
          >
            + New Session
          </Link>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 border border-border mb-10">
          <Kpi label="Sessions" value={summary.totalSessions} />
          <Kpi label="Climbs" value={summary.totalClimbs} />
          <Kpi label="Max Grade" value={summary.maxGrade} />
          <Kpi
            label="Success Rate"
            value={`${Math.round(summary.successRate * 100)}%`}
          />
        </div>

        {/* PROGRESSION */}
        <section className="mb-12">
          <h2 className="text-xl font-display mb-4">Progression</h2>

          <div className="border border-border p-4">
            <div className="grid grid-cols-7 gap-2 items-end h-40">
              {progression.map((p) => (
                <div key={p.date} className="flex flex-col items-center">
                  <div
                    className="bg-primary w-full"
                    style={{
                      height: `${(p.maxGrade / summary.maxGrade) * 100}%`,
                    }}
                  />
                  <span className="text-[10px] font-mono mt-2">
                    {p.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="text-sm font-mono text-muted-foreground">
          <p>
            This week: {summary.totalClimbs} climbs • Peak grade {summary.maxGrade}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* KPI COMPONENT */
function Kpi({ label, value }) {
  return (
    <div className="p-4 border-r border-border last:border-r-0">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
}