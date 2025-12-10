'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/auth/signin')
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
    <main className="min-h-screen text-white flex items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <div className="max-w-lg w-full space-y-6">
        <div className="glass-panel p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-muted text-sm uppercase tracking-[0.18em]">Create your space</p>
              <h1 className="text-3xl font-bold leading-tight">Join PinBoard</h1>
              <p className="text-muted mt-2">Claim your handle, drop your first post, and start streaks.</p>
            </div>
            <span className="tag">New</span>
          </div>

          {error && (
            <div className="border border-rose-400/40 bg-rose-500/10 text-rose-100 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-white">Full Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Alex Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-white">Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="alex"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-white">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-white">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full cta-button justify-center">
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-sky-300 hover:text-sky-200 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
