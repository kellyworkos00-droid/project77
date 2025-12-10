import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query) {
      const [trendingBoards, trendingUsers, trendingPosts] = await Promise.all([
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
        })
      ])

      return NextResponse.json({
        users: [],
        boards: [],
        trending: {
          boards: trendingBoards,
          users: trendingUsers,
          posts: trendingPosts,
        }
      })
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
