import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const extractHashtags = (text: string) => {
  const tags = text.match(/#([A-Za-z0-9_]+)/g) || []
  return tags.map((t) => t.toLowerCase())
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query) {
      const [trendingBoards, trendingUsers, trendingPosts, recentPosts] = await Promise.all([
        prisma.bulletinBoard.findMany({
          take: 6,
          orderBy: {
            members: {
              _count: 'desc'
            }
          },
          include: {
            members: true,
          }
        }),
        prisma.user.findMany({
          take: 6,
          orderBy: {
            followers: {
              _count: 'desc'
            }
          },
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            followers: true,
          }
        }),
        prisma.post.findMany({
          take: 6,
          orderBy: {
            likes: {
              _count: 'desc'
            }
          },
          include: {
            user: true,
            bulletinBoard: true,
            likes: true,
            comments: true,
          }
        }),
        prisma.post.findMany({
          take: 200,
          orderBy: { createdAt: 'desc' },
          select: { content: true }
        })
      ])

      const hashtagCounts: Record<string, number> = {}
      recentPosts.forEach((p) => {
        extractHashtags(p.content || '').forEach((tag) => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
        })
      })
      const trendingHashtags = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count }))

      return NextResponse.json({
        users: [],
        boards: [],
        trending: {
          boards: trendingBoards,
          users: trendingUsers,
          posts: trendingPosts,
          hashtags: trendingHashtags,
        }
      })
    }

    // Hashtag search
    if (query.startsWith('#')) {
      const tag = query.slice(1)
      const posts = await prisma.post.findMany({
        where: {
          content: {
            contains: `#${tag}`,
            mode: 'insensitive'
          }
        },
        include: {
          user: true,
          bulletinBoard: true,
          likes: true,
          comments: {
            include: { user: true }
          },
          reposts: true,
          shares: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })

      return NextResponse.json({ users: [], boards: [], posts })
    }

    const [users, boards] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ]
        },
        take: 10
      }),
      prisma.bulletinBoard.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        },
        include: {
          members: true,
        },
        take: 10
      })
    ])

    return NextResponse.json({ users, boards })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
