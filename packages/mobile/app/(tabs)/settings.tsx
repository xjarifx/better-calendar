import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import type { UserProfile } from '@better-calender/shared'

export default function SettingsScreen() {
  const { api, username, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [apiKey, setApiKey] = useState('')
  const [savingApiKey, setSavingApiKey] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const data = await api.getUserProfile()
      setProfile(data)
      setApiKey(data.hasApiKey ? '••••••••' : '')
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout()
        router.replace('/(auth)/login')
        return
      }
      setError(e instanceof Error ? e.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveApiKey() {
    if (apiKey === '••••••••') return
    setSavingApiKey(true)
    setError('')
    try {
      await api.updateApiKey(apiKey || null)
      setApiKey(apiKey ? '••••••••' : '')
      Alert.alert('Saved', 'API key updated successfully')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save API key')
    } finally {
      setSavingApiKey(false)
    }
  }

  async function handleToggleTimeFormat() {
    if (!profile) return
    setSavingPrefs(true)
    try {
      const newFormat = profile.timeFormat === '12h' ? '24h' : '12h'
      await api.updateProfile({ timeFormat: newFormat })
      setProfile({ ...profile, timeFormat: newFormat })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update preferences')
    } finally {
      setSavingPrefs(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      setError('Current and new password required')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setChangingPassword(true)
    setError('')
    try {
      await api.updatePassword(currentPassword, newPassword)
      Alert.alert('Success', 'Password changed. Please log in again.')
      logout()
      router.replace('/(auth)/login')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.replace('/(auth)/login')
  }

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="pt-14 pb-2 px-4">
        <Text className="text-foreground text-2xl font-bold">Settings</Text>
      </View>

      {error ? (
        <View className="bg-destructive/20 border border-destructive rounded-lg px-4 py-3 mx-4 mb-4">
          <Text className="text-destructive-foreground">{error}</Text>
        </View>
      ) : null}

      <View className="px-4 space-y-6">
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-foreground font-semibold mb-1">Account</Text>
          <Text className="text-muted-foreground">Signed in as {username}</Text>
        </View>

        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-foreground font-semibold mb-2">OpenRouter API Key</Text>
          <Text className="text-muted-foreground text-sm mb-2">
            Optional. Leave blank to use the shared API key.
          </Text>
          <TextInput
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
            placeholder="sk-or-..."
            placeholderTextColor="#666"
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            className="bg-primary rounded-lg py-2 items-center mt-2"
            onPress={handleSaveApiKey}
            disabled={savingApiKey}
          >
            {savingApiKey ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-medium">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-foreground font-semibold mb-2">Preferences</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground">Time Format</Text>
            <TouchableOpacity
              className="bg-background border border-border rounded-lg px-4 py-2"
              onPress={handleToggleTimeFormat}
              disabled={savingPrefs}
            >
              {savingPrefs ? (
                <ActivityIndicator color="#3b82f6" size="small" />
              ) : (
                <Text className="text-foreground">{profile?.timeFormat || '12h'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-foreground font-semibold mb-2">Change Password</Text>
          <TextInput
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-2"
            placeholder="Current password"
            placeholderTextColor="#666"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-2"
            placeholder="New password (min 6 chars)"
            placeholderTextColor="#666"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-primary rounded-lg py-2 items-center"
            onPress={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-medium">Change Password</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-destructive/20 border border-destructive rounded-lg py-3 items-center mb-8"
          onPress={handleLogout}
        >
          <Text className="text-destructive-foreground font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
