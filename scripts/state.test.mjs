import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  exportContentContractSummary,
  exportContentInventory,
  exportSeriesManifest,
  main,
  readPost,
} from './state'

const tempDirs = []

function makeTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-state-'))
  tempDirs.push(dir)
  return dir
}

function writePost(dir, filename, content) {
  const filePath = path.join(dir, filename)
  fs.writeFileSync(filePath, content, 'utf-8')
  return filePath
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('state export', () => {
  it('writes content inventory entries', () => {
    const root = makeTempDir()
    const postsDir = path.join(root, 'content', 'posts')
    const outputDir = path.join(root, 'output', 'state')
    fs.mkdirSync(postsDir, { recursive: true })

    writePost(postsDir, 'first-post.mdx', `---
title: First Post
date: 2026-04-01
tags: [AI]
description: First description
draft: false
---
# Hello
`)

    const posts = [readPost(path.join(postsDir, 'first-post.mdx'), root)]
    const outputPath = exportContentInventory(posts, outputDir)
    const payload = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))

    expect(payload.totalPosts).toBe(1)
    expect(payload.entries[0].slug).toBe('first-post')
    expect(payload.entries[0].path).toBe('content/posts/first-post.mdx')
  })

  it('writes ordered series manifest entries', () => {
    const root = makeTempDir()
    const postsDir = path.join(root, 'content', 'posts')
    const outputDir = path.join(root, 'output', 'state')
    fs.mkdirSync(postsDir, { recursive: true })

    writePost(postsDir, 'series-2.mdx', `---
title: Part 2
date: 2026-04-02
tags: [system-design]
description: Part 2
draft: false
series: Series
seriesSlug: series
seriesOrder: 2
---
# Two
`)

    writePost(postsDir, 'series-1.mdx', `---
title: Part 1
date: 2026-04-01
tags: [system-design]
description: Part 1
draft: false
series: Series
seriesSlug: series
seriesOrder: 1
---
# One
`)

    const posts = [
      readPost(path.join(postsDir, 'series-2.mdx'), root),
      readPost(path.join(postsDir, 'series-1.mdx'), root),
    ]
    const outputPath = exportSeriesManifest(posts, outputDir)
    const payload = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))

    expect(payload.totalSeries).toBe(1)
    expect(payload.entries[0].posts.map(post => post.seriesOrder)).toEqual([1, 2])
  })

  it('reports content contract issues and validity', () => {
    const root = makeTempDir()
    const postsDir = path.join(root, 'content', 'posts')
    const outputDir = path.join(root, 'output', 'state')
    fs.mkdirSync(postsDir, { recursive: true })

    writePost(postsDir, 'broken-post.mdx', `---
title: Broken
date: 2026-04-01
tags: [AI]
draft: false
series: Broken Series
---
# Broken
`)

    const posts = [readPost(path.join(postsDir, 'broken-post.mdx'), root)]
    const outputPath = exportContentContractSummary(posts, outputDir)
    const payload = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))

    expect(payload.valid).toBe(false)
    expect(payload.missingRequiredCount).toBe(1)
    expect(payload.warnings[0].code).toBe('missing-series-slug')
  })

  it('returns 1 when --only is missing a value', () => {
    const originalArgv = process.argv
    process.argv = ['node', 'scripts/state', '--only']

    try {
      expect(main()).toBe(1)
    } finally {
      process.argv = originalArgv
    }
  })

  it('includes file path when frontmatter parsing fails', () => {
    const root = makeTempDir()
    const postsDir = path.join(root, 'content', 'posts')
    fs.mkdirSync(postsDir, { recursive: true })

    const brokenPath = writePost(postsDir, 'broken-post.mdx', `---\ntitle: Broken\ninvalid: [\n`)
    expect(() => readPost(brokenPath, root)).toThrow(`failed to parse frontmatter for post: ${brokenPath}`)
  })
})
