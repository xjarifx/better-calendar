'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ExtractedEvents from '@/components/ExtractedEvents'

interface FreeModel {
  id: string
  name: string
  context: string
  description?: string
}

interface ExtractedEvent {
  title: string
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
}

export default function EventInputPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [text, setText] = useState('')
  const [models, setModels] = useState<FreeModel[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([])
  const abortControllerRef = useRef<{ controller: AbortController; id: number } | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadModels()
  }, [isAuthenticated, isLoading, router])

  const loadModels = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/models')
      if (!res.ok) throw new Error('Failed to load models')
      const data = await res.json()
      setModels(data.models || [])
      if (data.models?.length > 0) {
        setSelectedModel(data.models[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models')
    } finally {
      setLoading(false)
    }
  }

  const handleExtract = async () => {
    // If already extracting, cancel the current request
    if (extracting && abortControllerRef.current) {
      abortControllerRef.current.controller.abort()
      setExtracting(false)
      setError('Extraction cancelled')
      return
    }

    if (!text.trim()) {
      setError('Please paste some text to extract events from')
      return
    }
    if (!selectedModel) {
      setError('Please select an AI model')
      return
    }

    // Increment request ID for this new request
    const thisRequestId = requestIdRef.current + 1
    requestIdRef.current = thisRequestId

    // Create AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = { controller, id: thisRequestId }

    setExtracting(true)
    setError('')
    setExtractedEvents([])

    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: selectedModel }),
        signal: controller.signal,
      })

      // Check if this is still the current request
      if (abortControllerRef.current?.id !== thisRequestId) {
        return // Stale request, ignore
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Extraction failed')
      }

      const data = await res.json()

      // Check again if this is still the current request
      if (abortControllerRef.current?.id !== thisRequestId) {
        return // Stale request, ignore
      }

      if (data.events?.length === 0) {
        setError('No events found in the text. Try adding more details.')
      } else {
        setExtractedEvents(data.events || [])
      }
    } catch (err) {
      // Check if this is still the current request
      if (abortControllerRef.current?.id !== thisRequestId) {
        return // Stale request, ignore
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Extraction cancelled')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to extract events')
      }
    } finally {
      // Only update state if this is still the current request
      if (abortControllerRef.current?.id === thisRequestId) {
        setExtracting(false)
        abortControllerRef.current = null
      }
    }
  }

  const handleClear = () => {
    setText('')
    setExtractedEvents([])
    setError('')
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
          <h1 className="text-2xl font-bold">AI Event Extraction</h1>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Paste Event Notices
              </label>
              <textarea
                className="w-full min-h-[300px] px-3 py-2 border rounded-md bg-background font-mono text-sm"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your event notices here...&#10;&#10;Example:&#10;Team Meeting&#10;January 15, 2026 at 2:00 PM&#10;Conference Room B&#10;&#10;Birthday Party&#10;Feb 20, 2026&#10;123 Main Street"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  AI Model
                </label>
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading models...</div>
                ) : (
                  <select
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                  >
                    {models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.context} context)
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <Button
                onClick={handleExtract}
                disabled={loading || !selectedModel || (!extracting && !text.trim())}
                variant={extracting ? 'destructive' : 'default'}
              >
                {extracting ? 'Cancel' : 'Extract Events'}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>

          <div>
            {extractedEvents.length > 0 && (
              <ExtractedEvents
                events={extractedEvents}
                onClear={() => setExtractedEvents([])}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
