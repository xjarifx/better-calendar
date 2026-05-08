import type {
  CalendarEvent,
  LoginResponse,
  UserProfile,
  ExtractedEvent,
  AIModel,
  CreateEventData,
} from './types'

export class ApiClient {
  private baseUrl: string
  private getToken: () => Promise<string | null> | string | null

  constructor(
    baseUrl: string,
    getToken: () => Promise<string | null> | string | null
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.getToken = getToken
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || `Request failed with status ${res.status}`)
    }

    if (res.status === 204) return undefined as T
    return res.json()
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, password: string): Promise<LoginResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async getEvents(): Promise<CalendarEvent[]> {
    return this.request('/api/events')
  }

  async getEvent(id: number): Promise<CalendarEvent> {
    return this.request(`/api/events/${id}`)
  }

  async createEvent(data: CreateEventData): Promise<CalendarEvent> {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEvent(
    id: number,
    data: Partial<CreateEventData>
  ): Promise<CalendarEvent> {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request(`/api/events/${id}`, {
      method: 'DELETE',
    })
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.request('/api/user')
  }

  async updateApiKey(
    apiKey: string | null
  ): Promise<{ success: boolean }> {
    return this.request('/api/user', {
      method: 'PUT',
      body: JSON.stringify({ apiKey }),
    })
  }

  async updateProfile(data: {
    timeFormat?: string
    firstDayOfWeek?: number
  }): Promise<{ success: boolean }> {
    return this.request('/api/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateUsername(
    username: string,
    currentPassword: string
  ): Promise<{ success: boolean }> {
    return this.request('/api/user', {
      method: 'PUT',
      body: JSON.stringify({ username, currentPassword }),
    })
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; token?: string }> {
    return this.request('/api/user', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async extractEvents(
    text: string,
    model: string
  ): Promise<{ events: ExtractedEvent[] }> {
    return this.request('/api/ai/extract', {
      method: 'POST',
      body: JSON.stringify({ text, model }),
    })
  }

  async getFreeModels(): Promise<AIModel[]> {
    return this.request('/api/ai/models')
  }
}
