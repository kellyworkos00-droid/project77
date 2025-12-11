"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { THEMES, Theme } from '@/lib/themes'
import { useTheme } from './ThemeProvider'

interface SettingsFormProps {
  user: {
    name: string | null
    username: string | null
    bio: string | null
    image: string | null
    email: string | null
    theme: string
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const { setTheme: setContextTheme } = useTheme()
  const [name, setName] = useState(user.name || '')
  const [username, setUsername] = useState(user.username || '')
  const [bio, setBio] = useState(user.bio || '')
  const [image, setImage] = useState(user.image || '')
  const [theme, setTheme] = useState<Theme>((user.theme as Theme) || 'midnight')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    setError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          bio: bio.trim(),
          image: image.trim(),
          theme,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save settings')
      }

      setContextTheme(theme)
      setStatus('saved')
      router.refresh()
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Failed to save settings')
    } finally {
      setTimeout(() => setStatus('idle'), 1500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-5">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white">Name</label>
          {user.email && <span className="text-xs text-muted">{user.email}</span>}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
          placeholder="Your display name"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
          placeholder="@handle"
        />
        <p className="text-xs text-muted">Only letters, numbers, and underscores. Unique across the app.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white resize-none"
          rows={3}
          placeholder="Tell people about you"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white">Profile image URL</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
          placeholder="https://..."
        />
        <p className="text-xs text-muted">Paste an image link. If empty, we'll show your initial.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white block">Theme</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(THEMES) as [Theme, any][]).map(([themeKey, themeData]) => (
            <button
              key={themeKey}
              type="button"
              onClick={() => setTheme(themeKey)}
              className={`p-3 rounded-xl border-2 transition text-left text-sm font-medium ${
                theme === themeKey
                  ? 'border-sky-400 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="font-semibold text-white">{themeData.name}</div>
              <div className="text-xs text-muted mt-0.5">{themeData.description}</div>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {status === 'saved' && <p className="text-sm text-emerald-300">Saved!</p>}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="cta-button disabled:opacity-60 disabled:cursor-not-allowed w-full"
      >
        {status === 'saving' ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}
