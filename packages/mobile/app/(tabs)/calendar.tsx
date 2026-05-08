import { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import type { CalendarEvent } from '@better-calender/shared'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function CalendarScreen() {
  const { api, logout } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getEvents()
      setEvents(data)
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout()
        router.replace('/(auth)/login')
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [api, logout])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const firstDay = new Date(year, month, 1)
  const startDay = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d)
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  function getEventsForDay(day: number): CalendarEvent[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.start_date.startsWith(dateStr))
  }

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-2 px-4">
        <Text className="text-foreground text-2xl font-bold">Calendar</Text>
      </View>

      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={prevMonth} className="p-2">
          <Text className="text-primary text-xl">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-foreground text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} className="p-2">
          <Text className="text-primary text-xl">{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row px-2">
        {DAY_NAMES.map(day => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-muted-foreground text-xs">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap px-2">
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <View key={`empty-${i}`} className="w-[14.28%] aspect-square" />
          }

          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
          const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month
          const dayEvents = getEventsForDay(day)

          return (
            <TouchableOpacity
              key={`day-${day}`}
              className="w-[14.28%] aspect-square items-center justify-center"
              onPress={() => setSelectedDate(new Date(year, month, day))}
            >
              <View className={`w-9 h-9 rounded-full items-center justify-center ${isSelected ? 'bg-primary' : ''}`}>
                <Text className={`text-sm ${isToday ? 'text-primary font-bold' : isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {day}
                </Text>
              </View>
              {dayEvents.length > 0 && (
                <View className="flex-row gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((_, idx) => (
                    <View key={idx} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      <View className="flex-1 px-4 mt-4">
        <Text className="text-foreground font-semibold mb-2">
          Events for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#3b82f6" className="mt-4" />
        ) : error ? (
          <Text className="text-destructive-foreground mt-2">{error}</Text>
        ) : (
          <ScrollView>
            {getEventsForDay(selectedDate.getDate()).map(event => (
              <TouchableOpacity
                key={event.id}
                className="bg-card border border-border rounded-lg p-3 mb-2"
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <Text className="text-foreground font-medium">{event.title}</Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  {event.start_time
                    ? new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : 'All day'}
                </Text>
              </TouchableOpacity>
            ))}
            {getEventsForDay(selectedDate.getDate()).length === 0 && (
              <Text className="text-muted-foreground text-center mt-8">No events for this day</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  )
}
