import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = import.meta.env.VITE_API_URL;

export default function SessionPage() {
  const { sessionId } = useParams();

  console.log("SESSION ID:", sessionId);

  const [session, setSession] = useState(null);
  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Session — Scale";

    async function fetchSession() {
      try {
        const token = localStorage.getItem("token");

        // fetch session
        const sessionRes = await fetch(`${API}/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sessionData = await sessionRes.json();

        if (!sessionRes.ok) {
          throw new Error(sessionData.message || "Failed to load session");
        }

        // fetch climbs
        const climbsRes = await fetch(
          `${API}/climbs/${sessionId}/climbs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const climbsData = await climbsRes.json();

        setSession(sessionData.session || sessionData);
        setClimbs(climbsData.climbs || []);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  async function handleDelete(climbId) {
  const confirmDelete = window.confirm(
    "Delete this climb?"
  );

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  await fetch(
    `${API}/sessions/climbs/${climbId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setClimbs((prev) =>
    prev.filter((c) => c._id !== climbId)
  );
}

  const sends = climbs.filter((c) => c.status === "send" || c.status === "flash");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* HEADER */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Session · {session?.location || "Loading..."}
            </p>
            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
              {session
                ? new Date(session.date).toLocaleDateString()
                : "Loading session..."}
            </h1>

            <p className="mt-4 text-sm text-muted-foreground">
              {session?.notes || "No notes for this session."}
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                to="/logbook"
                className="border border-border px-4 py-2 text-sm font-mono uppercase tracking-wider"
              >
                Back to Logbook
              </Link>

               <Link
                to={`/sessions/${sessionId}/edit`}
                className="border border-border px-4 py-2 text-sm font-mono uppercase tracking-wider hover:bg-muted transition-colors"
              >
                Edit Session
              </Link>


              <Link
                to={`/sessions/${sessionId}/new-climb`}
                className="bg-foreground text-background px-4 py-2 text-sm font-mono uppercase tracking-wider"
              >
                + Add Climb
              </Link>
            </div>
          </div>
        </section>


        {/* CONTENT */}
        <section className="mx-auto max-w-6xl px-6 py-12 space-y-12">
          {error && (
            <p className="font-mono text-sm text-red-500">{error}</p>
          )}

          {loading && (
            <p className="font-mono text-sm text-muted-foreground">
              Loading session...
            </p>
          )}

          {/* SESSION STATS */}
          {session && (
            <div className="grid grid-cols-3 border-y-2 border-foreground/80 divide-x divide-border">
              <Stat label="Climbs" value={climbs.length} />
              <Stat label="Sends" value={sends.length} />
              <Stat
                label="Send Rate"
                value={`${Math.round(
                  (sends.length / (climbs.length || 1)) * 100
                )}%`}
              />
            </div>
          )}

          {/* CLIMBS TABLE */}
          <div>
            <h2 className="font-display text-2xl mb-6">Climbs</h2>

            <div className="border-y border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-3 font-mono text-xs">Name</th>
                    <th className="py-3 font-mono text-xs">Grade</th>
                    <th className="py-3 font-mono text-xs">Attempts</th>
                    <th className="py-3 font-mono text-xs">Result</th>
                    <th className="py-3 font-mono text-xs">Actions</th>
                  </tr>
                </thead>

                  <tbody>
  {climbs.length === 0 ? (
    <tr>
      <td
        colSpan="5"
        className="py-10 text-center text-muted-foreground"
      >
        No climbs logged yet.
      </td>
    </tr>
  ) : (
    climbs.map((c) => (
      <tr key={c._id} className="border-b border-border">
        <td className="py-3">
          {c.name || "Unnamed climb"}
        </td>

        <td className="font-mono">
          {c.grade || "-"}
        </td>

        <td className="font-mono">
          {c.tries ?? 0}
        </td>

        <td className="font-mono">
          {c.status ?? 0}
        </td>


      <td className="font-mono text-xs">
       <Link
        to={`/sessions/${sessionId}/climb/${c._id}/edit`}
        className="mr-3 hover:underline"
      >
        Edit
      </Link>

        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(c._id)}
        >
          Delete
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
              </table>

              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* small UI helper */
function Stat({ label, value }) {
  return (
    <div className="px-5 py-6 text-center">
      <p className="font-mono text-[10px] uppercase text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-3xl mt-2">{value}</p>
    </div>
  );
}

