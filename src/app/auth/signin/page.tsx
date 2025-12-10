'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/feed')
      }
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200 flex items-center justify-center p-4">
      <div className="bulletin-card max-w-md w-full relative">
        <div className="bulletin-pin"></div>
        <div className="bulletin-tape"></div>
        
        <h1 className="text-3xl font-bold text-bulletin-900 mb-6 text-center mt-4">
          Sign In to PinBoard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
              required
            />
          </div>

          <button type="submit" className="w-full bulletin-button">
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-bulletin-600 hover:text-bulletin-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
