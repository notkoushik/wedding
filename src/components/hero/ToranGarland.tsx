import React from 'react'

export function ToranGarland() {
  return (
    <div className="absolute top-0 inset-x-0 overflow-hidden pointer-events-none z-20 opacity-90">
      <svg
        viewBox="0 0 1440 76"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16"
      >
        <defs>
          <linearGradient id="toran-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9b7b1b" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#9b7b1b" />
          </linearGradient>
          <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e7d32" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="marigold-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="marigold-orange" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="coconut-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Golden connecting floral chords */}
        <path
          d="M 0 14 Q 120 32 240 14 Q 360 32 480 14 Q 600 32 720 14 Q 840 32 960 14 Q 1080 32 1200 14 Q 1320 32 1440 14"
          stroke="url(#toran-gold)"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Repeating Mango Leaves, Marigolds & Auspicious Telugu Coconuts */}
        {Array.from({ length: 13 }).map((_, i) => {
          const cx = i * 120
          return (
            <g key={i} transform={`translate(${cx}, 0)`}>
              {/* Mango leaf 1 */}
              <path
                d="M 45 18 Q 55 52 55 62 Q 55 52 65 18 Z"
                fill="url(#leaf-grad)"
                stroke="#c9a84c"
                strokeWidth="0.6"
              />
              <line x1="55" y1="18" x2="55" y2="58" stroke="#86efac" strokeWidth="0.5" opacity="0.6" />

              {/* Mango leaf 2 (overlapping pair) */}
              <path
                d="M 65 18 Q 75 50 75 60 Q 75 50 85 18 Z"
                fill="url(#leaf-grad)"
                stroke="#c9a84c"
                strokeWidth="0.6"
                opacity="0.9"
              />

              {/* Marigold flower 1 (Yellow) */}
              <circle cx="20" cy="20" r="8" fill="url(#marigold-yellow)" />
              <circle cx="20" cy="20" r="5" fill="url(#marigold-orange)" opacity="0.9" />
              <circle cx="20" cy="20" r="2" fill="#fff" />

              {/* Marigold flower 2 (Orange) */}
              <circle cx="100" cy="20" r="8" fill="url(#marigold-orange)" />
              <circle cx="100" cy="20" r="5" fill="url(#marigold-yellow)" opacity="0.9" />
              <circle cx="100" cy="20" r="2" fill="#ffd700" />

              {/* Auspicious Coconut (కొబ్బరికాయ) in the center every alternate arch */}
              {i % 2 === 0 ? (
                <g transform="translate(60, 58)">
                  <ellipse cx="0" cy="6" rx="5" ry="7" fill="url(#coconut-grad)" stroke="#ffd700" strokeWidth="0.6" />
                  <path d="M -3 3 Q 0 0 3 3" stroke="#ffd700" strokeWidth="0.5" fill="none" />
                  {/* Turmeric & Kumkuma dot */}
                  <circle cx="0" cy="6" r="1.5" fill="#e52d27" />
                </g>
              ) : (
                <g transform="translate(60, 60)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#ffd700" strokeWidth="1.2" />
                  <circle cx="0" cy="8" r="2.5" fill="#ffd700" />
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
