import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockGet, mockIncr } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockIncr: vi.fn(),
}))

vi.mock('@vercel/kv', () => ({
  kv: {
    get: mockGet,
    incr: mockIncr,
  },
}))

import { GET, POST } from '../route'

function makeRequest(method: string): Request {
  return new Request(`http://localhost/api/views/my-post`, { method })
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/views/[slug]', () => {
  it('조회수를 반환한다', async () => {
    mockGet.mockResolvedValue(42)
    const res = await GET(makeRequest('GET') as unknown as NextRequest, makeParams('my-post'))
    const json = await res.json()
    expect(json).toEqual({ success: true, data: { views: 42 } })
    expect(res.status).toBe(200)
  })

  it('키가 없으면 0을 반환한다', async () => {
    mockGet.mockResolvedValue(null)
    const res = await GET(makeRequest('GET') as unknown as NextRequest, makeParams('my-post'))
    const json = await res.json()
    expect(json).toEqual({ success: true, data: { views: 0 } })
  })

  it('KV 오류 시 500을 반환한다', async () => {
    mockGet.mockRejectedValue(new Error('KV error'))
    const res = await GET(makeRequest('GET') as unknown as NextRequest, makeParams('my-post'))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('유효하지 않은 slug는 400을 반환한다', async () => {
    const res = await GET(makeRequest('GET') as unknown as NextRequest, makeParams('Invalid Slug!'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

describe('POST /api/views/[slug]', () => {
  it('올바른 KV 키로 INCR을 호출한다', async () => {
    mockIncr.mockResolvedValue(1)
    const res = await POST(makeRequest('POST') as unknown as NextRequest, makeParams('my-post'))
    expect(mockIncr).toHaveBeenCalledWith('views:my-post')
    const json = await res.json()
    expect(json).toEqual({ success: true })
    expect(res.status).toBe(200)
  })

  it('KV 오류 시 500을 반환한다', async () => {
    mockIncr.mockRejectedValue(new Error('KV error'))
    const res = await POST(makeRequest('POST') as unknown as NextRequest, makeParams('my-post'))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('유효하지 않은 slug는 400을 반환한다', async () => {
    const res = await POST(makeRequest('POST') as unknown as NextRequest, makeParams('Invalid Slug!'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
