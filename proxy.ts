import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Let _next/data requests through — client-side auth handles redirects
  if (pathname.startsWith('/_next/data')) {
    return NextResponse.next()
  }

  // Public paths that don't require auth
  const publicPaths = ['/login', '/register', '/api-docs']
  const isPublicPath = publicPaths.some(p => pathname === p)

  // API routes handle their own auth via getAuthUser
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // If user has valid token and tries to access login/register, redirect to calendar
  if (token && (pathname === '/login' || pathname === '/register')) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'secret')
      return NextResponse.redirect(new URL('/calendar', request.url))
    } catch {
      // Invalid token, clear cookies and allow access to login page
      const response = NextResponse.next()
      response.cookies.delete('token')
      response.cookies.delete('userId')
      response.cookies.delete('username')
      return response
    }
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
