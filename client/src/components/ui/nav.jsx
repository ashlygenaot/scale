import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

const user = JSON.parse(localStorage.getItem("user") || "null");

useEffect(() => {
  function updateAuth() {
    setLoggedIn(!!localStorage.getItem("token"));
  }

  window.addEventListener("authChanged", updateAuth);

  return () => {
    window.removeEventListener("authChanged", updateAuth);
  };
}, []);

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("authChanged"));

  navigate("/login");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );
}

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-medium tracking-tight text-foreground">
            Scale
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v2
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-35 text-[13px] text-foreground/80">
        {loggedIn ? (
  <>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/logbook">Logbook</Link>
    <Link to="/projects">Projects</Link>
    <Link to="/analytics">Analytics</Link>

<button
    onClick={toggleTheme}
    className="font-mono text-lg uppercase tracking-wider text-muted-foreground hover:text-foreground"
  >
    ◐
  </button>


    <button onClick={handleLogout} className="bg-foreground text-background px-3.5 py-1.5 rounded-sm hover:bg-foreground/85 transition-colors">
      Logout
    </button>
  </>

) : (
  <>
    <Link to="/login" className="hidden sm:inline text-muted-foreground hover:text-foreground">Login</Link>
    <Link to="/register" className="bg-foreground text-background px-3.5 py-1.5 rounded-sm hover:bg-foreground/85 transition-colors">Start a logbook</Link>
  </>
)}

        </nav>
      </div>
    </header>
  );
}