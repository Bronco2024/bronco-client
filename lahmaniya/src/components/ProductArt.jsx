export function ProductArt({ type, className = '' }) {
  const common = {
    viewBox: '0 0 160 120',
    className: `product-art ${className}`,
    'aria-hidden': true,
  }

  if (type?.startsWith('mort')) {
    const tone =
      type === 'mort-smoked' ? '#8b4518' : type === 'mort-pepper' ? '#6b2d2d' : '#c45c4a'
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={`m-${type}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tone} />
            <stop offset="100%" stopColor="#3f1d1a" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="98" rx="48" ry="10" fill="rgba(18,33,30,0.12)" />
        <rect x="42" y="28" width="76" height="58" rx="12" fill={`url(#m-${type})`} />
        <rect x="50" y="36" width="60" height="14" rx="4" fill="rgba(255,255,255,0.18)" />
        {type === 'mort-pepper' &&
          [0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={58 + i * 11}
              cy={72}
              r="2.2"
              fill="#1a1a1a"
              opacity="0.7"
            />
          ))}
        {type === 'mort-smoked' && (
          <path
            d="M55 55c8-10 42-10 50 0"
            stroke="rgba(255,220,180,0.35)"
            strokeWidth="3"
            fill="none"
          />
        )}
      </svg>
    )
  }

  if (type === 'combo') {
    return (
      <svg {...common}>
        <ellipse cx="80" cy="100" rx="52" ry="10" fill="rgba(18,33,30,0.12)" />
        <ellipse cx="58" cy="70" rx="28" ry="18" fill="#f3e6c8" />
        <ellipse cx="58" cy="66" rx="22" ry="12" fill="#e8d4a8" />
        <rect x="88" y="48" width="42" height="34" rx="8" fill="#c45c4a" />
        <circle cx="109" cy="65" r="8" fill="rgba(255,255,255,0.2)" />
      </svg>
    )
  }

  const seed = type === 'roll-sesame'
  const whole = type === 'roll-whole'
  const top = whole ? '#c4a882' : '#f3e6c8'
  const mid = whole ? '#a8895f' : '#e8d4a8'

  return (
    <svg {...common}>
      <ellipse cx="80" cy="98" rx="48" ry="10" fill="rgba(18,33,30,0.12)" />
      <ellipse cx="80" cy="72" rx="46" ry="26" fill={top} />
      <ellipse cx="80" cy="66" rx="38" ry="18" fill={mid} />
      <path
        d="M50 66c10-12 50-12 60 0"
        stroke="#c4a574"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {seed &&
        [
          [62, 58],
          [74, 52],
          [88, 54],
          [98, 60],
          [70, 64],
          [90, 66],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="3" ry="1.6" fill="#8a6a3a" transform={`rotate(-25 ${x} ${y})`} />
        ))}
    </svg>
  )
}
