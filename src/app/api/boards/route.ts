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

    const { name, description, isPrivate } = await req.json()

    const board = await prisma.bulletinBoard.create({
      data: {
        name,
        description,
        isPrivate,
        members: {
          create: {
            userId: session.user.id,
            role: 'admin',
          }
        }
      }
    })

    return NextResponse.json(board)
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const boards = await prisma.bulletinBoard.findMany({
      include: {
        members: {
          include: {
            user: true
          }
        },
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
