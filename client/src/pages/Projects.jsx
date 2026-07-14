import { useEffect, useState } from "react";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = "http://localhost:3000/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const currentProjects = projects.filter((p) => p.status === "project" || p.isProject);
  const completedProjects = projects.filter((p) => p.status === "send" || p.status === "flash");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/climbs/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProjects();
  }, []);

  async function markComplete(projectId) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/climbs/climb/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "send",
          isProject: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

        setProjects((prev) =>
        prev.map((p)=>
          p._id === projectId
            ? { ...p, status:"send", isProject: false }
            : p
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteProject(projectId) {
    if (!window.confirm("Delete this project?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/climbs/climb/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

       setProjects((prev) =>
      prev.filter((p) => p._id !== projectId)
    );

  } catch (err) {
    setError(err.message);
  }
}
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Projects
        </p>

        <h1 className="font-display text-5xl mt-3">
          Current Projects
        </h1>

        {error && (
          <p className="mt-5 text-red-500">
            {error}
          </p>
        )}

        <div className="mt-10 border-y-2 border-foreground/80">
          {currentProjects.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No projects yet.
            </div>
          ) : (
            <table className="w-full text-[13px] tabular-nums">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Project
                  </th>

                  <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Grade
                  </th>

                  <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Type
                  </th>

                  <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Tries
                  </th>

                  <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Status
                  </th>

                  <th className="w-40 py-3 pl-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-border hover:bg-background/60 transition-colors"
                  >
                    <td className="py-4 pr-4 font-medium">
                      {project.name}
                    </td>

                    <td className="py-4 pr-4 font-mono text-primary">
                      {project.grade}
                    </td>

                    <td className="py-4 pr-4 text-foreground/70">
                      {project.type}
                    </td>

                    <td className="py-4 pr-4 font-mono">
                      {project.tries}
                    </td>

                    <td className="py-4 pr-4 font-mono uppercase">
                      {project.status}
                    </td>

                    <td className="w-40 py-4 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => markComplete(project._id)}
                        className="mr-4 font-mono text-[11px] uppercase tracking-wider text-primary hover:underline"
                      >
                        Sent
                      </button>

                      <button
                        onClick={() => deleteProject(project._id)}
                        className="font-mono text-[11px] uppercase tracking-wider text-red-500 hover:underline"
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
        <section className="mt-20">
  <div className="mb-6">
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
      Completed
    </p>

    <h2 className="font-display text-5xl">
      Finished climbs
    </h2>
  </div>

  <div className="border-y-2 border-foreground/80">
    {completedProjects.length === 0 ? (
      <div className="py-12 text-center text-muted-foreground">
        Nothing completed yet.
      </div>
    ) : (
      <table className="w-full text-[13px] tabular-nums">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
              Project
            </th>

            <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
              Grade
            </th>

            <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
              Attempts
            </th>

            <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-wider">
              Result
            </th>
          </tr>
        </thead>

        <tbody>
          {completedProjects.map((project) => (
            <tr
              key={project._id}
              className="border-b border-border"
            >
              <td className="py-4">{project.name}</td>

              <td className="py-4 font-mono">
                {project.grade}
              </td>

              <td className="py-4 font-mono">
                {project.tries}
              </td>

              <td className="py-4 font-mono text-primary">
                ✓ Sent
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}