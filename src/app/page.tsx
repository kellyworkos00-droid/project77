import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/feed')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header with bulletin board aesthetic */}
          <div className="relative inline-block mb-8">
            <div className="bulletin-tape"></div>
            <div className="flex flex-col items-center gap-4">
              <Logo size={80} />
              <h1 className="text-6xl font-bold text-bulletin-900 mb-4 relative">
                PinBoard
                <div className="bulletin-pin"></div>
              </h1>
            </div>
          </div>
          
          <p className="text-2xl text-bulletin-800 mb-8">
            Real connections. Real people. Real conversations.
          </p>
          
          <div className="bulletin-card max-w-2xl mx-auto mb-12 relative">
            <div className="bulletin-pin right-8"></div>
            <div className="bulletin-pin left-8"></div>
            <p className="text-lg text-gray-700 mb-6">
              Join bulletin boards, share your thoughts, connect with others, 
              build streaks, and create lasting memories. No algorithms, 
              just authentic human connection.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/signin" className="bulletin-button">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bulletin-button bg-bulletin-500 hover:bg-bulletin-600">
                Create Account
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bulletin-card relative">
              <div className="bulletin-pin"></div>
              <h3 className="text-xl font-bold text-bulletin-800 mb-2">Bulletin Boards</h3>
              <p className="text-gray-600">Join communities around your interests and connect with like-minded people</p>
            </div>
            
            <div className="bulletin-card relative">
              <div className="bulletin-pin"></div>
              <h3 className="text-xl font-bold text-bulletin-800 mb-2">Share & Connect</h3>
              <p className="text-gray-600">Post videos, images, and thoughts. Comment, like, and repost content you love</p>
            </div>
            
            <div className="bulletin-card relative">
              <div className="bulletin-pin"></div>
              <h3 className="text-xl font-bold text-bulletin-800 mb-2">Build Streaks</h3>
              <p className="text-gray-600">Stay engaged with daily streaks and relive memories from the past</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
