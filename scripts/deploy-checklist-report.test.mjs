import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  PROJECT_ROOT,
  buildReport,
  main,
  resolveSafeOutputPath,
  scanBlockedPatterns,
} from './deploy-checklist-report.mjs'

const tempDirs = []

function makeTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-checklist-report-'))
  tempDirs.push(dir)
  return dir
}

function readFixtureJson() {
  return JSON.parse(fs.readFileSync(
    path.join(PROJECT_ROOT, 'docs/automation/samples/deploy-checklist-blocked.json'),
    'utf-8',
  ))
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('deploy checklist report generator', () => {
  it('renders the checked-in blocked sample report deterministically', () => {
    const report = buildReport(readFixtureJson())
    const expected = fs.readFileSync(
      path.join(PROJECT_ROOT, 'docs/automation/samples/deploy-checklist-blocked-report.md'),
      'utf-8',
    )

    expect(report).toBe(expected)
    expect(buildReport(readFixtureJson())).toBe(report)
  })

  it('writes a local artifact into an operating system temp directory', () => {
    const dir = makeTempDir()
    const output = path.join(dir, 'deploy-checklist-report.md')
    const streams = {
      stdout: { write: () => {} },
      stderr: { write: message => { throw new Error(message) } },
    }

    const exitCode = main([
      'node',
      'scripts/deploy-checklist-report.mjs',
      '--input',
      'docs/automation/samples/deploy-checklist-blocked.json',
      '--output',
      output,
    ], streams)

    expect(exitCode).toBe(0)
    expect(fs.readFileSync(output, 'utf-8')).toContain('status: blocked before deploy')
  })

  it('allows repo tmp artifacts for CI artifact preview dry-runs', () => {
    const resolved = resolveSafeOutputPath('tmp/ci-artifacts/deploy-checklist-report.md')
    expect(resolved).toBe(path.join(PROJECT_ROOT, 'tmp/ci-artifacts/deploy-checklist-report.md'))
  })

  it('refuses generated output under source and docs paths', () => {
    const messages = []
    const exitCode = main([
      'node',
      'scripts/deploy-checklist-report.mjs',
      '--input',
      'docs/automation/samples/deploy-checklist-blocked.json',
      '--output',
      'docs/automation/generated-report.md',
    ], {
      stdout: { write: () => {} },
      stderr: { write: message => messages.push(message) },
    })

    expect(exitCode).toBe(1)
    expect(messages.join('')).toContain('outside repo tmp/')
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'docs/automation/generated-report.md'))).toBe(false)
  })

  it('blocks unsafe input before writing an artifact', () => {
    const dir = makeTempDir()
    const input = path.join(dir, 'unsafe.json')
    const output = path.join(dir, 'report.md')
    fs.writeFileSync(input, JSON.stringify({
      ...readFixtureJson(),
      firstBlockingCheck: {
        signal: 'TOKEN=unsafe-value',
        check: 'derived state review',
        observedAt: 'sanitized mock fixture',
      },
    }), 'utf-8')

    const messages = []
    const exitCode = main([
      'node',
      'scripts/deploy-checklist-report.mjs',
      '--input',
      input,
      '--output',
      output,
    ], {
      stdout: { write: () => {} },
      stderr: { write: message => messages.push(message) },
    })

    expect(exitCode).toBe(1)
    expect(messages.join('')).toContain('unsafe pattern')
    expect(fs.existsSync(output)).toBe(false)
  })

  it('detects unsafe report patterns with the same scanner used by writes', () => {
    expect(scanBlockedPatterns('safe local dry-run report')).toEqual([])
    expect(scanBlockedPatterns('API_TOKEN=unsafe-value')).toEqual(['api token assignment'])
  })
})
