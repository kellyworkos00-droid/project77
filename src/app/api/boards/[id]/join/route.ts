import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: boardId } = await params

    // Check if already a member
    const existingMember = await prisma.bulletinBoardMember.findUnique({
      where: {
        userId_bulletinBoardId: {
          userId: session.user.id,
          bulletinBoardId: boardId,
        }
      }
    })

    if (existingMember) {
      // Leave board
      await prisma.bulletinBoardMember.delete({
        where: {
          id: existingMember.id
        }
      })
      return NextResponse.json({ joined: false })
    } else {
      // Join board
      await prisma.bulletinBoardMember.create({
        data: {
          userId: session.user.id,
          bulletinBoardId: boardId,
        }
      })
      return NextResponse.json({ joined: true })
    }
  } catch (error) {
    console.error('Error joining/leaving board:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
