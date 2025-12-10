'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageCircle, User, Search, LogOut, Flame } from 'lucide-react'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (href: string) => pathname?.startsWith(href)

  if (!session) return null

  return (
    <>
      {/* Floating logo - always visible */}
      <Link 
        href="/feed" 
        className="fixed top-4 left-4 z-50 flex items-center gap-3 text-xl font-semibold text-white hover:text-sky-200 transition"
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-lg ring-2 ring-white/20 shadow-lg shadow-sky-900/50 backdrop-blur-xl bg-black/60">
          <Image
            src="/logo.png"
            alt="PinBoard"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <span className="hidden sm:inline tracking-tight backdrop-blur-xl bg-black/60 px-3 py-1.5 rounded-lg ring-1 ring-white/10">PinBoard</span>
      </Link>

      {/* Desktop navigation - hidden on mobile */}
      <nav className="hidden md:block sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end h-16">
            <div className="flex items-center gap-4">
              <Link href="/feed" className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/feed') ? 'text-white' : ''}`}>
                <Home size={18} />
                <span className="hidden md:inline text-sm font-medium">Home</span>
              </Link>

              <Link href="/boards" className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/boards') ? 'text-white' : ''}`}>
                <Users size={18} />
                <span className="hidden md:inline text-sm font-medium">Boards</span>
              </Link>

              <Link href="/messages" className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/messages') ? 'text-white' : ''}`}>
                <MessageCircle size={18} />
                <span className="hidden md:inline text-sm font-medium">Messages</span>
              </Link>

              <Link href="/search" className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/search') ? 'text-white' : ''}`}>
                <Search size={18} />
                <span className="hidden md:inline text-sm font-medium">Search</span>
              </Link>

              <Link href="/streak" className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/streak') ? 'text-white' : ''}`}>
                <Flame size={18} className="text-orange-400" />
                <span className="hidden md:inline text-sm font-medium">Streak</span>
              </Link>

              <Link
                href={`/profile/${session.user?.username || session.user?.id}`}
                className={`flex items-center gap-2 text-muted hover:text-white transition ${isActive('/profile') ? 'text-white' : ''}`}
              >
                <User size={18} />
                <span className="hidden md:inline text-sm font-medium">Profile</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-muted hover:text-rose-300 transition"
              >
                <LogOut size={18} />
                <span className="hidden md:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile floating tab bar */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <div className="glass-panel border-white/10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sky-900/30">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/feed" className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive('/feed') ? 'text-white' : 'text-muted hover:text-white'}`}>
              <Home size={22} />
              <span>Home</span>
            </Link>
            <Link href="/boards" className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive('/boards') ? 'text-white' : 'text-muted hover:text-white'}`}>
              <Users size={22} />
              <span>Boards</span>
            </Link>
            <Link href="/messages" className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive('/messages') ? 'text-white' : 'text-muted hover:text-white'}`}>
              <MessageCircle size={22} />
              <span>DMs</span>
            </Link>
            <Link href="/search" className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive('/search') ? 'text-white' : 'text-muted hover:text-white'}`}>
              <Search size={22} />
              <span>Search</span>
            </Link>
            <Link href="/streak" className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive('/streak') ? 'text-white' : 'text-muted hover:text-white'}`}>
              <Flame size={22} className="text-orange-400" />
              <span>Streak</span>
            </Link>
            <Link
              href={`/profile/${session.user?.username || session.user?.id}`}
              className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${pathname?.includes('/profile') ? 'text-white' : 'text-muted hover:text-white'}`}
            >
              <User size={22} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
