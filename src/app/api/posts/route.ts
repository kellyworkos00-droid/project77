import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const isSameDay = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate()

const isYesterday = (date: Date, reference: Date) => {
  const y = new Date(reference)
  y.setUTCDate(reference.getUTCDate() - 1)
  return isSameDay(date, y)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, bulletinBoardId, mediaUrl, mediaType } = await req.json()

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl,
        mediaType,
        userId: session.user.id,
        bulletinBoardId: bulletinBoardId || null,
      }
    })

    // Update streak on successful post
    const today = new Date()
    const streak = await prisma.streak.findUnique({ where: { userId: session.user.id } })

    if (!streak) {
      await prisma.streak.create({
        data: {
          userId: session.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
        }
      })
    } else {
      let current = streak.currentStreak
      let longest = streak.longestStreak

      if (isSameDay(new Date(streak.lastActiveDate), today)) {
        // Already counted today: keep streak values
      } else if (isYesterday(new Date(streak.lastActiveDate), today)) {
        current += 1
        longest = Math.max(longest, current)
      } else {
        current = 1
      }

      await prisma.streak.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: current,
          longestStreak: longest,
          lastActiveDate: today,
        }
      })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        bulletinBoard: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: true,
        reposts: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
