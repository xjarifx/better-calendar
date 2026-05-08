export interface UserProfile {
  username: string
  hasApiKey: boolean
  timeFormat: string
  firstDayOfWeek: number
}

export interface CalendarEvent {
  id: number
  user_id: number
  title: string
  start_date: string
  start_time: string | null
  end_date: string | null
  end_time: string | null
  location: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  id: number
  username: string
  token: string
}

export interface ExtractedEvent {
  title: string
  startDate: string
  startTime?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
}

export interface CreateEventData {
  title: string
  startDate: string
  startTime?: string | null
  endDate?: string | null
  endTime?: string | null
  location?: string
  description?: string
}
