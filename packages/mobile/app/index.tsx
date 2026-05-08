import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '../lib/auth-context'

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/calendar" />
  }

  return <Redirect href="/(auth)/login" />
}
