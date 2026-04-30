export const FEATURED_TAGS = [
  'AI',
  'claude-code',
  'codex',
  'agent-harness',
  'automation',
  'developer',
  'workflow',
  'study',
  'llm',
] as const

const TAG_ALIASES = new Map<string, string>([
  ['Claude Code', 'claude-code'],
])

export function getFeaturedTags(tags: string[]): string[] {
  const availableTags = new Set(tags)
  return FEATURED_TAGS.filter(tag => availableTags.has(tag))
}

export function getCanonicalTag(tag: string): string {
  return TAG_ALIASES.get(tag) ?? tag
}

export function getTagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`
}
