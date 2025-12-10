'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Home, Users, MessageCircle, User, Search, LogOut, Flame } from 'lucide-react'

export function Navigation() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/feed" className="flex items-center gap-3 text-xl font-semibold text-white hover:text-sky-200 transition">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg ring-1 ring-white/10">
              <Image
                src="/logo.png"
                alt="PinBoard"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="hidden sm:inline tracking-tight">PinBoard</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/feed" className="flex items-center gap-2 text-muted hover:text-white transition">
              <Home size={18} />
              <span className="hidden md:inline text-sm font-medium">Home</span>
            </Link>

            <Link href="/boards" className="flex items-center gap-2 text-muted hover:text-white transition">
              <Users size={18} />
              <span className="hidden md:inline text-sm font-medium">Boards</span>
            </Link>

            <Link href="/messages" className="flex items-center gap-2 text-muted hover:text-white transition">
              <MessageCircle size={18} />
              <span className="hidden md:inline text-sm font-medium">Messages</span>
            </Link>

            <Link href="/search" className="flex items-center gap-2 text-muted hover:text-white transition">
              <Search size={18} />
              <span className="hidden md:inline text-sm font-medium">Search</span>
            </Link>

            <Link href="/streak" className="flex items-center gap-2 text-muted hover:text-white transition">
              <Flame size={18} className="text-orange-400" />
              <span className="hidden md:inline text-sm font-medium">Streak</span>
            </Link>

            <Link
              href={`/profile/${session.user?.username || session.user?.id}`}
              className="flex items-center gap-2 text-muted hover:text-white transition"
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
  )
}
