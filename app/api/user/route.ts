import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { updateUserApiKey } from '@/lib/db-queries'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dbUser = await prisma.users.findUnique({
      where: { id: user.userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      username: dbUser.username,
      hasApiKey: !!dbUser.apiKey,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { apiKey } = body

    // Validate API key format if provided
    if (apiKey && typeof apiKey === 'string') {
      if (!apiKey.startsWith('sk-or-')) {
        return NextResponse.json(
          { error: 'Invalid API key format. OpenRouter keys start with "sk-or-"' },
          { status: 400 }
        )
      }
    }

    await updateUserApiKey(user.userId, apiKey || null)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}
