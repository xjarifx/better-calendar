import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import { ApiClient } from '@better-calender/shared'

const TOKEN_KEY = 'auth_token'
const USERNAME_KEY = 'auth_username'

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'

function createApiClient(tokenGetter: () => Promise<string | null>) {
  return new ApiClient(API_BASE, tokenGetter)
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  username: string | null
  api: ApiClient
  login: (token: string, username: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)

  const getToken = useCallback(async () => {
    return SecureStore.getItemAsync(TOKEN_KEY)
  }, [])

  const [api] = useState(() => createApiClient(getToken))

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY)
      if (token) {
        const storedUsername = await SecureStore.getItemAsync(USERNAME_KEY)
        setUsername(storedUsername)
        setIsAuthenticated(true)
      }
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      await SecureStore.deleteItemAsync(USERNAME_KEY)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (token: string, newUsername: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    await SecureStore.setItemAsync(USERNAME_KEY, newUsername)
    setUsername(newUsername)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(USERNAME_KEY)
    setUsername(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, api, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
