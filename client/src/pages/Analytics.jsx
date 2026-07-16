import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

import Nav from "../components/ui/nav";
import Footer from "../components/ui/footer";

const API = import.meta.env.VITE_API_URL;


export default function Analytics(){

const [data,setData] = useState(null);
const [error,setError] = useState("");



useEffect(()=>{
  document.title = "Analytics • Scale";

async function fetchAnalytics(){

try{

const token = localStorage.getItem("token");


const res = await fetch(
`${API}/analytics`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


const json = await res.json();


if(!res.ok){
throw new Error(json.message);
}


setData(json);

}catch(err){

setError(err.message);

}

}


fetchAnalytics();


},[]);



if(error)
return <p>{error}</p>



if(!data)
return <p className="p-10">
Loading analytics...
</p>



return (

<div className="min-h-screen bg-background text-foreground">

<Nav/>


<main className="max-w-6xl mx-auto px-6 py-12">

<div className="space-y-20">

<section>
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Overview
  </p>

  <h2 className="font-display text-3xl mt-2">
    At a glance
  </h2>

  <p className="mt-3 text-sm text-muted-foreground">
    A summary of your climbing activity and performance.
  </p>

  {/* STATS */}

<div className="grid md:grid-cols-4 gap-4 mt-10">

<Stat
label="Sessions"
value={data.stats.sessions}
/>


<Stat
label="Climbs"
value={data.stats.totalClimbs}
/>


<Stat
label="Sends"
value={data.stats.sends}
/>


<Stat
label="Send Rate"
value={`${data.stats.sendRate}%`}
/>


</div>
</section>

<section>

<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
 Insights
</p>

<h2 className="font-display text-3xl mt-2">
 Performance Notes
</h2>


<div className="grid md:grid-cols-2 gap-4 mt-8">

{data.insights.map((insight,index)=>(

<div
key={index}
className="border border-border p-5"
>

<p className="font-mono text-[10px] uppercase text-muted-foreground">
{insight.type}
</p>

<p className="mt-3 text-sm">
{insight.text}
</p>

</div>

))}

</div>

</section>

<section>
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Performance
  </p>

  <h2 className="font-display text-3xl mt-2">
    Personal Best Progression
  </h2>

  <p className="mt-3 text-sm text-muted-foreground">
    Your highest grade ever sent, shown as it improved over time.
  </p>

  <div className="border border-border p-6 h-[350px] mb-16">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.gradeProgression}>
        <CartesianGrid strokeDasharray="3 3" />

       <XAxis
        dataKey="session"
        interval={0}
        angle={-25}
        textAnchor="end"
        height={80}
      />

        <YAxis
          allowDecimals={false}
          domain={[0, "auto"]}
          tickFormatter={(v) => `V${v}`}
        />

        <Tooltip
        formatter={(value) => [`V${value}`, "Personal Best"]}
        labelFormatter={(label) => label}
      />

        <Line
          type="monotone"
          dataKey="grade"
          stroke="var(--clay)"
          strokeWidth={3}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <h2 className="font-display text-3xl mb-2">
  Grade Distribution
</h2>

<p className="text-sm text-muted-foreground mb-6">
  See which grades make up most of your climbing.
</p>

  <div className="border border-border p-6 h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.gradeDistribution}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="grade" />

        <YAxis
          allowDecimals={false}
        />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="var(--rust)"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

</section>



{/* MONTHLY VOLUME */}

<section>
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Volume
  </p>

  <h2 className="font-display text-3xl mt-2">
    Climbing Volume
  </h2>

  <p className="mt-3 text-sm text-muted-foreground">
    Measure how consistently you've been climbing over time.
  </p>

  <div className="border border-border p-6 h-[350px]">


<ResponsiveContainer width="100%" height="100%">

<BarChart
data={data.monthlyVolume}
>


<CartesianGrid strokeDasharray="3 3"/>


<XAxis
dataKey="month"
/>


<YAxis
allowDecimals={false}
domain={[0, "auto"]}

/>


<Tooltip/>


<Bar
dataKey="count"
fill="var(--rust)"
/>


</BarChart>


</ResponsiveContainer>


</div>

</section>


    <section>
  <h2 className="font-display text-3xl mb-2">
    Weekly Trends
  </h2>

  <p className="text-sm text-muted-foreground mb-8">
    Compare your climbing volume with your weekly send rate.
  </p>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Weekly Volume */}
    <div>
      <h3 className="font-display text-2xl mb-2">
        Weekly Volume
      </h3>


      <p className="text-sm text-muted-foreground mb-6">
        Climbs completed each week.
      </p>
    
      <div className="border border-border p-6 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.weeklyVolume}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="var(--rust)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Send Rate */}
    <div>
      <h3 className="font-display text-2xl mb-2">
        Send Rate
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        Percentage of successful climbs each week.
      </p>

      <div className="border border-border p-6 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.sendRateHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--rust)"
              strokeWidth={3}
              dot={{ fill: "var(--rust)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
</section>

{/* FAVORITE STYLES */}

<section>
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Habits
  </p>

  <h2 className="font-display text-3xl mt-2">
    Favorite Styles
  </h2>

  <p className="mt-3 text-sm text-muted-foreground">
    The climbing styles you log most often.
  </p>

  {/* Favorite styles */}
  <div className="border-y border-border">


{data.favoriteStyles.map((style)=>(


<div
key={style.name}
className="flex justify-between py-4 border-b border-border"
>


<span className="font-mono uppercase">
{style.name}
</span>


<span className="font-mono">
{style.count}
</span>
</div>

))}


</div>
</section>

{/* PROJECT SUCCESS */}
<section>
  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
    Projects
  </p>

  <h2 className="font-display text-3xl mt-2">
    Project Success
  </h2>

  <p className="mt-3 text-sm text-muted-foreground">
    See how often your long-term projects become successful sends.
  </p>

  {/* Progress bar */}

  <p className="font-display text-5xl mt-3">
{data.stats.projectSuccess}%
</p>


<div className="mt-5 h-3 bg-muted">

<div
className="h-full bg-foreground"
style={{
width:`${data.stats.projectSuccess}%`
}}
/>


</div>

</section>

</div>
</main>


<Footer/>


</div>

)

}




function Stat({label,value}){

return (

<div className="border border-border p-6">

<p className="font-mono text-xs text-muted-foreground uppercase">
{label}
</p>

<p className="font-display text-4xl mt-3">
{value}
</p>

</div>

)

}