import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns'

export function formatEventDate(dateStr: string, timeStr: string | null, timeFormat: '12h' | '24h' = '12h'): string {
  const date = parseISO(dateStr)
  const datePart = format(date, 'MMM d, yyyy')
  if (!timeStr) return `${datePart} · All day`
  const time = parseISO(timeStr)
  const timePattern = timeFormat === '24h' ? 'HH:mm' : 'h:mm a'
  const timePart = format(time, timePattern)
  return `${datePart} · ${timePart}`
}

export function getCalendarDays(year: number, month: number, firstDayOfWeek: number = 0): Date[] {
  const date = new Date(year, month)
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calStart = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 })
  return eachDayOfInterval({ start: calStart, end: calEnd })
}

export { format, parseISO, isSameMonth, isSameDay, startOfMonth, endOfMonth }
