'use client'

import { useEffect, useRef } from 'react'

interface MermaidRendererProps {
  chart: string
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function render() {
      const mermaid = (await import('mermaid')).default
      mermaid.initialize({ startOnLoad: false, theme: 'default' })
      if (ref.current) {
        ref.current.innerHTML = ''
        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.render(id, chart)
        ref.current.innerHTML = svg
      }
    }
    render()
  }, [chart])

  return <div ref={ref} className="my-4 overflow-x-auto" />
}
