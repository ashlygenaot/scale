import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = "http://localhost:3000/api";

export default function NewClimbPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

const [name, setName] = useState("");
const [grade, setGrade] = useState("");
const [type, setType] = useState("boulder");
const [tries, setTries] = useState(1);
const [status, setStatus] = useState("project");
const [tags, setTags] = useState("");
const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
  `${API}/climbs/${sessionId}/climbs`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      grade,
      type,
      tries,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }),
  }
);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create climb");
      }

      navigate(`/sessions/${sessionId}`);
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
          <div className="mx-auto max-w-4xl px-6 pt-12 pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Session Entry
            </p>

            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em]">
              Add Climb
            </h1>

            <p className="mt-4 text-sm text-muted-foreground">
              Record a climb from this session.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <form
            onSubmit={handleSubmit}
            className="border-y-2 border-foreground/80 py-8 space-y-8"
          >
            {/* Route Name */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Route Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
                placeholder="The Mandala"
              />
            </div>

            {/* Grade */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Grade
                </label>

                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
                  placeholder="V6"
                />
              </div>

            </div>

            {/* Attempts + Result */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Attempts
                </label>

                <input
                  type="number"
                  min="1"
                  value={tries}
                  onChange={(e) => setTries(Number(e.target.value))}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Result
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
                >
                  <option value="project">Project</option>
                  <option value="send">Send</option>
                  <option value="flash">Flash</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Tags
              </label>

              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
                placeholder="slab, compression, outdoor"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Separate tags with commas.
              </p>
            </div>

            {error && (
              <p className="font-mono text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-foreground text-background px-5 py-2 font-mono text-xs uppercase tracking-wider"
              >
                Save Climb
              </button>

              <button
                type="button"
                onClick={() => navigate(`/sessions/${sessionId}`)}
                className="border border-border px-5 py-2 font-mono text-xs uppercase tracking-wider"
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