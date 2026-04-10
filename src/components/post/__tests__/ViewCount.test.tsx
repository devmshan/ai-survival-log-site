import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ViewCount } from '../ViewCount'

describe('ViewCount', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('로딩 중에는 —를 표시한다', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: { views: 42 } }),
        }), 500))
      )
    )
    render(<ViewCount slug="my-post" />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('fetch 성공 시 조회수를 표시한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { views: 42 } }),
    }))
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  it('fetch 실패 시 —를 유지한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument()
    })
  })

  it('올바른 엔드포인트를 호출한다', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { views: 0 } }),
    })
    vi.stubGlobal('fetch', mockFetch)
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/views/my-post')
    })
  })
})
