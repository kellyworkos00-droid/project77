import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const name = (body.name as string | undefined)?.trim() || null
  const usernameRaw = (body.username as string | undefined)?.trim() || null
  const bio = (body.bio as string | undefined)?.trim() || null
  const image = (body.image as string | undefined)?.trim() || null

  if (usernameRaw && !/^[A-Za-z0-9_]{3,20}$/.test(usernameRaw)) {
    return NextResponse.json({ error: 'Username must be 3-20 characters, letters/numbers/underscores only.' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        username: usernameRaw || undefined,
        bio: bio || undefined,
        image: image || undefined,
      },
      select: { id: true, name: true, username: true, bio: true, image: true }
    })

    return NextResponse.json({ user })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'That username is taken. Try another.' }, { status: 409 })
    }
    console.error('Profile update failed', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
