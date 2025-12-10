'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Home, Users, MessageCircle, User, Search, LogOut, Flame } from 'lucide-react'
import { Logo } from './Logo'

export function Navigation() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <nav className="bg-white border-b-2 border-bulletin-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/feed" className="flex items-center gap-2 text-2xl font-bold text-bulletin-900 hover:text-bulletin-700 transition">
            <Logo size={36} />
            <span className="hidden sm:inline">PinBoard</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/feed" className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <Home size={20} />
              <span className="hidden md:inline">Home</span>
            </Link>

            <Link href="/boards" className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <Users size={20} />
              <span className="hidden md:inline">Boards</span>
            </Link>

            <Link href="/messages" className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <MessageCircle size={20} />
              <span className="hidden md:inline">Messages</span>
            </Link>

            <Link href="/search" className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <Search size={20} />
              <span className="hidden md:inline">Search</span>
            </Link>

            <Link href="/streak" className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <Flame size={20} className="text-orange-500" />
              <span className="hidden md:inline">Streak</span>
            </Link>

            <Link href={`/profile/${session.user?.username || session.user?.id}`} className="flex items-center gap-2 text-gray-700 hover:text-bulletin-600 transition">
              <User size={20} />
              <span className="hidden md:inline">Profile</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
