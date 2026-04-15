#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts')
const REQUIRED_FIELDS = ['title', 'date', 'tags', 'description', 'draft']

function listChangedPostFiles() {
  const statusPath = path.join(PROJECT_ROOT, '.git')
  if (!fs.existsSync(statusPath)) return []

  const output = execFileSync(
    'git',
    ['status', '--porcelain', '--untracked-files=all', '--', 'content/posts'],
    { cwd: PROJECT_ROOT, encoding: 'utf-8' }
  ).trim()

  if (!output) return []

  return output
    .split('\n')
    .map(line => line.slice(3).trim())
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => path.join(PROJECT_ROOT, file))
}

function listAllPostFiles() {
  return fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => path.join(POSTS_DIR, file))
}

function validateFile(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  const errors = []

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(`${relativePath}: missing required frontmatter field "${field}"`)
    }
  }

  if ('title' in data && typeof data.title !== 'string') {
    errors.push(`${relativePath}: "title" must be a string`)
  }
  if ('date' in data && typeof data.date !== 'string') {
    errors.push(`${relativePath}: "date" must be a string`)
  }
  if ('tags' in data && !Array.isArray(data.tags)) {
    errors.push(`${relativePath}: "tags" must be an array`)
  }
  if ('description' in data && typeof data.description !== 'string') {
    errors.push(`${relativePath}: "description" must be a string`)
  }
  if ('draft' in data && typeof data.draft !== 'boolean') {
    errors.push(`${relativePath}: "draft" must be a boolean`)
  }
  if ('series' in data && typeof data.series !== 'string') {
    errors.push(`${relativePath}: "series" must be a string when present`)
  }
  if ('seriesSlug' in data && typeof data.seriesSlug !== 'string') {
    errors.push(`${relativePath}: "seriesSlug" must be a string when present`)
  }
  if ('seriesOrder' in data && typeof data.seriesOrder !== 'number') {
    errors.push(`${relativePath}: "seriesOrder" must be a number when present`)
  }
  if (data.series && !data.seriesSlug) {
    errors.push(`${relativePath}: "seriesSlug" is required when "series" is present`)
  }

  return { data, errors, relativePath }
}

function validateSeriesRules(files) {
  const warnings = []
  const grouped = new Map()

  for (const file of files) {
    if (file.errors.length > 0) continue
    const { data, relativePath } = file
    if (data.draft || !data.series || !data.seriesSlug) continue

    if (!grouped.has(data.seriesSlug)) {
      grouped.set(data.seriesSlug, [])
    }
    grouped.get(data.seriesSlug).push({ relativePath, data })
  }

  for (const [seriesSlug, posts] of grouped.entries()) {
    const seenOrders = new Map()

    for (const post of posts) {
      if (post.data.seriesOrder === undefined) {
        warnings.push(
          `${post.relativePath}: missing "seriesOrder" means the post is excluded from public series navigation for "${seriesSlug}"`
        )
        continue
      }

      if (!seenOrders.has(post.data.seriesOrder)) {
        seenOrders.set(post.data.seriesOrder, [])
      }
      seenOrders.get(post.data.seriesOrder).push(post.relativePath)
    }

    for (const [order, paths] of seenOrders.entries()) {
      if (paths.length > 1) {
        warnings.push(
          `[series:${seriesSlug}] duplicate "seriesOrder" ${order}; runtime will warn and use date as secondary sort`
        )
      }
    }
  }

  return warnings
}

function main() {
  const checkAll = process.argv.includes('--all')
  const filesToCheck = checkAll ? listAllPostFiles() : listChangedPostFiles()

  if (filesToCheck.length === 0) {
    console.log('[content-contract] no changed post files to verify')
    return
  }

  const results = filesToCheck.map(validateFile)
  const errors = results.flatMap(result => result.errors)
  const warnings = validateSeriesRules(results)

  for (const warning of warnings) {
    console.warn(`[content-contract] WARN ${warning}`)
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[content-contract] ERROR ${error}`)
    }
    process.exit(1)
  }

  console.log(`[content-contract] verified ${filesToCheck.length} post file(s)`)
}

main()
