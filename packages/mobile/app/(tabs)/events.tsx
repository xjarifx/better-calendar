import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import type { CalendarEvent } from '@better-calender/shared'

export default function EventsScreen() {
  const { api, logout } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
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
      setRefreshing(false)
    }
  }, [api, logout])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  function onRefresh() {
    setRefreshing(true)
    fetchEvents()
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function formatTime(timeStr: string | null) {
    if (!timeStr) return 'All day'
    return new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  function renderEvent({ item }: { item: CalendarEvent }) {
    return (
      <TouchableOpacity
        className="bg-card border border-border rounded-lg p-4 mb-2 mx-4"
        onPress={() => router.push(`/events/${item.id}`)}
      >
        <View className="flex-row items-start gap-3">
          <View className="w-1 h-full bg-primary rounded-full" />
          <View className="flex-1">
            <Text className="text-foreground font-semibold text-base">{item.title}</Text>
            <Text className="text-muted-foreground text-sm mt-1">
              {formatDate(item.start_date)}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {formatTime(item.start_time)}
              {item.end_time ? ` — ${formatTime(item.end_time)}` : ''}
            </Text>
            {item.location && (
              <Text className="text-muted-foreground text-sm mt-1">{item.location}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-2 px-4">
        <Text className="text-foreground text-2xl font-bold">Events</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-destructive-foreground text-center">{error}</Text>
          <TouchableOpacity className="mt-4 bg-primary rounded-lg px-6 py-2" onPress={fetchEvents}>
            <Text className="text-primary-foreground font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedEvents}
          renderItem={renderEvent}
          keyExtractor={item => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-muted-foreground text-lg">No events yet</Text>
              <Text className="text-muted-foreground text-sm mt-1">Use AI to create your first event</Text>
            </View>
          }
        />
      )}
    </View>
  )
}
