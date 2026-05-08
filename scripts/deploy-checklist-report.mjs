#!/usr/bin/env node

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const PROJECT_ROOT = path.resolve(__dirname, '..')
export const GENERATOR_VERSION = 'deploy-checklist-report-local-v1'
const LOCAL_TEMP_ROOTS = [
  os.tmpdir(),
  '/tmp',
  '/private/tmp',
  '/var/tmp',
  '/private/var/tmp',
].map(tempRoot => path.resolve(tempRoot))

const SECURITY_RULES = [
  { name: 'private key', pattern: /BEGIN (RSA|OPENSSH|PRIVATE) KEY/i },
  { name: 'github token', pattern: /ghp_[A-Za-z0-9_]{20,}/ },
  { name: 'slack token', pattern: /xox[baprs]-[A-Za-z0-9-]+/ },
  { name: 'aws access key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'api token assignment', pattern: /\b(API_TOKEN|JIRA_API_TOKEN|TOKEN|SECRET|PASSWORD)\s*=\s*\S+/i },
  { name: 'db connection string', pattern: /\b(jdbc:|DATABASE_URL=|DB_PASSWORD=|Data Source=)/i },
  { name: 'resident registration number-like pii', pattern: /\b\d{6}-[1-4]\d{6}\b/ },
  { name: 'phone number-like pii', pattern: /\b01[016789]-\d{3,4}-\d{4}\b/ },
  { name: 'source code block', pattern: /```(java|js|ts|xml|sql|plsql|kotlin|python)\b/i },
  { name: 'mybatis xml body', pattern: /<(select|insert|update|delete)\s+id=/i },
  { name: 'oracle procedure body', pattern: /\bCREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION|PACKAGE)\b/i },
  { name: 'sql statement body', pattern: /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]{0,120}\bFROM\b/i },
  { name: 'company evidence signal', pattern: /\b(company meeting original|ERP trace|review evidence|test evidence|DB dump)\b/i },
]

const REQUIRED_TOP_LEVEL_STRINGS = [
  'repository',
  'targetEnvironment',
  'branchOrCommit',
  'status',
  'category',
  'severity',
  'deployWriteStatus',
]

function block(message) {
  const error = new Error(message)
  error.name = 'DeployChecklistReportBlock'
  return error
}

function parseArgs(argv) {
  const args = {
    input: '',
    output: '',
  }

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i]
    const next = argv[i + 1]

    if (current === '--input' && next) {
      args.input = next
      i += 1
      continue
    }
    if (current === '--output' && next) {
      args.output = next
      i += 1
      continue
    }
    if (current === '--help' || current === '-h') {
      args.help = true
      continue
    }

    throw block(`unknown or incomplete argument: ${current}`)
  }

  if (!args.help && !args.input) throw block('missing required --input')
  return args
}

function helpText() {
  return [
    'Usage: node scripts/deploy-checklist-report.mjs --input <checklist.json> [--output <file>]',
    '',
    'Generates a local deploy checklist markdown report from a sanitized JSON fixture.',
    'Output writes are limited to repo tmp/ or the operating system temp directory.',
    'The generator does not run deploy commands, upload artifacts, or call external services.',
    '',
  ].join('\n')
}

function resolveFromProject(inputPath) {
  return path.isAbsolute(inputPath) ? path.resolve(inputPath) : path.resolve(PROJECT_ROOT, inputPath)
}

export function scanBlockedPatterns(text) {
  return SECURITY_RULES
    .filter(rule => rule.pattern.test(text))
    .map(rule => rule.name)
}

function readJsonInput(inputPath) {
  const resolved = resolveFromProject(inputPath)
  if (!fs.existsSync(resolved)) throw block(`input file not found: ${inputPath}`)

  const raw = fs.readFileSync(resolved, 'utf-8')
  const blocked = scanBlockedPatterns(raw)
  if (blocked.length > 0) {
    throw block(`unsafe pattern(s) in checklist input: ${blocked.join(', ')}`)
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    throw block(`failed to parse checklist JSON: ${error.message}`)
  }
}

function requireString(payload, key, context = 'checklist') {
  const value = payload?.[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw block(`${context}.${key} must be a non-empty string`)
  }
  return value.trim()
}

function requireBoolean(payload, key, context) {
  const value = payload?.[key]
  if (typeof value !== 'boolean') {
    throw block(`${context}.${key} must be a boolean`)
  }
  return value
}

function requireArray(payload, key, context) {
  const value = payload?.[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw block(`${context}.${key} must be a non-empty array`)
  }
  return value
}

function requireStringArray(payload, key, context) {
  return requireArray(payload, key, context).map((value, index) => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw block(`${context}.${key}[${index}] must be a non-empty string`)
    }
    return value.trim()
  })
}

function validateChecks(payload, key) {
  return requireArray(payload, key, 'checklist').map((check, index) => ({
    name: requireString(check, 'name', `${key}[${index}]`),
    commandOrEvidence: requireString(check, 'commandOrEvidence', `${key}[${index}]`),
    result: requireString(check, 'result', `${key}[${index}]`),
  }))
}

function validateSkippedChecks(payload) {
  return requireArray(payload, 'checksSkipped', 'checklist').map((check, index) => ({
    name: requireString(check, 'name', `checksSkipped[${index}]`),
    reason: requireString(check, 'reason', `checksSkipped[${index}]`),
  }))
}

export function validateChecklist(payload) {
  const checklist = Object.fromEntries(
    REQUIRED_TOP_LEVEL_STRINGS.map(key => [key, requireString(payload, key)]),
  )

  if (!['none', 'not-run', 'no external write'].includes(checklist.deployWriteStatus.toLowerCase())) {
    throw block('deployWriteStatus must show that no deploy or external write occurred')
  }

  checklist.checksRun = validateChecks(payload, 'checksRun')
  checklist.checksSkipped = validateSkippedChecks(payload)
  checklist.firstBlockingCheck = {
    signal: requireString(payload?.firstBlockingCheck, 'signal', 'firstBlockingCheck'),
    check: requireString(payload?.firstBlockingCheck, 'check', 'firstBlockingCheck'),
    observedAt: requireString(payload?.firstBlockingCheck, 'observedAt', 'firstBlockingCheck'),
  }
  checklist.suspectedScope = {
    files: requireStringArray(payload?.suspectedScope, 'files', 'suspectedScope'),
    contract: requireString(payload?.suspectedScope, 'contract', 'suspectedScope'),
    generatedArtifactImpact: requireString(payload?.suspectedScope, 'generatedArtifactImpact', 'suspectedScope'),
    downstreamImpact: requireString(payload?.suspectedScope, 'downstreamImpact', 'suspectedScope'),
  }
  checklist.reproduction = requireStringArray(payload, 'reproduction', 'checklist')
  checklist.ownerDecision = {
    needed: requireBoolean(payload?.ownerDecision, 'needed', 'ownerDecision'),
    question: requireString(payload?.ownerDecision, 'question', 'ownerDecision'),
    safeNextAction: requireString(payload?.ownerDecision, 'safeNextAction', 'ownerDecision'),
    rollbackReadiness: requireString(payload?.ownerDecision, 'rollbackReadiness', 'ownerDecision'),
    outOfScope: requireStringArray(payload?.ownerDecision, 'outOfScope', 'ownerDecision'),
  }
  checklist.unsafeDataCheck = {
    rawLogRetained: requireString(payload?.unsafeDataCheck, 'rawLogRetained', 'unsafeDataCheck'),
    redactionNeeded: requireString(payload?.unsafeDataCheck, 'redactionNeeded', 'unsafeDataCheck'),
    secretCustomerCompanySignal: requireString(payload?.unsafeDataCheck, 'secretCustomerCompanySignal', 'unsafeDataCheck'),
    environmentValuesIncluded: requireString(payload?.unsafeDataCheck, 'environmentValuesIncluded', 'unsafeDataCheck'),
    productionLogsIncluded: requireString(payload?.unsafeDataCheck, 'productionLogsIncluded', 'unsafeDataCheck'),
    stopConditionTriggered: requireString(payload?.unsafeDataCheck, 'stopConditionTriggered', 'unsafeDataCheck'),
  }
  checklist.notes = {
    secondaryCategories: requireStringArray(payload?.notes, 'secondaryCategories', 'notes'),
    flakyOrDeterministic: requireString(payload?.notes, 'flakyOrDeterministic', 'notes'),
    relatedExecutionRecord: requireString(payload?.notes, 'relatedExecutionRecord', 'notes'),
  }

  return checklist
}

function tableText(value) {
  return String(value)
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim()
}

function inlineCode(value) {
  return `\`${String(value).replace(/`/g, '\\`').trim()}\``
}

function checkRows(checks) {
  return checks
    .map(check => `| ${tableText(check.name)} | ${inlineCode(check.commandOrEvidence)} | ${tableText(check.result)} |`)
    .join('\n')
}

function skippedRows(checks) {
  return checks
    .map(check => `| ${tableText(check.name)} | ${tableText(check.reason)} |`)
    .join('\n')
}

export function buildReport(payload) {
  const checklist = validateChecklist(payload)

  return `# Deploy Checklist Report

## Summary

- repository: ${checklist.repository}
- target environment: ${checklist.targetEnvironment}
- branch or commit: ${inlineCode(checklist.branchOrCommit)}
- status: ${checklist.status}
- category: ${checklist.category}
- severity: ${checklist.severity}
- deploy write status: ${checklist.deployWriteStatus}

## Checks Run

| Check | Command or evidence | Result |
| --- | --- | --- |
${checkRows(checklist.checksRun)}

## Checks Skipped

| Check | Reason |
| --- | --- |
${skippedRows(checklist.checksSkipped)}

## First Blocking Check

- first blocking signal: ${checklist.firstBlockingCheck.signal}
- failing or blocked check: ${checklist.firstBlockingCheck.check}
- observed at: ${checklist.firstBlockingCheck.observedAt}

## Suspected Scope

- suspected files: ${checklist.suspectedScope.files.map(inlineCode).join(', ')}
- suspected contract: ${checklist.suspectedScope.contract}
- generated artifact impact: ${checklist.suspectedScope.generatedArtifactImpact}
- downstream impact: ${checklist.suspectedScope.downstreamImpact}

## Reproduction

\`\`\`bash
${checklist.reproduction.join('\n')}
\`\`\`

## Owner Decision

- owner decision needed: ${checklist.ownerDecision.needed ? 'yes' : 'no'}
- decision question: ${checklist.ownerDecision.question}
- safe next action: ${checklist.ownerDecision.safeNextAction}
- rollback readiness: ${checklist.ownerDecision.rollbackReadiness}
- out of scope: ${checklist.ownerDecision.outOfScope.join(', ')}

## Unsafe Data Check

- raw log retained: ${checklist.unsafeDataCheck.rawLogRetained}
- redaction needed: ${checklist.unsafeDataCheck.redactionNeeded}
- secret/customer/company signal: ${checklist.unsafeDataCheck.secretCustomerCompanySignal}
- environment values included: ${checklist.unsafeDataCheck.environmentValuesIncluded}
- production logs included: ${checklist.unsafeDataCheck.productionLogsIncluded}
- stop condition triggered: ${checklist.unsafeDataCheck.stopConditionTriggered}

## Notes

- secondary categories: ${checklist.notes.secondaryCategories.join(', ')}
- flaky or deterministic: ${checklist.notes.flakyOrDeterministic}
- related execution record: ${checklist.notes.relatedExecutionRecord}
- generator version: ${GENERATOR_VERSION}
`
}

function isInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

export function resolveSafeOutputPath(outputPath) {
  if (!outputPath) return ''

  const resolved = resolveFromProject(outputPath)
  if (isInside(PROJECT_ROOT, resolved)) {
    const relative = path.relative(PROJECT_ROOT, resolved)
    if (!relative.startsWith(`tmp${path.sep}`)) {
      throw block(`refusing to write generated deploy checklist report outside repo tmp/: ${relative}`)
    }
    return resolved
  }

  if (LOCAL_TEMP_ROOTS.some(tempRoot => isInside(tempRoot, resolved))) return resolved

  throw block('refusing to write generated deploy checklist report outside local temp paths')
}

function writeOutput(outputPath, report, stdout) {
  if (!outputPath) {
    stdout.write(report)
    return
  }

  const resolved = resolveSafeOutputPath(outputPath)
  const blocked = scanBlockedPatterns(report)
  if (blocked.length > 0) {
    throw block(`unsafe pattern(s) in generated report: ${blocked.join(', ')}`)
  }

  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, report, 'utf-8')
}

export function main(argv = process.argv, streams = process) {
  try {
    const args = parseArgs(argv)
    if (args.help) {
      streams.stdout.write(helpText())
      return 0
    }

    const payload = readJsonInput(args.input)
    const report = buildReport(payload)
    writeOutput(args.output, report, streams.stdout)
    return 0
  } catch (error) {
    streams.stderr.write(`[deploy-checklist-report] ERROR ${error.message}\n`)
    return 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main()
}
