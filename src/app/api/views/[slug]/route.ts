import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    const views = await kv.get<number>(`views:${slug}`)
    return NextResponse.json({ success: true, data: { views: views ?? 0 } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch views' },
      { status: 500 }
    )
  }
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    await kv.incr(`views:${slug}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}
