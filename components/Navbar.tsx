'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!isAuthenticated) return null

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  return (
    <nav className="border-b bg-background px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/calendar" className="text-xl font-bold">
          Better Calendar
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/calendar"
              className={`text-sm font-medium transition-colors ${
                isActive('/calendar')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Calendar
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors ${
                isActive('/events') && !pathname.includes('/input')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Events
            </Link>
            <Link
              href="/events/input"
              className={`text-sm font-medium transition-colors ${
                pathname === '/events/input'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AI Input
            </Link>
            <Link
              href="/events/new"
              className={`text-sm font-medium transition-colors ${
                pathname === '/events/new'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              New Event
            </Link>
          </div>
          <div className="flex items-center gap-4 border-l pl-6">
            <span className="text-sm text-muted-foreground">{username}</span>
            <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
