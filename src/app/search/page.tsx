'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Search as SearchIcon, Users, Flame } from 'lucide-react'
import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { useSession } from 'next-auth/react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const [results, setResults] = useState<any>({ users: [], boards: [], posts: [], trending: { boards: [], users: [], posts: [], hashtags: [] } })
  const [isLoading, setIsLoading] = useState(false)

  // load trending on first paint
  useEffect(() => {
    fetchTrending()
  }, [])

  const runSearch = async (term: string) => {
    setQuery(term)
    if (!term.trim()) {
      fetchTrending()
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
      if (res.ok) {
        const data = await res.json()
        setResults({ ...data, trending: results.trending })
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTrending = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/search')
      if (res.ok) {
        const data = await res.json()
        setResults({ users: [], boards: [], posts: [], trending: data.trending })
      }
    } catch (error) {
      console.error('Error loading trending:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    runSearch(query)
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

        {/* Trending */}
        {results.trending && (results.trending.boards?.length || results.trending.users?.length || results.trending.posts?.length || results.trending.hashtags?.length) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-400" size={18} />
              <h2 className="text-2xl font-bold">Trending now</h2>
            </div>

            <div className="grid lg:grid-cols-4 gap-3">
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs">Hashtags</span>
                  <span>Hot topics</span>
                </div>
                {results.trending.hashtags?.length === 0 ? (
                  <p className="text-muted text-sm">No trending hashtags</p>
                ) : (
                  results.trending.hashtags.map((tag: any) => (
                    <button
                      key={tag.tag}
                      onClick={() => runSearch(`#${tag.tag.replace('#','')}`)}
                      className="w-full text-left p-2 rounded-xl hover:bg-white/5 transition text-white flex items-center justify-between"
                    >
                      <span className="font-semibold">#{tag.tag.replace('#','')}</span>
                      <span className="text-xs text-muted">{tag.count}</span>
                    </button>
                  ))
                )}
              </div>

              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs">Boards</span>
                  <span>Most joined</span>
                </div>
                {results.trending.boards?.length === 0 ? (
                  <p className="text-muted text-sm">No trending boards</p>
                ) : (
                  results.trending.boards.map((board: any) => (
                    <Link key={board.id} href={`/boards/${board.id}`} className="block">
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition">
                        {board.image ? (
                          <img src={board.image} alt={board.name} className="w-11 h-11 rounded-lg object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center">
                            <Users className="text-white" size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{board.name}</p>
                          <p className="text-sm text-muted truncate">{board.description || 'Active discussions'}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs">People</span>
                  <span>Gaining followers</span>
                </div>
                {results.trending.users?.length === 0 ? (
                  <p className="text-muted text-sm">No trending people</p>
                ) : (
                  results.trending.users.map((user: any) => (
                    <Link key={user.id} href={`/profile/${user.username || user.id}`} className="block">
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                            {user.name?.[0] || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{user.name}</p>
                          {user.username && <p className="text-sm text-muted truncate">@{user.username}</p>}
                          {user.bio && <p className="text-sm text-muted line-clamp-1">{user.bio}</p>}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs">Posts</span>
                  <span>Most liked</span>
                </div>
                {results.trending.posts?.length === 0 ? (
                  <p className="text-muted text-sm">No trending posts</p>
                ) : (
                  results.trending.posts.map((post: any) => (
                    <div key={post.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span className="font-semibold text-white">{post.user?.name || 'User'}</span>
                        {post.bulletinBoard && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">{post.bulletinBoard.name}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/90 line-clamp-2">{post.content || 'Shared an update'}</p>
                      <div className="text-xs text-muted">{post.likes?.length || 0} likes · {post.comments?.length || 0} comments</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* Hashtag Posts Results */}
        {results.posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">Posts for {query}</h2>
            <div className="space-y-4">
              {results.posts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={session?.user.id || ''} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.users.length === 0 && results.boards.length === 0 && results.posts.length === 0 && (
          <div className="glass-panel text-center py-10">
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted">Try different keywords.</p>
          </div>
        )}
      </main>
    </div>
  )
}
