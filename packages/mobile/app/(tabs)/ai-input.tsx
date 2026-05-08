import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import type { ExtractedEvent } from '@better-calender/shared'

export default function AIInputScreen() {
  const { api, logout } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([])
  const [error, setError] = useState('')
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [showModels, setShowModels] = useState(false)

  async function loadModels() {
    try {
      setLoading(true)
      const data = await api.getFreeModels()
      setModels(data)
      if (data.length > 0) {
        setSelectedModel(data[0].id)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load models')
    } finally {
      setLoading(false)
    }
  }

  async function handleExtract() {
    if (!text.trim()) {
      setError('Please enter some text')
      return
    }
    if (!selectedModel) {
      setError('Please select a model')
      return
    }

    setExtracting(true)
    setError('')
    try {
      const res = await api.extractEvents(text, selectedModel)
      setExtractedEvents(res.events)
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout()
        router.replace('/(auth)/login')
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to extract events')
    } finally {
      setExtracting(false)
    }
  }

  async function handleSave(event: ExtractedEvent) {
    try {
      await api.createEvent({
        title: event.title,
        startDate: event.startDate,
        startTime: event.startTime || null,
        endDate: event.endDate || null,
        endTime: event.endTime || null,
        location: event.location,
        description: event.description,
      })
      setExtractedEvents(prev => prev.filter(e => e !== event))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save event')
    }
  }

  async function handleSaveAll() {
    try {
      for (const event of extractedEvents) {
        await api.createEvent({
          title: event.title,
          startDate: event.startDate,
          startTime: event.startTime || null,
          endDate: event.endDate || null,
          endTime: event.endTime || null,
          location: event.location,
          description: event.description,
        })
      }
      setExtractedEvents([])
      setText('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save events')
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="pt-14 pb-2 px-4">
        <Text className="text-foreground text-2xl font-bold">AI Event Input</Text>
        <Text className="text-muted-foreground text-sm mt-1">
          Describe your events in natural language
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {error ? (
          <View className="bg-destructive/20 border border-destructive rounded-lg px-4 py-3 mb-4">
            <Text className="text-destructive-foreground">{error}</Text>
          </View>
        ) : null}

        <TextInput
          className="bg-card border border-border rounded-lg px-4 py-3 text-foreground min-h-[120px] mt-2"
          placeholder="e.g., Team standup tomorrow at 9am, Lunch with Sarah on Friday at 12:30pm"
          placeholderTextColor="#666"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          className="bg-card border border-border rounded-lg px-4 py-3 mt-3 flex-row items-center justify-between"
          onPress={() => { loadModels(); setShowModels(!showModels) }}
        >
          <Text className="text-foreground">
            {selectedModel ? models.find(m => m.id === selectedModel)?.name || selectedModel : 'Select AI model'}
          </Text>
          <Text className="text-muted-foreground">{showModels ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showModels && (
          <View className="bg-card border border-border rounded-lg mt-1">
            {loading ? (
              <ActivityIndicator size="small" color="#3b82f6" className="py-4" />
            ) : (
              models.map(model => (
                <TouchableOpacity
                  key={model.id}
                  className={`px-4 py-3 ${selectedModel === model.id ? 'bg-primary/20' : ''}`}
                  onPress={() => { setSelectedModel(model.id); setShowModels(false) }}
                >
                  <Text className="text-foreground">{model.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <TouchableOpacity
          className="bg-primary rounded-lg py-3 items-center mt-4"
          onPress={handleExtract}
          disabled={extracting || !text.trim()}
        >
          {extracting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-primary-foreground font-semibold text-base">Extract Events</Text>
          )}
        </TouchableOpacity>

        {extractedEvents.length > 0 && (
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-foreground font-semibold">
                Extracted Events ({extractedEvents.length})
              </Text>
              <TouchableOpacity className="bg-primary rounded-lg px-4 py-2" onPress={handleSaveAll}>
                <Text className="text-primary-foreground font-medium text-sm">Save All</Text>
              </TouchableOpacity>
            </View>

            {extractedEvents.map((event, idx) => (
              <View key={idx} className="bg-card border border-border rounded-lg p-4 mb-2">
                <Text className="text-foreground font-semibold">{event.title}</Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {event.startTime ? ` at ${new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}
                </Text>
                {event.location && (
                  <Text className="text-muted-foreground text-sm mt-1">{event.location}</Text>
                )}
                <TouchableOpacity
                  className="bg-primary rounded-lg px-4 py-2 mt-2 self-start"
                  onPress={() => handleSave(event)}
                >
                  <Text className="text-primary-foreground font-medium text-sm">Save</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
