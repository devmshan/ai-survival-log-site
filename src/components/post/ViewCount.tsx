'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCountProps {
  slug: string
}

export function ViewCount({ slug }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/views/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (json.success) setViews(json.data.views)
      })
      .catch(() => {
        // 실패 시 — 유지
      })
  }, [slug])

  return (
    <span className="flex items-center gap-1">
      <Eye className="w-3 h-3" />
      {views === null ? '—' : views}
    </span>
  )
}
