import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '유효하지 않은 이메일입니다.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: '뉴스레터 서비스가 설정되지 않았습니다.' }, { status: 503 })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.contacts.create({
      email,
      segments: [{ id: process.env.RESEND_SEGMENT_ID ?? '' }],
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '구독 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
