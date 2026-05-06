import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserApiKey } from '@/lib/db-queries'
import { extractEvents } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { text, model } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!model) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 })
    }

    // Get user's personal API key (if any), fall back to env variable
    const userApiKey = await getUserApiKey(user.userId)

    const events = await extractEvents(text, model, userApiKey)
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract events' },
      { status: 500 }
    )
  }
}
