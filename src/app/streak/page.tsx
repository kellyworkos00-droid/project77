import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { Flame, Award, TrendingUp } from 'lucide-react'
import { differenceInDays } from 'date-fns'

export default async function StreakPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  let streak = await prisma.streak.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true
    }
  })

  // Update streak based on last active date
  if (streak) {
    const today = new Date()
    const lastActive = new Date(streak.lastActiveDate)
    const daysDiff = differenceInDays(today, lastActive)

    if (daysDiff === 0) {
      // Already checked in today
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      streak = await prisma.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak: streak.currentStreak + 1,
          longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
          lastActiveDate: today,
        },
        include: {
          user: true
        }
      })
    } else {
      // Streak broken, reset to 1
      streak = await prisma.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 1,
          lastActiveDate: today,
        },
        include: {
          user: true
        }
      })
    }
  } else {
    // Create initial streak
    streak = await prisma.streak.create({
      data: {
        userId: session.user.id,
      },
      include: {
        user: true
      }
    })
  }

  // Get top streaks leaderboard
  const topStreaks = await prisma.streak.findMany({
    include: {
      user: true
    },
    orderBy: {
      currentStreak: 'desc'
    },
    take: 10
  })

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold mb-4">Your Streak</h1>

        {/* Current Streak */}
        <div className="glass-panel p-6 text-center space-y-4">
          <Flame className="mx-auto text-orange-400" size={56} />
          <div>
            <h2 className="text-5xl font-bold">{streak.currentStreak}</h2>
            <p className="text-muted">Day Streak</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <Award className="text-sky-300 mb-2" size={28} />
              <p className="text-sm text-muted">Longest Streak</p>
              <p className="text-2xl font-bold">{streak.longestStreak}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <TrendingUp className="text-emerald-300 mb-2" size={28} />
              <p className="text-sm text-muted">Keep going</p>
              <p className="text-2xl font-bold">🔥</p>
            </div>
          </div>
          <p className="text-muted">Come back tomorrow to continue your streak.</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <div className="glass-panel p-5 space-y-3">
            {topStreaks.map((s: any, index: number) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  s.userId === session.user.id ? 'bg-white/8 border border-white/15' : 'bg-white/4 border border-white/8'
                }`}
              >
                <div className="w-8 text-center">
                  <span className="text-xl font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                  {s.user.name?.[0] || 'U'}
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-white">{s.user.name}</p>
                  {s.user.username && <p className="text-sm text-muted">@{s.user.username}</p>}
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-400">🔥 {s.currentStreak}</p>
                  <p className="text-xs text-muted">Current</p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{s.longestStreak}</p>
                  <p className="text-xs text-muted">Longest</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
