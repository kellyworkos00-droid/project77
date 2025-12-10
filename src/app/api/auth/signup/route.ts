import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json()

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user (in production, hash the password)
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
      }
    })

    // Create initial streak
    await prisma.streak.create({
      data: {
        userId: user.id,
      }
    })

    return NextResponse.json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
