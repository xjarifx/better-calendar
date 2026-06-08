'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Eye, EyeOff, ArrowRight, User, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Loading } from '@/components/ui/loading'

export default function LoginPage() {
  const { refreshAuth } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.login(username, password)
      await refreshAuth()
      router.push('/calendar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await api.login('demo', 'demo123')
      await refreshAuth()
      router.push('/calendar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-primary/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-secondary/8 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.5_0.15_220)]/5 blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/12 ring-1 ring-primary/20 mb-5 shadow-lg shadow-primary/5">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Better Calendar</h1>
          <p className="text-sm text-muted-foreground/80 mt-1.5">Welcome back — sign in to continue</p>
        </div>

        <Card className="bg-card/60 backdrop-blur-xl shadow-2xl shadow-black/20 ring-1 ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Sign in</CardTitle>
          </CardHeader>

          {error && (
            <CardContent className="pb-0">
              <Alert variant="destructive" className="text-sm">
                <span>{error}</span>
              </Alert>
            </CardContent>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                  <Input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="pl-9 h-9 text-sm bg-background/50 border-white/10 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pl-9 pr-10 h-9 text-sm bg-background/50 border-white/10 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loading size="sm" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card/60 px-2 text-muted-foreground/50">or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 text-sm"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                <span className="flex items-center gap-2">
                  Try Demo Account
                </span>
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground/70 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
