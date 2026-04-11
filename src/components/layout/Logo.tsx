const MONOSPACE = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace"
const ICON_SIZE = 16
const FONT_SIZE = 28
const BASELINE = FONT_SIZE + 2

function TerminalIcon({ x, y, size }: { x: number; y: number; size: number }) {
  const sw = size * 0.12
  return (
    <>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.18} fill="currentColor" />
      <polyline
        points={`${x + size * 0.25},${y + size * 0.3} ${x + size * 0.62},${y + size * 0.5} ${x + size * 0.25},${y + size * 0.7}`}
        style={{ stroke: 'var(--background)' }}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1={x + size * 0.63} y1={y + size * 0.7}
        x2={x + size * 0.85} y2={y + size * 0.7}
        style={{ stroke: 'var(--background)' }}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </>
  )
}

export function Logo() {
  return (
    <svg
      width="420"
      height={BASELINE + 12}
      viewBox={`0 0 420 ${BASELINE + 12}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="devsurvivallog"
    >
      <TerminalIcon x={0} y={14} size={ICON_SIZE} />
      <text
        x={ICON_SIZE + 2}
        y={BASELINE}
        fontFamily={MONOSPACE}
        fontSize={FONT_SIZE}
        fontWeight="800"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        devsurvivallog
      </text>
    </svg>
  )
}
