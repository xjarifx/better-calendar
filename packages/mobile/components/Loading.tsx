import { View, ActivityIndicator, Text } from 'react-native'

interface LoadingProps {
  message?: string
}

export function Loading({ message }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#3b82f6" />
      {message && (
        <Text className="text-muted-foreground mt-3">{message}</Text>
      )}
    </View>
  )
}
