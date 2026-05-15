import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from "../api/auth"

const inputClass =
  'w-full p-3 border-b-2 border-stone-200 outline-none focus:border-emerald-400 placeholder-stone-400 text-stone-700'

export default function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.')
    }

    try {
      const res = await registerUser({
        username: form.name,
        email: form.email,
        password: form.password,
      })

      // store JWT + user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // go to dashboard
      navigate('/dashboard')

    } catch (err) {
      console.log(err.response?.data)
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200 py-8">
      <div className="w-[440px] bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-green-100">

        <div className="flex justify-center mb-6">
          <h2 className="text-3xl font-bold text-center text-emerald-800">
            Sign Up
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className={inputClass}
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className={inputClass}
            value={form.password}
            onChange={handleChange}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            className={inputClass}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-emerald-400 text-white rounded-full text-lg font-medium hover:bg-emerald-500 transition shadow-md"
          >
            Create Account
          </button>

          <p className="text-center text-stone-500 text-sm">
            Already have an account?{' '}
            <a
              href="#"
              className="text-emerald-600 font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              Login
            </a>
          </p>

        </form>
      </div>
    </div>
  )
}