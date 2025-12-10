import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await req.json()

    // Check if already reposted
    const existingRepost = await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        }
      }
    })

    if (existingRepost) {
      return NextResponse.json({ error: 'Already reposted' }, { status: 400 })
    }

    const repost = await prisma.repost.create({
      data: {
        userId: session.user.id,
        postId,
      }
    })

    return NextResponse.json(repost)
  } catch (error) {
    console.error('Error reposting:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
