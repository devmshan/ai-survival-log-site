import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

const KV_VIEWS_PREFIX = 'views:'
const VALID_SLUG_PATTERN = /^[a-z0-9-]+$/

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 })
  }
  try {
    const views = await kv.get<number>(`${KV_VIEWS_PREFIX}${slug}`)
    return NextResponse.json({ success: true, data: { views: views ?? 0 } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch views' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { success: false, error: 'Invalid slug' },
      { status: 400 }
    )
  }
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const dedupeKey = `viewed:${ip}:${slug}`
    const alreadyViewed = await kv.get(dedupeKey)
    if (!alreadyViewed) {
      await kv.incr(`${KV_VIEWS_PREFIX}${slug}`)
      await kv.set(dedupeKey, 1, { ex: 3600 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}
