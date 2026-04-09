'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <h3 className="font-semibold mb-1">새 글 알림 받기</h3>
      <p className="text-sm text-muted-foreground mb-3">
        새 포스트가 올라오면 이메일로 알려드립니다.
      </p>
      {status === 'success' ? (
        <p className="text-sm text-green-600">구독해주셔서 감사합니다!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? '처리 중...' : '구독'}
          </Button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-500 mt-2">오류가 발생했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  )
}
