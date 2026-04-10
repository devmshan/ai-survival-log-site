import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

const mockCreate = vi.fn().mockResolvedValue({ id: 'contact-123' })

// resend 모킹 — new 키워드로 사용하므로 function 문법 필요
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { contacts: { create: mockCreate } }
  }),
}))

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue({ id: 'contact-123' })
    vi.stubEnv('RESEND_API_KEY', 'test-api-key')
    vi.stubEnv('RESEND_SEGMENT_ID', 'test-segment-id')
  })

  it('유효한 이메일이면 200을 반환한다', async () => {
    const req = makeRequest({ email: 'user@example.com' })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('이메일이 없으면 400을 반환한다', async () => {
    const req = makeRequest({})
    const res = await POST(req as never)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeTruthy()
  })

  it('@가 없는 이메일이면 400을 반환한다', async () => {
    const req = makeRequest({ email: 'notanemail' })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('잘못된 JSON body면 400을 반환한다', async () => {
    const req = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('RESEND_API_KEY가 없으면 503을 반환한다', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const req = makeRequest({ email: 'user@example.com' })
    const res = await POST(req as never)
    expect(res.status).toBe(503)
  })

  it('RESEND_SEGMENT_ID가 없으면 503을 반환한다', async () => {
    vi.stubEnv('RESEND_SEGMENT_ID', '')
    const req = makeRequest({ email: 'user@example.com' })
    const res = await POST(req as never)
    expect(res.status).toBe(503)
  })

  it('Resend API 오류 시 500을 반환한다', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API error'))

    const req = makeRequest({ email: 'user@example.com' })
    const res = await POST(req as never)
    expect(res.status).toBe(500)
  })
})
