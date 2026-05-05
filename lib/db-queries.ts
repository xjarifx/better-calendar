import { prisma } from './db'
import type { Event, User } from '@prisma/client'
import bcrypt from 'bcrypt'

export async function createUser(username: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { username },
  })
}

export async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function createEvent(data: {
  userId: number
  title: string
  startDate: Date
  startTime?: Date | null
  endDate?: Date | null
  endTime?: Date | null
  location?: string
  description?: string
}): Promise<Event> {
  return prisma.event.create({
    data: {
      userId: data.userId,
      title: data.title,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
    },
  })
}

export async function getEventsByUserId(userId: number): Promise<Event[]> {
  return prisma.event.findMany({
    where: { userId },
    orderBy: { startDate: 'asc' },
  })
}

export async function getEventById(id: number, userId: number): Promise<Event | null> {
  return prisma.event.findFirst({
    where: { id, userId },
  })
}

export async function updateEvent(
  id: number,
  userId: number,
  data: Partial<{
    title: string
    startDate: Date
    startTime: Date | null
    endDate: Date | null
    endTime: Date | null
    location: string
    description: string
  }>
): Promise<Event> {
  return prisma.event.update({
    where: { id },
    data,
  })
}

export async function deleteEvent(id: number, userId: number): Promise<Event> {
  return prisma.event.delete({
    where: { id },
  })
}
