import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = import.meta.env.VITE_API_URL;

export default function EditClimb() {

  const { climbId, sessionId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [type, setType] = useState("boulder");
  const [tries, setTries] = useState(1);
  const [status, setStatus] = useState("project");
  const [tags, setTags] = useState("");

  const [error, setError] = useState("");

const [climb, setClimb] = useState(null);
const [session, setSession] = useState(null);

  useEffect(() => {

  async function fetchData() {
    try {

      const token = localStorage.getItem("token");


      // Fetch climb
      const climbRes = await fetch(
        `${API}/climbs/${climbId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const climbData = await climbRes.json();


      if(!climbRes.ok){
        throw new Error(climbData.message);
      }


      setClimb(climbData);

      setName(climbData.name);
      setGrade(climbData.grade);
      setType(climbData.type);
      setTries(climbData.tries);
      setStatus(climbData.status);
      setTags(climbData.tags?.join(", ") || "");



      // Fetch parent session
      const sessionRes = await fetch(
        `${API}/sessions/${sessionId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const sessionData = await sessionRes.json();


      if(!sessionRes.ok){
        throw new Error(sessionData.message);
      }


      setSession(sessionData);


    } catch(err){
      setError(err.message);
    }

  }


  fetchData();

}, [climbId, sessionId]);


  async function handleSubmit(e){

    e.preventDefault();

    try{

      const token = localStorage.getItem("token");


      const res = await fetch(
        `${API}/climbs/${climbId}`,
        {
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          },

          body:JSON.stringify({
            name,
            grade,
            type,
            tries,
            status,
            tags:tags
              .split(",")
              .map(t=>t.trim())
              .filter(Boolean)
          })
        }
      );


      const data = await res.json();


      if(!res.ok){
        throw new Error(data.message);
      }


      navigate(`/session/${sessionId}`);


    }catch(err){
      setError(err.message);
    }

  }



  return (
    <div className="min-h-screen bg-background text-foreground">

      <Nav />

      <main className="mx-auto max-w-4xl px-6 py-12">

        <div className="mb-10">

  {/* SESSION CONTEXT */}
  {session && (
    <div className="mb-6 border-b border-border pb-6">

      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Session
      </p>

      <h2 className="font-display text-2xl mt-2">
        {new Date(session.date).toLocaleDateString()}
      </h2>

      <div className="mt-3 flex flex-wrap gap-3 text-sm font-mono">

        {session.location && (
          <span className="border border-border px-3 py-1">
            {session.location}
          </span>
        )}

        {session.duration && (
          <span className="border border-border px-3 py-1">
            {session.duration} min
          </span>
        )}

      </div>

    </div>
  )}



  {/* CLIMB CONTEXT */}
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Editing Climb
  </p>


  <h1 className="font-display text-4xl mt-2">
    {climb?.name || "Loading..."}
  </h1>


  {climb && (
    <div className="mt-4 flex flex-wrap gap-3 text-sm font-mono">

      <span className="border border-border px-3 py-1">
        Grade: {climb.grade}
      </span>

      <span className="border border-border px-3 py-1">
        Type: {climb.type}
      </span>

      <span className="border border-border px-3 py-1">
        Status: {climb.status}
      </span>

      <span className="border border-border px-3 py-1">
        Attempts: {climb.tries}
      </span>

</div>
  )}
</div>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

  {/* Name */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Route Name
    </label>

    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
    />
  </div>


  {/* Grade */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Grade
    </label>

    <input
      value={grade}
      onChange={(e) => setGrade(e.target.value)}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
    />
  </div>


  {/* Type */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Climb Type
    </label>

    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
    >
      <option value="boulder">Boulder</option>
      <option value="sport">Sport</option>
      <option value="trad">Trad</option>
      <option value="gym">Gym</option>
    </select>
  </div>


  {/* Attempts */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Attempts
    </label>

    <input
      type="number"
      value={tries}
      onChange={(e) => setTries(Number(e.target.value))}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
    />
  </div>


  {/* Status */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Result
    </label>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
    >
      <option value="project">Project</option>
      <option value="send">Send</option>
      <option value="flash">Flash</option>
      <option value="attempt">Attempt</option>
    </select>
  </div>


  {/* Tags */}
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      Tags
    </label>

    <input
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      className="mt-2 border-b w-full bg-transparent p-2 outline-none"
      placeholder="slab, compression, dyno"
    />

    <p className="mt-2 text-xs text-muted-foreground">
      Separate tags with commas.
    </p>
  </div>


  {error && (
    <p className="text-red-500">
      {error}
    </p>
  )}


  <div className="flex gap-3">
    <button
      className="bg-foreground text-background px-5 py-2"
    >
      Save Changes
    </button>

    <button
      type="button"
      onClick={() => navigate(`/sessions/${sessionId}`)}
      className="border border-border px-5 py-2"
    >
      Cancel
    </button>
  </div>
</form>

      </main>

      <Footer />

    </div>
  );
}