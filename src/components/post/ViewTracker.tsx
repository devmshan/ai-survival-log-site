'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' })
  }, [slug])

  return null
}
