import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { router, useLocalSearchParams, Stack } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import type { CalendarEvent } from '@better-calender/shared'

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { api, logout } = useAuth()
  const [event, setEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [id])

  async function fetchEvent() {
    try {
      const data = await api.getEvent(Number(id))
      setEvent(data)
      setTitle(data.title)
      setLocation(data.location || '')
      setDescription(data.description || '')
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout()
        router.replace('/(auth)/login')
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.updateEvent(Number(id), {
        title: title.trim(),
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      })
      Alert.alert('Saved', 'Event updated successfully')
      router.back()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    Alert.alert('Delete Event', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteEvent(Number(id))
            router.back()
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete event')
          }
        },
      },
    ])
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function formatTime(timeStr: string | null) {
    if (!timeStr) return 'All day'
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  if (error && !event) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-destructive-foreground">{error}</Text>
        <TouchableOpacity className="mt-4 bg-primary rounded-lg px-6 py-2" onPress={fetchEvent}>
          <Text className="text-primary-foreground font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Event', headerShown: true, headerStyle: { backgroundColor: '#0a0a0a' }, headerTintColor: '#fff' }} />
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-4 pt-4">
          {error ? (
            <View className="bg-destructive/20 border border-destructive rounded-lg px-4 py-3 mb-4">
              <Text className="text-destructive-foreground">{error}</Text>
            </View>
          ) : null}

          <View className="bg-card border border-border rounded-lg p-4 mb-4">
            <Text className="text-muted-foreground text-sm">Date</Text>
            <Text className="text-foreground text-base mt-1">
              {event ? formatDate(event.start_date) : ''}
            </Text>
            <Text className="text-foreground text-base">
              {event ? formatTime(event.start_time) : ''}
              {event?.end_time ? ` — ${formatTime(event.end_time)}` : ''}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-foreground text-sm font-medium mb-2">Title</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
              placeholderTextColor="#666"
            />
          </View>

          <View className="mb-4">
            <Text className="text-foreground text-sm font-medium mb-2">Location</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              value={location}
              onChangeText={setLocation}
              placeholder="Add location"
              placeholderTextColor="#666"
            />
          </View>

          <View className="mb-6">
            <Text className="text-foreground text-sm font-medium mb-2">Description</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground min-h-[80px]"
              value={description}
              onChangeText={setDescription}
              placeholder="Add description"
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center mb-3"
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-base">Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-destructive/20 border border-destructive rounded-lg py-3 items-center mb-8"
            onPress={handleDelete}
          >
            <Text className="text-destructive-foreground font-semibold">Delete Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
