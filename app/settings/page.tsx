'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function SettingsPage() {
  const { isAuthenticated, isLoading, hasApiKey } = useAuth()
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadProfile()
  }, [isAuthenticated, isLoading, router])

  const loadProfile = async () => {
    try {
      const data = await api.getUserProfile()
      if (data.hasApiKey) {
        setApiKey('••••••••••••••••••••••••••••••') // Masked display
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // If user didn't change the masked key, don't update
      if (apiKey === '••••••••••••••••••••••••••••••') {
        setError('API key already saved')
        setSaving(false)
        return
      }

      await api.updateApiKey(apiKey || null)
      setSuccess('API key saved successfully!')
      setApiKey('••••••••••••••••••••••••••••••')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await api.updateApiKey(null)
      setApiKey('')
      setSuccess('API key removed. Using default key.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove API key')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4">
          <div className="text-center py-12">Loading...</div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="text-muted-foreground">
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">{error}</Alert>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
            {success}
          </div>
        )}

        <div className="max-w-2xl">
          <div className="border rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">OpenRouter API Key</h2>
              <p className="text-sm text-muted-foreground mb-4">
                By default, the app uses a shared API key. You can add your own OpenRouter API key to avoid rate limits.
                Get your free API key at{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored securely and only used for AI requests.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save API Key'}
              </Button>
              {hasApiKey && (
                <Button variant="outline" onClick={handleRemove} disabled={saving}>
                  Remove Key
                </Button>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Status:</strong>{' '}
                {hasApiKey ? (
                  <span className="text-green-600">Using your personal API key</span>
                ) : (
                  <span>Using default shared key (may have rate limits)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
