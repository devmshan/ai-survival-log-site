import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'devsurvivallog 소개와 운영 철학',
  alternates: {
    canonical: '/about',
  },
}

const philosophies = [
  {
    keyword: 'dev',
    subtitle: '나라는 사람을 개발하다',
    description: '능력, 습관, 마인드셋을 발전시켜 나가겠다.\n지금의 나는 초안이다.',
  },
  {
    keyword: 'debugging',
    subtitle: '문제 해결 능력',
    description: '인생에서 마주하는 버그를 회피하지 않고 스스로 해결하며\n더 견고한 사람이 되겠다.',
  },
  {
    keyword: 'update',
    subtitle: '지속적인 학습',
    description: '멈춰 있으면 deprecated된다.\n빠르게 변하는 환경에 발맞춰, 계속 배우며 달리겠다.',
  },
  {
    keyword: 'optimize',
    subtitle: '나답게 최적화하기',
    description: '빠르게 달리되, 나를 잃지 않겠다.\n효율을 추구하되, 내 향기는 유지하는 방식으로.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">devsurvivallog</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-10">
        개발자의 언어로 나를 정의하는 방식
      </p>

      <p className="text-neutral-700 dark:text-neutral-300 mb-10">
        솔직히 말하면, 나는 꽤 오래 나태했다.<br />
        그 언젠가가 더 이상 통하지 않는다는 걸 깨달은 순간, 이 블로그를 만들었다.
      </p>

      <div className="space-y-10">
        {philosophies.map(({ keyword, subtitle, description }) => (
          <div key={keyword}>
            <p className="text-2xl font-bold">{keyword}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-3">{subtitle}</p>
            <hr className="border-neutral-200 dark:border-neutral-700 mb-4" />
            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{description}</p>
          </div>
        ))}
      </div>

      <hr className="border-neutral-200 dark:border-neutral-700 my-10" />

      <p className="text-neutral-700 dark:text-neutral-300">
        AI로 빠르게 수렴하고, 나의 언어로 발산하는 공간.<br />
        <strong>지금부터 제대로 살겠다는 다짐의 기록이다.</strong>
      </p>
    </div>
  )
}
