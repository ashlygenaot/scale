import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = import.meta.env.VITE_API_URL;

export default function NewEntry() {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          location,
          duration: Number(duration),
          notes,
        }),
      });

      const data = await res.json();

      console.log("CREATE SESSION RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create session");
      }

      navigate(`/sessions/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* HEADER */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 pt-12 pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Logbook · New Session
            </p>

            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
              Start a new entry
            </h1>
          </div>
        </section>

        {/* FORM */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <form
            onSubmit={handleSubmit}
            className="border-y-2 border-foreground/80 py-8 space-y-8"
          >
            {/* DATE */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Gym, crag, board..."
                className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none"
              />
            </div>

            {/* DURATION */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="120"
                className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Notes
              </label>

              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Conditions, goals, observations..."
                className="mt-2 w-full border border-border bg-transparent p-4 outline-none resize-none"
              />
            </div>

            {error && (
              <p className="font-mono text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-foreground text-background px-6 py-3 text-sm font-mono uppercase tracking-wider hover:opacity-90 transition"
              >
                {loading ? "Creating..." : "Create Session"}
              </button>

              <button
  type="button"
  onClick={() => navigate("/sessions")}
  className="border border-border px-6 py-3 text-sm font-mono uppercase tracking-wider"
>
  Cancel
</button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}