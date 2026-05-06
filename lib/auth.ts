import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { getTokenFromCookie } from './api'

export interface AuthUser {
  userId: number
  username: string
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  // Check Authorization header first (for API calls from client)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
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

  // Fall back to checking cookies (for middleware/server-side)
  const token = getTokenFromCookie(request)
  if (token) {
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

  return null
}
