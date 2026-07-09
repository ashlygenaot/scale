import { useEffect, useState } from "react";
import Nav from "../components/ui/Nav";
import Footer from "../components/ui/Footer";

const API = "http://localhost:3000/api";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    async function fetchProjects() {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API}/climbs/projects`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );


        const data = await res.json();


        if(!res.ok){
          throw new Error(data.message);
        }


        setProjects(data.projects || []);


      } catch(err){
        setError(err.message);
      }

    }


    fetchProjects();

  }, []);


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
          <p className="text-red-500 mt-5">
            {error}
          </p>
        )}


        <div className="mt-10 border-y border-border">

          {projects.length === 0 ? (

            <p className="py-10 text-center text-muted-foreground">
              No projects yet.
            </p>

          ) : (

            projects.map((project)=>(
              <div
                key={project._id}
                className="py-5 border-b border-border"
              >

                <h2 className="font-display text-2xl">
                  {project.name}
                </h2>


                <div className="flex gap-3 mt-3 font-mono text-sm">

                  <span>
                    {project.grade}
                  </span>

                  <span>
                    {project.type}
                  </span>

                  <span>
                    {project.tries} attempts
                  </span>

                </div>

              </div>
            ))

          )}

        </div>

      </main>


      <Footer />

    </div>
  );
}