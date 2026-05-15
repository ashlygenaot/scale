import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser({
      email,
      password,
    });

    // store JWT token
    localStorage.setItem("token", res.data.token);

    // store user (optional but useful)
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");
  } catch (err) {
    console.log(err.response?.data);
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200'>
      <div className='w-[440px] bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-green-100'>
        <div className='flex justify-center mb-6'>
          <h2 className='text-3xl font-bold text-center text-emerald-800'>Login</h2>
        </div>

        <form className='space-y-4' onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            className='w-full p-3 border-b-2 border-stone-200 outline-none focus:border-emerald-400 placeholder-stone-400 text-stone-700'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className='w-full p-3 border-b-2 border-stone-200 outline-none focus:border-emerald-400 placeholder-stone-400 text-stone-700'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className='text-right'>
            <p className='text-emerald-600 hover:underline cursor-pointer text-sm'>
              Forgot Password?
            </p>
          </div>

          {error && <p className='text-red-400 text-sm'>{error}</p>}

          <button
            type="submit"
            className='w-full p-3 bg-emerald-400 text-white rounded-full text-lg font-medium hover:opacity-90 transition shadow-md'
          >
            Login
          </button>

          <p className='text-center text-stone-500 text-sm'>
            Don't have an account?{' '}
            <a
              href="#"
              className='text-emerald-600 font-medium hover:underline'
              onClick={e => {
                e.preventDefault()
                navigate('/signup')
              }}
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}