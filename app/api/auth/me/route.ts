import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getUserById } from '@/lib/db-queries'

export interface AuthUser {
  userId: number
  username: string
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: number
      username: string
    }

    // Verify user still exists in DB
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      username: user.username,
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
