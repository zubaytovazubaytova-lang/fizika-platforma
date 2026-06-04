export default function AtomSVG({ size = 140 }) {
  const id = `atom-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`ng-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FF8800" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF8800" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Nucleus outer glow */}
      <circle
        cx="100" cy="100" r="30"
        fill={`url(#ng-${id})`}
        style={{ animation: 'nucleus-glow 2.5s ease-in-out infinite' }}
      />
      {/* Nucleus core */}
      <circle
        cx="100" cy="100" r="14"
        fill="url(#nucleus-grad)"
        style={{ filter: 'drop-shadow(0 0 8px #FF8800)' }}
      />
      <defs>
        <radialGradient id="nucleus-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FFD060" />
          <stop offset="100%" stopColor="#FF5500" />
        </radialGradient>
      </defs>

      {/* Orbit 1 — Cyan, 0° tilt, 3s */}
      <g style={{ transformOrigin: '100px 100px', animation: 'orbit-0 3s linear infinite' }}>
        <ellipse cx="100" cy="100" rx="82" ry="26"
          fill="none" stroke="#00BCD4" strokeWidth="1.4" opacity="0.75"
        />
        <circle cx="182" cy="100" r="5.5" fill="#00BCD4"
          style={{ filter: 'drop-shadow(0 0 4px #00BCD4)' }}
        />
      </g>

      {/* Orbit 2 — Purple, 60° tilt, 4.5s */}
      <g style={{ transformOrigin: '100px 100px', animation: 'orbit-60 4.5s linear infinite' }}>
        <ellipse cx="100" cy="100" rx="82" ry="26"
          fill="none" stroke="#A855F7" strokeWidth="1.4" opacity="0.75"
        />
        <circle cx="182" cy="100" r="5.5" fill="#A855F7"
          style={{ filter: 'drop-shadow(0 0 4px #A855F7)' }}
        />
      </g>

      {/* Orbit 3 — Gold, -60° tilt, 6s */}
      <g style={{ transformOrigin: '100px 100px', animation: 'orbit-neg60 6s linear infinite' }}>
        <ellipse cx="100" cy="100" rx="82" ry="26"
          fill="none" stroke="#FFB800" strokeWidth="1.4" opacity="0.75"
        />
        <circle cx="182" cy="100" r="5.5" fill="#FFB800"
          style={{ filter: 'drop-shadow(0 0 4px #FFB800)' }}
        />
      </g>
    </svg>
  )
}
