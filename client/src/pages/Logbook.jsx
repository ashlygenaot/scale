import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/ui/Nav";
import Footer from "../components/ui/Footer";

const API = "http://localhost:3000/api";

export default function Logbook() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Logbook — Scale";

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
                to="/session/new"
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
            <div>
              <h2 className="font-display text-2xl mb-6">
                Sessions
              </h2>

              <div className="border-y border-border">

                {sessions.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No sessions yet.
                  </div>
                ) : (

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="py-3 font-mono text-xs">
                          Date
                        </th>

                        <th className="py-3 font-mono text-xs">
                          Location
                        </th>

                        <th className="py-3 font-mono text-xs">
                          Duration
                        </th>

                        <th className="py-3 font-mono text-xs">
                          Notes
                        </th>

                        <th className="py-3 font-mono text-xs">
                        </th>
                      </tr>
                    </thead>


                    <tbody>
                      {sessions.map((session) => (
                        <tr
                          key={session._id}
                          className="border-b border-border"
                        >

                          <td className="py-4">
                            {new Date(
                              session.date
                            ).toLocaleDateString()}
                          </td>


                          <td>
                            {session.location || "-"}
                          </td>


                          <td className="font-mono">
                            {session.duration
                              ? `${session.duration} min`
                              : "-"
                            }
                          </td>


                          <td className="max-w-xs truncate">
                            {session.notes || "-"}
                          </td>


                          <td>
                            <Link
                              to={`/session/${session._id}`}
                              className="font-mono text-xs uppercase text-primary hover:underline"
                            >
                              View →
                            </Link>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>

                )}

              </div>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}