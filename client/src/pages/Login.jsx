import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });
      const data = res?.data || res;

      if (!data?.token) throw new Error("No token returned");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("authChanged"));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Scale Logbook
          </p>
          <h1 className="font-display text-4xl mt-2 tracking-[-0.02em]">
            Log in
          </h1>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">
            Access your training log
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleLogin}
          className="border border-border bg-card px-6 py-8 space-y-5"
        >

          {/* EMAIL */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full bg-transparent border-b-2 border-foreground/20 focus:border-primary outline-none py-2 text-foreground"
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full bg-transparent border-b-2 border-foreground/20 focus:border-primary outline-none py-2 text-foreground"
              placeholder="••••••••"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="font-mono text-[11px] text-red-500">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full mt-2 border-2 border-foreground text-foreground py-2 font-mono text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background transition"
          >
            Log in
          </button>

          {/* FOOTER */}
          <p className="text-center font-mono text-[11px] text-muted-foreground pt-2">
            No account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}