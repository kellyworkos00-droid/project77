'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Search as SearchIcon, Users, User } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bulletin-card mb-8 relative">
          <div className="bulletin-pin"></div>
          <div className="bulletin-tape"></div>
          
          <h1 className="text-3xl font-bold text-bulletin-900 mb-4 mt-2">Search</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for users or bulletin boards..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
            />
            <button type="submit" className="bulletin-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : <SearchIcon size={20} />}
            </button>
          </form>
        </div>

        {/* Users Results */}
        {results.users.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-bulletin-900 mb-4">Users</h2>
            <div className="space-y-3">
              {results.users.map((user: any) => (
                <Link key={user.id} href={`/profile/${user.username || user.id}`}>
                  <div className="bulletin-card relative hover:shadow-lg transition cursor-pointer flex items-center gap-3">
                    <div className="bulletin-pin"></div>
                    
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-bulletin-400 flex items-center justify-center text-white font-bold">
                        {user.name?.[0] || 'U'}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-bold text-bulletin-900">{user.name}</h3>
                      {user.username && <p className="text-sm text-gray-600">@{user.username}</p>}
                      {user.bio && <p className="text-sm text-gray-600 line-clamp-1">{user.bio}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Boards Results */}
        {results.boards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-bulletin-900 mb-4">Bulletin Boards</h2>
            <div className="space-y-3">
              {results.boards.map((board: any) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="bulletin-card relative hover:shadow-lg transition cursor-pointer flex items-center gap-3">
                    <div className="bulletin-pin"></div>
                    
                    {board.image ? (
                      <img src={board.image} alt={board.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-bulletin-400 flex items-center justify-center">
                        <Users className="text-white" size={24} />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-bold text-bulletin-900">{board.name}</h3>
                      {board.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{board.description}</p>
                      )}
                      <p className="text-sm text-gray-500">{board.members?.length || 0} members</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.users.length === 0 && results.boards.length === 0 && (
          <div className="bulletin-card text-center relative py-12">
            <div className="bulletin-pin"></div>
            <h3 className="text-xl font-bold text-bulletin-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        )}
      </main>
    </div>
  )
}
