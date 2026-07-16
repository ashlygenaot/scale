import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [open, setOpen] = useState(false);

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
    const isDark =
      document.documentElement.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

    const themeMeta = document.querySelector(
        'meta[name="theme-color"]'
      );

      if (themeMeta) {
        themeMeta.setAttribute(
          "content",
          isDark ? "#09090b" : "#ffffff"
        );
      }

  }

  return (
    <header className="
      border-b 
      border-border 
      bg-background/95 
      backdrop-blur 
      sticky 
      top-0 
      z-50
    ">
      <div className="
        mx-auto 
        max-w-6xl 
        px-4 
        sm:px-6
        h-14 
        flex 
        items-center 
        justify-between
      ">

        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-baseline gap-2"
        >
          <span className="
            font-display 
            text-3xl 
            font-medium 
            tracking-tight
          ">
            Scale
          </span>

          <span className="
            font-mono 
            text-[10px] 
            uppercase 
            tracking-widest 
            text-muted-foreground
          ">
            v2
          </span>
        </Link>


        {/* Desktop Nav */}
        <nav className="
          hidden 
          md:flex 
          items-center 
          gap-6 
          text-[13px]
          text-foreground/80
        ">

          {loggedIn ? (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/logbook">
                Logbook
              </Link>

              <Link to="/projects">
                Projects
              </Link>

              <Link to="/analytics">
                Analytics
              </Link>

              <button
                onClick={toggleTheme}
                className="
                  text-2xl
                  text-muted-foreground
                  hover:text-foreground
                "
              >
                ◐
              </button>


              <button
                onClick={handleLogout}
                className="
                  bg-foreground
                  text-background
                  px-3.5
                  py-1.5
                  rounded-sm
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="
                  bg-foreground
                  text-background
                  px-3.5
                  py-1.5
                  rounded-sm
                "
              >
                Start a logbook
              </Link>
            </>
          )}

        </nav>


        {/* Mobile Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

      </div>


      {/* Mobile Menu */}
      {open && (
        <div className="
          md:hidden
          border-t
          border-border
          px-4
          py-4
          flex
          flex-col
          gap-4
          text-sm
        ">

          {loggedIn ? (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/logbook">
                Logbook
              </Link>

              <Link to="/projects">
                Projects
              </Link>

              <Link to="/analytics">
                Analytics
              </Link>

              <button
                onClick={toggleTheme}
                className="text-left"
              >
                Toggle Theme ◐
              </button>

              <button
                onClick={handleLogout}
                className="
                  bg-foreground
                  text-background
                  px-3
                  py-2
                  rounded-sm
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="
                  bg-foreground
                  text-background
                  px-3
                  py-2
                  rounded-sm
                "
              >
                Start a logbook
              </Link>
            </>
          )}

        </div>
      )}

    </header>
  );
}