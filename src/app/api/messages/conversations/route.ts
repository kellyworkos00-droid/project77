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

    // Get unique users the current user has messaged with
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Extract unique users
    const userMap = new Map()
    messages.forEach(msg => {
      const otherUser = msg.senderId === session.user.id ? msg.receiver : msg.sender
      if (!userMap.has(otherUser.id)) {
        userMap.set(otherUser.id, {
          ...otherUser,
          lastMessage: msg.content,
        })
      }
    })

    const conversations = Array.from(userMap.values())

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
