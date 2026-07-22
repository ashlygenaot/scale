import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";
import { formatLocalDate } from "../utils/date";

const API = import.meta.env.VITE_API_URL;

export default function EditSession() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date:"",
    location:"",
    duration:"",
    notes:"",
  });

  const [error,setError] = useState("");


  useEffect(()=>{

    async function fetchSession(){

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/sessions/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setForm({
        date: formatLocalDate(data.session.date),
        location: data.session.location || "",
        duration: data.session.duration || "",
        notes: data.session.notes || "",
      });

    }

    fetchSession();

  },[id]);



  async function handleSubmit(e){

    e.preventDefault();

    try{

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/sessions/${id}`,
        {
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
          },
          body:JSON.stringify(form)
        }
      );


      const data = await res.json();


      if(!res.ok){
        throw new Error(data.message);
      }


      navigate(`/sessions/${id}`);


    }catch(err){
      setError(err.message);
    }

  }



return (
<div className="min-h-screen bg-background text-foreground">

<Nav />

<main className="max-w-4xl mx-auto px-6 py-12">

<h1 className="font-display text-5xl">
Edit Session
</h1>


<form
onSubmit={handleSubmit}
className="mt-10 space-y-6 border-y-2 border-foreground/80 py-8"
>


<input
type="date"
value={form.date}
onChange={(e)=>setForm({...form,date:e.target.value})}
className="w-full border-b bg-transparent py-2"
/>


<input
value={form.location}
onChange={(e)=>setForm({...form,location:e.target.value})}
placeholder="Location"
className="w-full border-b bg-transparent py-2"
/>


<input
type="number"
value={form.duration}
onChange={(e)=>setForm({...form,duration:e.target.value})}
placeholder="Duration"
className="w-full border-b bg-transparent py-2"
/>


<textarea
value={form.notes}
onChange={(e)=>setForm({...form,notes:e.target.value})}
placeholder="Notes"
className="w-full border-b bg-transparent py-2"
/>


<div className="flex gap-3 pt-4">

  <button
    type="submit"
    className="bg-foreground text-background px-5 py-2 font-mono text-xs uppercase tracking-wider"
  >
    Save Changes
  </button>

  <button
    type="button"
    onClick={() => navigate(`/sessions/${id}`)}
    className="border border-border px-5 py-2 font-mono text-xs uppercase tracking-wider hover:bg-muted transition-colors"
  >
    Cancel
  </button>

</div>

</form>


</main>

<Footer/>

</div>
)

}