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
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-bulletin-900 mb-8">Your Streak</h1>

        {/* Current Streak */}
        <div className="bulletin-card mb-8 relative text-center">
          <div className="bulletin-pin"></div>
          <div className="bulletin-tape"></div>
          
          <div className="mt-2">
            <Flame className="mx-auto text-orange-500 mb-4" size={64} />
            <h2 className="text-6xl font-bold text-bulletin-900 mb-2">
              {streak.currentStreak}
            </h2>
            <p className="text-xl text-gray-600 mb-6">Day Streak</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bulletin-50 rounded-lg p-4">
                <Award className="mx-auto text-bulletin-600 mb-2" size={32} />
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-bulletin-900">{streak.longestStreak}</p>
              </div>
              
              <div className="bg-bulletin-50 rounded-lg p-4">
                <TrendingUp className="mx-auto text-bulletin-600 mb-2" size={32} />
                <p className="text-sm text-gray-600">Keep Going!</p>
                <p className="text-2xl font-bold text-bulletin-900">🔥</p>
              </div>
            </div>

            <p className="mt-6 text-gray-600">
              Come back tomorrow to continue your streak!
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <h2 className="text-2xl font-bold text-bulletin-900 mb-4">Leaderboard</h2>
        <div className="bulletin-card relative">
          <div className="bulletin-pin"></div>
          
          <div className="space-y-3">
            {topStreaks.map((s: any, index: number) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  s.userId === session.user.id ? 'bg-bulletin-50 border-2 border-bulletin-600' : 'bg-gray-50'
                }`}
              >
                <div className="w-8 text-center">
                  <span className="text-2xl font-bold text-bulletin-900">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-bulletin-400 flex items-center justify-center text-white font-bold">
                  {s.user.name?.[0] || 'U'}
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-bulletin-900">{s.user.name}</p>
                  {s.user.username && <p className="text-sm text-gray-600">@{s.user.username}</p>}
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">🔥 {s.currentStreak}</p>
                  <p className="text-xs text-gray-600">Current</p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-bulletin-900">{s.longestStreak}</p>
                  <p className="text-xs text-gray-600">Longest</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
