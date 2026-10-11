// Gráficos SVG del flyer: banderas ondeando, íconos y adornos.

function waveY(x, W, amp, phase) {
  return amp * Math.sin((x / W) * Math.PI * 2 * 0.9 + phase)
}

function bandPath(W, y0, y1, amp, phase) {
  const top = []
  const bottom = []
  for (let x = 0; x <= W; x += 6) {
    top.push(`${x.toFixed(1)},${(y0 + waveY(x, W, amp, phase)).toFixed(1)}`)
    bottom.push(`${x.toFixed(1)},${(y1 + waveY(x, W, amp, phase)).toFixed(1)}`)
  }
  return `M${top.join(' L')} L${bottom.reverse().join(' L')} Z`
}

function starPoints(cx, cy, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 === 0 ? r : r * 0.42
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

/**
 * Bandera ondeando. stripes: [{ color, size }] (size relativo).
 * stars: dibuja el arco de 8 estrellas (Venezuela) en la franja central.
 */
export function WavyFlag({ id, stripes, stars = false, width = 300, height = 200, amp = 12, phase = 0, className, style }) {
  const W = width
  const usable = height - amp * 2 - 4
  const total = stripes.reduce((a, s) => a + s.size, 0)
  let y = amp + 2
  const bands = stripes.map((s) => {
    const h = (s.size / total) * usable
    const b = { color: s.color, y0: y, y1: y + h }
    y += h
    return b
  })
  const outline = bandPath(W, bands[0].y0, bands[bands.length - 1].y1, amp, phase)

  let starEls = null
  if (stars) {
    const mid = bands[1]
    const cx = W / 2
    const R = W * 0.2
    const baseY = mid.y1 - (mid.y1 - mid.y0) * 0.22
    starEls = Array.from({ length: 8 }, (_, i) => {
      const t = Math.PI * (0.88 - (i * 0.76) / 7)
      const sx = cx + R * Math.cos(t)
      const sy = baseY - R * 0.62 * Math.sin(t) + waveY(sx, W, amp, phase)
      return <polygon key={i} points={starPoints(sx, sy, (mid.y1 - mid.y0) * 0.13)} fill="#fff" />
    })
  }

  // brillo / sombra que acompaña la onda
  const stops = []
  for (let i = 0; i <= 10; i++) {
    const x = i / 10
    const s = Math.cos(x * Math.PI * 2 * 0.9 + phase)
    stops.push(
      <stop
        key={i}
        offset={`${x * 100}%`}
        stopColor={s > 0 ? '#ffffff' : '#000000'}
        stopOpacity={Math.abs(s) * (s > 0 ? 0.28 : 0.3)}
      />
    )
  }

  return (
    <svg className={className} style={style} viewBox={`0 0 ${W} ${height}`} width={W} height={height}>
      <defs>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0">
          {stops}
        </linearGradient>
      </defs>
      {bands.map((b, i) => (
        <path key={i} d={bandPath(W, b.y0 - 0.6, b.y1 + 0.6, amp, phase)} fill={b.color} />
      ))}
      {starEls}
      <path d={outline} fill={`url(#${id}-shade)`} />
    </svg>
  )
}

export const VE_STRIPES = [
  { color: '#ffcc00', size: 1 },
  { color: '#0a3fa8', size: 1 },
  { color: '#d81e2c', size: 1 },
]

export const CO_STRIPES = [
  { color: '#ffcd00', size: 2 },
  { color: '#0a3fa8', size: 1 },
  { color: '#d81e2c', size: 1 },
]

export function StopwatchIcon({ size = 64, color = '#0a1f5c' }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 96 64" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round">
      <line x1="4" y1="24" x2="24" y2="24" />
      <line x1="0" y1="36" x2="22" y2="36" />
      <line x1="8" y1="48" x2="26" y2="48" />
      <circle cx="60" cy="36" r="24" />
      <line x1="60" y1="36" x2="70" y2="26" />
      <line x1="54" y1="5" x2="66" y2="5" />
      <line x1="60" y1="5" x2="60" y2="12" />
      <line x1="80" y1="14" x2="85" y2="9" />
    </svg>
  )
}

export function ShieldIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#ffd21f" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M32 5 L54 13 V31 C54 45 44 54 32 59 C20 54 10 45 10 31 V13 Z" />
      <path d="M22 32 L29 39 L43 24" />
    </svg>
  )
}

export function BoltIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M37 4 L14 37 H30 L25 60 L50 25 H34 Z" fill="#ffd21f" />
    </svg>
  )
}

export function GlobeIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#ffd21f" strokeWidth="4">
      <circle cx="32" cy="32" r="25" />
      <ellipse cx="32" cy="32" rx="11" ry="25" />
      <line x1="7" y1="32" x2="57" y2="32" />
      <path d="M11 19 H53 M11 45 H53" />
    </svg>
  )
}

export function ChatPhoneIcon({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M50 10 C27 10 10 27 10 49 C10 57 12.5 64 16.5 70 L12 88 L31 83 C36.5 86 43 88 50 88 C73 88 90 71 90 49 C90 27 73 10 50 10 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 30 C34 30 31 32 31 37 C31 46 41 60 55 66 C61 68.5 65 66 66.5 63 C67.5 60.5 67 59 65 58 L58 54.5 C56.5 53.8 55 54.2 54 55.6 L52 58 C46 55 42 50 40 45 L42.4 42.6 C43.6 41.4 43.8 40 43.2 38.6 L40 32 C39.2 30.5 38 30 36 30 Z"
        fill="#fff"
      />
    </svg>
  )
}

export function HeartIcon({ size = 60, color = '#ffd21f' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M32 56 C14 42 6 33 6 22 C6 14 12 8 20 8 C26 8 30 12 32 16 C34 12 38 8 44 8 C52 8 58 14 58 22 C58 33 50 42 32 56 Z" fill={color} />
    </svg>
  )
}

export function CurvedArrow({ width = 120, height = 160, color = '#4fc3ff', className, style }) {
  return (
    <svg className={className} style={style} width={width} height={height} viewBox="0 0 120 160" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M95 150 C100 95 80 45 22 18" />
      <path d="M20 46 L20 16 L50 12" />
    </svg>
  )
}

export function Swoosh({ width = 300, color = '#ffd21f', thick = 7, className, style }) {
  return (
    <svg className={className} style={style} width={width} height={thick * 3} viewBox={`0 0 ${width} ${thick * 3}`}>
      <path
        d={`M${thick} ${thick * 2.2} Q ${width * 0.5} ${thick * 0.2} ${width - thick} ${thick * 1.1}`}
        fill="none"
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Sparks({ size = 90, color = '#ffd21f', className, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 90 90" stroke={color} strokeWidth="7" strokeLinecap="round">
      <line x1="10" y1="45" x2="40" y2="38" />
      <line x1="14" y1="16" x2="38" y2="30" />
      <line x1="40" y1="4" x2="48" y2="24" />
    </svg>
  )
}
