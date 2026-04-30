import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagFilter } from '../TagFilter'

const tags = [
  'AI',
  'agent-harness',
  'automation',
  'codex',
  'developer',
  'graphify',
  'llm',
  'study',
  'workflow',
]

describe('TagFilter', () => {
  it('대표 태그만 먼저 노출한다', () => {
    render(<TagFilter tags={tags} />)

    const featuredTags = screen.getByRole('group', { name: '대표 태그' })
    expect(within(featuredTags).getByRole('link', { name: '전체' })).toHaveAttribute('href', '/')
    expect(within(featuredTags).getByRole('link', { name: 'codex' })).toHaveAttribute('href', '/tags/codex')
    expect(within(featuredTags).queryByRole('link', { name: 'graphify' })).not.toBeInTheDocument()
  })

  it('선택된 비대표 태그를 현재 태그로 노출한다', () => {
    render(<TagFilter tags={tags} selectedTag="graphify" />)

    expect(screen.getByText('현재 태그')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'graphify' })[0]).toHaveAttribute('aria-current', 'page')
  })

  it('전체 태그를 검색한다', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={tags} />)

    await user.click(screen.getByText('태그 찾기'))
    await user.type(screen.getByRole('searchbox', { name: '태그 검색' }), 'graph')

    const allTags = screen.getByRole('group', { name: '전체 태그' })
    expect(within(allTags).getByRole('link', { name: 'graphify' })).toHaveAttribute('href', '/tags/graphify')
    expect(within(allTags).queryByRole('link', { name: 'automation' })).not.toBeInTheDocument()
  })

  it('검색 결과가 없으면 빈 상태를 표시한다', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={tags} />)

    await user.click(screen.getByText('태그 찾기'))
    await user.type(screen.getByRole('searchbox', { name: '태그 검색' }), 'no-match')

    expect(screen.getByText('일치하는 태그가 없습니다.')).toBeInTheDocument()
  })
})
