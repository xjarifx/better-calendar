import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  userId: number
  username: string
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: number
      username: string
    }
    return { userId: decoded.userId, username: decoded.username }
  } catch {
    return null
  }
}
