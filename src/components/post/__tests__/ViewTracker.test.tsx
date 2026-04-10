import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { ViewTracker } from '../ViewTracker'

describe('ViewTracker', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('마운트 시 POST /api/views/[slug]를 호출한다', () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    render(<ViewTracker slug="my-post" />)

    expect(mockFetch).toHaveBeenCalledWith('/api/views/my-post', { method: 'POST' })
  })

  it('아무것도 렌더링하지 않는다', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const { container } = render(<ViewTracker slug="my-post" />)
    expect(container.firstChild).toBeNull()
  })
})
