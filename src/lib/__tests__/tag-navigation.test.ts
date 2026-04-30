import { describe, expect, it } from 'vitest'
import { getCanonicalTag, getFeaturedTags, getTagHref } from '../tag-navigation'

describe('tag navigation', () => {
  it('canonicalizes retired display-label tags', () => {
    expect(getCanonicalTag('Claude Code')).toBe('claude-code')
    expect(getCanonicalTag('codex')).toBe('codex')
  })

  it('promotes claude-code when available', () => {
    expect(getFeaturedTags(['codex', 'claude-code', 'graphify'])).toEqual(['claude-code', 'codex'])
  })

  it('encodes tag hrefs', () => {
    expect(getTagHref('claude-code')).toBe('/tags/claude-code')
  })
})
