import { View, Text, TouchableOpacity } from 'react-native'
import type { CalendarEvent } from '@better-calender/shared'

interface EventCardProps {
  event: CalendarEvent
  onPress: () => void
}

export function EventCard({ event, onPress }: EventCardProps) {
  function formatTime(timeStr: string | null) {
    if (!timeStr) return 'All day'
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <TouchableOpacity
      className="bg-card border border-border rounded-lg p-4 mb-2"
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View className="w-1 h-full bg-primary rounded-full" />
        <View className="flex-1">
          <Text className="text-foreground font-semibold text-base">{event.title}</Text>
          <Text className="text-muted-foreground text-sm mt-1">
            {new Date(event.start_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {formatTime(event.start_time)}
            {event.end_time ? ` — ${formatTime(event.end_time)}` : ''}
          </Text>
          {event.location && (
            <Text className="text-muted-foreground text-sm mt-1">{event.location}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
