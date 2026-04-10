import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterForm } from '../NewsletterForm'

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('이메일 입력창과 구독 버튼이 렌더링된다', () => {
    render(<NewsletterForm />)
    expect(screen.getByPlaceholderText('이메일 주소')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '구독' })).toBeInTheDocument()
  })

  it('구독 성공 시 감사 메시지를 표시한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const user = userEvent.setup()

    render(<NewsletterForm />)
    await user.type(screen.getByPlaceholderText('이메일 주소'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '구독' }))

    await waitFor(() => {
      expect(screen.getByText('구독해주셔서 감사합니다!')).toBeInTheDocument()
    })
  })

  it('구독 실패 시 에러 메시지를 표시한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const user = userEvent.setup()

    render(<NewsletterForm />)
    await user.type(screen.getByPlaceholderText('이메일 주소'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '구독' }))

    await waitFor(() => {
      expect(screen.getByText('오류가 발생했습니다. 다시 시도해주세요.')).toBeInTheDocument()
    })
  })

  it('제출 중에는 버튼이 비활성화된다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    ))
    const user = userEvent.setup()

    render(<NewsletterForm />)
    await user.type(screen.getByPlaceholderText('이메일 주소'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '구독' }))

    expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled()
  })

  it('올바른 payload로 API를 호출한다', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)
    const user = userEvent.setup()

    render(<NewsletterForm />)
    await user.type(screen.getByPlaceholderText('이메일 주소'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '구독' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com' }),
      })
    })
  })
})
