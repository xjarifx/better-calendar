import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'

function TabIcon({ name, color, size }: { name: keyof typeof Ionicons.glyphMap; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#2e2e2e',
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <TabIcon name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <TabIcon name="list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ai-input"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, size }) => <TabIcon name="sparkles" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <TabIcon name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
