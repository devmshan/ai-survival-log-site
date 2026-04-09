import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          안녕하세요. 이 블로그는 개인 개발 기록과 AI 학습 내용을 정리하는 공간입니다.
        </p>
        <h2>주요 주제</h2>
        <ul>
          <li>AI / LLM 학습 정리</li>
          <li>Claude Code 활용</li>
          <li>개발 일지</li>
        </ul>
      </div>
    </div>
  )
}
