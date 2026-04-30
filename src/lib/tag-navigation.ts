export const FEATURED_TAGS = [
  'AI',
  'codex',
  'agent-harness',
  'automation',
  'developer',
  'workflow',
  'study',
  'llm',
] as const

export function getFeaturedTags(tags: string[]): string[] {
  const availableTags = new Set(tags)
  return FEATURED_TAGS.filter(tag => availableTags.has(tag))
}

export function getTagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`
}
