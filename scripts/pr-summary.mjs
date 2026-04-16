#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

const CATEGORY_RULES = [
  { name: 'content', match: file => file.startsWith('content/posts/') },
  { name: 'wiki-contract', match: file => file === 'docs/content-contract.md' },
  { name: 'api', match: file => file.startsWith('src/app/api/') },
  { name: 'ui', match: file => file.startsWith('src/components/') || file.startsWith('src/app/') },
  { name: 'data-loading', match: file => file.startsWith('src/lib/') },
  { name: 'test', match: file => file.includes('/__tests__/') || file.endsWith('.test.ts') || file.endsWith('.test.tsx') },
  { name: 'build-ci', match: file => file.startsWith('.github/') || file.startsWith('scripts/') || file === 'package.json' || file === 'package-lock.json' },
  { name: 'docs', match: file => file.startsWith('docs/') || file === 'README.md' || file === 'AGENTS.md' || file === 'CLAUDE.md' },
]

const REVIEW_QUESTIONS = [
  '이 변경이 기존 contract를 깨는 경로가 있는가',
  '런타임 코드가 바뀌었는데 테스트 커버리지가 따라왔는가',
  '데이터/파싱/정렬 로직 변경으로 숨은 회귀가 생길 수 있는가',
  '문서와 실제 동작이 어긋나는 부분이 있는가',
  '배포 전에 추가로 확인해야 할 수동 검증이 있는가',
]

function parseArgs(argv) {
  const args = { files: [], output: '' }

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i]
    const next = argv[i + 1]

    if (current === '--base' && next) {
      args.base = next
      i += 1
      continue
    }
    if (current === '--head' && next) {
      args.head = next
      i += 1
      continue
    }
    if (current === '--files' && next) {
      args.files = next.split(',').map(item => item.trim()).filter(Boolean)
      i += 1
      continue
    }
    if (current === '--output' && next) {
      args.output = next
      i += 1
    }
  }

  return args
}

function getChangedFiles(args) {
  if (args.files.length > 0) return args.files

  if (args.base && args.head) {
    const output = execFileSync('git', ['diff', '--name-only', `${args.base}...${args.head}`], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim()

    return output ? output.split('\n').map(line => line.trim()).filter(Boolean) : []
  }

  const output = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
  }).trim()

  if (!output) return []

  return output
    .split('\n')
    .map(line => line.slice(3).trim())
    .filter(Boolean)
}

function categorize(files) {
  const categories = new Set()

  for (const file of files) {
    for (const rule of CATEGORY_RULES) {
      if (rule.match(file)) categories.add(rule.name)
    }
  }

  return [...categories]
}

function hasRuntimeChanges(categories) {
  return ['api', 'ui', 'data-loading'].some(category => categories.includes(category))
}

function inferRisk(categories) {
  if (categories.includes('api') || categories.includes('wiki-contract')) return 'high'
  if (categories.includes('build-ci')) return 'high'
  if (categories.length >= 4 && hasRuntimeChanges(categories)) return 'high'
  if (categories.includes('ui') || categories.includes('data-loading')) return 'medium'
  if (categories.every(category => ['docs', 'content', 'test'].includes(category))) return 'low'
  return 'medium'
}

function summarize(files, categories) {
  if (files.length === 0) return '변경 파일을 찾지 못해 요약을 생성하지 못함'
  if (categories.includes('api') && categories.includes('ui')) return 'API 경로와 화면/컴포넌트 로직을 함께 수정'
  if (categories.includes('data-loading') && categories.includes('ui')) return '데이터 로딩과 화면 렌더링 경로를 함께 수정'
  if (categories.includes('content') && files.length === 1) return '단일 포스트 콘텐츠 수정'
  if (categories.includes('content') && categories.includes('docs')) return '콘텐츠와 문서를 함께 수정'
  if (categories.includes('build-ci')) return 'CI 또는 자동화 스크립트 경로 수정'
  if (categories.includes('docs')) return '운영/설계 문서 수정'
  return `${files.length}개 파일 변경`
}

function buildTestImpact(categories) {
  const lines = []
  const touchedTests = categories.includes('test')
  const runtimeChanged = hasRuntimeChanges(categories)
  const contentOnly = categories.length > 0 && categories.every(category => ['content', 'docs'].includes(category))

  if (runtimeChanged) lines.push('런타임 코드 변경 있음')
  if (touchedTests) {
    lines.push('테스트 파일도 함께 변경됨')
  } else if (runtimeChanged) {
    lines.push('런타임 코드 변경 대비 테스트 파일 변경은 보이지 않음')
  }
  if (categories.includes('content')) lines.push('content/frontmatter contract 확인 필요')

  const checks = []
  if (runtimeChanged || categories.includes('build-ci')) checks.push('npm test', 'npm run build')
  if (categories.includes('content') || categories.includes('wiki-contract')) checks.push('node scripts/verify-content-contract.mjs --all')
  if (!contentOnly) checks.unshift('npm run lint')

  if (checks.length > 0) lines.push(`확인 권장: ${[...new Set(checks)].join(', ')}`)

  return lines
}

function buildReviewPoints(files, categories) {
  const points = []

  if (categories.includes('data-loading')) {
    points.push('post parsing/search/static params 변경이 있으면 숨은 회귀 여부 우선 확인')
  }
  if (categories.includes('ui')) {
    points.push('페이지 렌더링과 네비게이션 흐름에서 기존 화면이 깨지지 않는지 확인')
  }
  if (categories.includes('api')) {
    points.push('응답 계약, 실패 케이스, env 의존성 변경 여부 확인')
  }
  if (categories.includes('content')) {
    points.push('frontmatter 필수값과 draft/series 규칙 위반 여부 확인')
  }
  if (categories.includes('build-ci')) {
    points.push('workflow/script 변경으로 CI 실패 처리나 검증 순서가 바뀌지 않았는지 확인')
  }
  if (categories.includes('docs') && !hasRuntimeChanges(categories)) {
    points.push('문서 내용이 현재 동작과 실제 계약을 정확히 설명하는지 확인')
  }

  if (files.some(file => file === 'src/lib/posts.ts')) {
    points.push('post metadata 파싱 변경이 목록/상세/시리즈 화면에 모두 영향을 주는지 확인')
  }
  if (files.some(file => file.startsWith('src/app/api/newsletter/'))) {
    points.push('newsletter route 변경 시 실패 응답과 폼 처리 흐름 회귀 여부 확인')
  }
  if (files.some(file => file.startsWith('src/app/api/views/'))) {
    points.push('view count route 변경 시 slug 처리와 중복 집계 위험 여부 확인')
  }

  return points.length > 0 ? points : ['변경 파일 기준으로 우선 확인 포인트를 추가 정의할 필요가 있음']
}

function selectQuestions(categories) {
  const selected = []

  selected.push(REVIEW_QUESTIONS[0])
  if (hasRuntimeChanges(categories)) selected.push(REVIEW_QUESTIONS[1])
  if (categories.includes('data-loading')) selected.push(REVIEW_QUESTIONS[2])
  if (categories.includes('docs') || categories.includes('wiki-contract')) selected.push(REVIEW_QUESTIONS[3])
  selected.push(REVIEW_QUESTIONS[4])

  return [...new Set(selected)].slice(0, 5)
}

function toMarkdown({ files, summary, categories, risk, testImpact, reviewPoints, questions }) {
  const filePreview = files.slice(0, 10).map(file => `- \`${file}\``)
  if (files.length > 10) filePreview.push(`- 외 ${files.length - 10}개 파일`)

  return [
    '## PR Summary',
    '',
    `- 요약: ${summary}`,
    `- 범주: ${categories.join(', ') || 'unclassified'}`,
    `- 위험도: ${risk}`,
    '',
    '## Changed Files',
    '',
    ...filePreview,
    '',
    '## Test Impact',
    '',
    ...testImpact.map(line => `- ${line}`),
    '',
    '## Review Points',
    '',
    ...reviewPoints.map(line => `- ${line}`),
    '',
    '## Reviewer Questions',
    '',
    ...questions.map(line => `- ${line}`),
    '',
  ].join('\n')
}

function main() {
  const args = parseArgs(process.argv)
  const files = getChangedFiles(args)
  const categories = categorize(files)
  const summary = summarize(files, categories)
  const risk = inferRisk(categories)
  const testImpact = buildTestImpact(categories)
  const reviewPoints = buildReviewPoints(files, categories)
  const questions = selectQuestions(categories)
  const markdown = toMarkdown({ files, summary, categories, risk, testImpact, reviewPoints, questions })

  if (args.output) {
    fs.writeFileSync(args.output, markdown)
  } else {
    process.stdout.write(markdown)
  }
}

main()
