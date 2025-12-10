'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Search as SearchIcon, Users } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>({ users: [], boards: [] })
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="glass-panel p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-muted text-xs uppercase tracking-[0.18em]">Discover</p>
              <h1 className="text-3xl font-bold">Search</h1>
              <p className="text-muted">Find people and boards across the network.</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for users or boards..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <button type="submit" className="cta-button px-4 py-3 sm:w-auto w-full justify-center" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Users Results */}
        {results.users.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Users</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {results.users.map((user: any) => (
                <Link key={user.id} href={`/profile/${user.username || user.id}`}>
                  <div className="glass-panel p-4 flex items-center gap-3 hover:border-white/20 transition cursor-pointer">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-bold">
                        {user.name?.[0] || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{user.name}</h3>
                      {user.username && <p className="text-sm text-muted truncate">@{user.username}</p>}
                      {user.bio && <p className="text-sm text-muted line-clamp-1">{user.bio}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Boards Results */}
        {results.boards.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Boards</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {results.boards.map((board: any) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="glass-panel p-4 flex items-center gap-3 hover:border-white/20 transition cursor-pointer">
                    {board.image ? (
                      <img src={board.image} alt={board.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center">
                        <Users className="text-white" size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{board.name}</h3>
                      {board.description && (
                        <p className="text-sm text-muted line-clamp-1">{board.description}</p>
                      )}
                      <p className="text-sm text-muted">{board.members?.length || 0} members</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.users.length === 0 && results.boards.length === 0 && (
          <div className="glass-panel text-center py-10">
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted">Try different keywords.</p>
          </div>
        )}
      </main>
    </div>
  )
}
