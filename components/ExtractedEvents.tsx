'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

function formatTimeForInput(timeStr: string): string {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return ''
  return date.toISOString().slice(11, 16)
}

export interface ExtractedEvent {
  title: string
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
}

interface ExtractedEventsProps {
  events: ExtractedEvent[]
  onClear: () => void
}

export default function ExtractedEvents({ events, onClear }: ExtractedEventsProps) {
  const router = useRouter()
  const [editableEvents, setEditableEvents] = useState<ExtractedEvent[]>(
    events.map(e => ({ ...e }))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateEvent = (index: number, field: keyof ExtractedEvent, value: string) => {
    setEditableEvents(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value || undefined }
      return updated
    })
  }

  const removeEvent = (index: number) => {
    setEditableEvents(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveAll = async () => {
    const invalid = editableEvents.some(e => !e.title || !e.startDate)
    if (invalid) {
      setError('All events must have a title and start date')
      return
    }

    setSaving(true)
    setError('')

    let saved = 0
    for (const event of editableEvents) {
      try {
        const eventData: Record<string, unknown> = {
          title: event.title,
          startDate: event.startDate,
        }
        if (event.startTime) eventData.startTime = event.startTime
        if (event.endDate) eventData.endDate = event.endDate
        if (event.endTime) eventData.endTime = event.endTime
        if (event.location) eventData.location = event.location
        if (event.description) eventData.description = event.description

        await api.createEvent(eventData)
        saved++
      } catch (err) {
        setError(`Failed to save "${event.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
        setSaving(false)
        return
      }
    }

    router.push('/calendar')
  }

  if (editableEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events to display
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Extracted Events ({editableEvents.length})
        </h2>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {editableEvents.map((event, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">
                Event {index + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEvent(index)}
                className="text-destructive"
              >
                Remove
              </Button>
            </div>

            <div>
              <label className="text-xs font-medium">Title *</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                value={event.title}
                onChange={e => updateEvent(index, 'title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium">Start Date *</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                  value={event.startDate}
                  onChange={e => updateEvent(index, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium">Start Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                  value={event.startTime ? formatTimeForInput(event.startTime) : ''}
                  onChange={e => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(':')
                      const date = new Date(event.startDate)
                      date.setHours(parseInt(hours), parseInt(minutes))
                      updateEvent(index, 'startTime', date.toISOString())
                    } else {
                      updateEvent(index, 'startTime', '')
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                  value={event.endDate || ''}
                  onChange={e => updateEvent(index, 'endDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium">End Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                  value={event.endTime ? formatTimeForInput(event.endTime) : ''}
                  onChange={e => {
                    if (e.target.value) {
                      const endDate = event.endDate || event.startDate
                      const [hours, minutes] = e.target.value.split(':')
                      const date = new Date(endDate)
                      date.setHours(parseInt(hours), parseInt(minutes))
                      updateEvent(index, 'endTime', date.toISOString())
                    } else {
                      updateEvent(index, 'endTime', '')
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Location</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                value={event.location || ''}
                onChange={e => updateEvent(index, 'location', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium">Description</label>
              <textarea
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-background min-h-[60px]"
                value={event.description || ''}
                onChange={e => updateEvent(index, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSaveAll} disabled={saving || editableEvents.length === 0}>
          {saving ? 'Saving...' : `Save All ${editableEvents.length} Event(s)`}
        </Button>
        <Button variant="outline" onClick={onClear}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
