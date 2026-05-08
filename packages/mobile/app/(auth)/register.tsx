import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth-context'

export default function RegisterScreen() {
  const { api, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!username || !password) {
      setError('Username and password required')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.register(username, password)
      await login(res.token, res.username)
      router.replace('/(tabs)/calendar')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-8">
        <Text className="text-foreground text-3xl font-bold mb-2">
          Create Account
        </Text>
        <Text className="text-muted-foreground text-lg mb-8">
          Join Better Calendar
        </Text>

        {error ? (
          <View className="bg-destructive/20 border border-destructive rounded-lg px-4 py-3 mb-4">
            <Text className="text-destructive-foreground">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4">
          <View>
            <Text className="text-foreground text-sm font-medium mb-2">Username</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Choose a username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="text-foreground text-sm font-medium mb-2">Password</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Choose a password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-foreground text-sm font-medium mb-2">Confirm Password</Text>
            <TextInput
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Confirm your password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center mt-2"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-base">Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-6 items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-primary">
            Already have an account? <Text className="font-semibold">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
