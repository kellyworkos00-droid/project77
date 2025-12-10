import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/feed')
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold text-sky-200">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live social boards, zero noise
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-white/10 shadow-lg shadow-black/40">
                <Image
                  src="/logo.png"
                  alt="PinBoard logo"
                  fill
                  priority
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-muted text-sm uppercase tracking-[0.18em]">PinBoard</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">Social that feels alive.</h1>
              </div>
            </div>

            <p className="text-lg text-muted max-w-xl">
              Build boards, drop posts, share moments, and keep streaks with the people who matter. No casino feeds—just clean, real-time connection.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signup" className="cta-button">
                Create your board
              </Link>
              <Link href="/auth/signin" className="pill-button">
                I already have an account
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted">
              <span className="tag">Realtime threads</span>
              <span className="tag">Streaks & memories</span>
              <span className="tag">DMs & follow graph</span>
              <span className="tag">Posts, videos, shares</span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted text-sm">Live feed</p>
                  <h3 className="text-xl font-semibold">Boards lighting up</h3>
                </div>
                <div className="flex gap-2">
                  <span className="pill-button">Trending</span>
                  <span className="pill-button">Following</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-violet-500" />
                  <div>
                    <p className="font-semibold">Board • Design Crew</p>
                    <p className="text-muted text-sm">“Ship the idea while it’s hot.”</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500" />
                  <div>
                    <p className="font-semibold">Board • Builders</p>
                    <p className="text-muted text-sm">Live demo drop + code link</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500" />
                  <div>
                    <p className="font-semibold">Board • IRL</p>
                    <p className="text-muted text-sm">Moments, clips, quick reactions</p>
                  </div>
                </div>
              </div>
              <div className="divider my-4"></div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                2,184 active right now
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold mb-3">Why it feels modern</h3>
              <div className="card-grid">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-semibold">Fast lanes</p>
                  <p className="text-muted text-sm">Realtime posts, streaks, and DMs without bloat.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-semibold">Signal first</p>
                  <p className="text-muted text-sm">No slot-machine feeds—just people you choose.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-semibold">Creator-ready</p>
                  <p className="text-muted text-sm">Posts, clips, shares, and reposts that travel.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-semibold">Community-first</p>
                  <p className="text-muted text-sm">Boards to gather, streaks to keep the energy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
