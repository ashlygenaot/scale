import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = "http://localhost:3000/api";

export default function Logbook() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Logbook";

    async function fetchSessions() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sessions");
        }

        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load logbook");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  async function deleteSession(sessionId) {
  if (!window.confirm("Delete this session?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // remove from UI
    setSessions((prev) =>
      prev.filter((s) => s._id !== sessionId)
    );

  } catch (err) {
    setError(err.message);
  }
}

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* HEADER */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Logbook · Training Archive
            </p>

            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
              Your climbing history
            </h1>

            <div className="mt-6 flex gap-3">
              <Link
                to="/sessions/new"
                className="bg-foreground text-background px-4 py-2 text-sm font-mono uppercase tracking-wider"
              >
                + New Session
              </Link>

              <Link
                to="/dashboard"
                className="border border-border px-4 py-2 text-sm font-mono uppercase tracking-wider"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </section>


        {/* CONTENT */}
        <section className="mx-auto max-w-6xl px-6 py-12">

          {error && (
            <p className="font-mono text-sm text-red-500 mb-8">
              {error}
            </p>
          )}

          {loading && (
            <p className="font-mono text-sm text-muted-foreground">
              Loading sessions...
            </p>
          )}


          {/* SESSION LIST */}
{!loading && (
  <section className="border-b border-border pb-16">
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
      01 — Training archive
    </p>

    <h2 className="font-display text-3xl mb-8">
      Sessions
    </h2>

    <div className="border-y-2 border-foreground/80">
      {sessions.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground font-mono text-sm">
          No sessions yet.
        </div>
      ) : (
        <table className="w-full text-[13px] tabular-nums">

          <thead>
            <tr className="border-b border-foreground/20 text-left">
              {["Date", "Location", "Duration", "Notes", ""].map((h) => (
                <th
                  key={h}
                  className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>


          <tbody>
            {sessions.map((session) => (
              <tr
                key={session._id}
                className="border-b border-border hover:bg-background/60 transition-colors"
              >

                <td className="py-4 pr-4 font-mono text-muted-foreground">
                  {new Date(session.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>


                <td className="py-4 pr-4 font-medium">
                  {session.location || "-"}
                </td>


                <td className="py-4 pr-4 font-mono">
                  {session.duration
                    ? `${session.duration} min`
                    : "-"
                  }
                </td>


                <td className="py-4 pr-4 max-w-xs truncate text-foreground/80">
                  {session.notes || "-"}
                </td>


                <td className="py-4 text-right">
                  <Link
                    to={`/sessions/${session._id}/edit`}
                    className="font-mono text-xs uppercase text-primary hover:underline mr-4"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/sessions/${session._id}`}
                    className="font-mono text-[11px] uppercase tracking-wider text-primary hover:underline mr-4"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => deleteSession(session._id)}
                    className="font-mono text-xs uppercase text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  </section>
)}

        </section>
      </main>

      <Footer />
    </div>
  );
}