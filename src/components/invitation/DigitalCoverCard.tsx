import React from 'react'
import { weddingData } from '../../data/weddingData'

export function DigitalCoverCard() {
  const { compliments } = weddingData

  return (
    <svg
      viewBox="0 0 380 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      style={{
        filter:
          'drop-shadow(0 20px 50px rgba(92,10,10,0.25)) drop-shadow(0 4px 16px rgba(201,168,76,0.15))',
      }}
    >
      <defs>
        <pattern id="cv2-fan" x="0" y="0" width="20" height="15" patternUnits="userSpaceOnUse">
          <path d="M-1 15 Q0 3 10 3 Q20 3 21 15" fill="none" stroke="#9b7b1b" strokeWidth="0.5" opacity="0.15" />
          <line x1="10" y1="3" x2="10" y2="15" stroke="#9b7b1b" strokeWidth="0.25" opacity="0.09" />
          <circle cx="10" cy="3" r="0.65" fill="#9b7b1b" opacity="0.18" />
        </pattern>
        <pattern id="cv2-dmd" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="none" stroke="#C9A84C" strokeWidth="0.45" opacity="0.4" />
          <circle cx="8" cy="8" r="0.9" fill="#C9A84C" opacity="0.25" />
        </pattern>
        <clipPath id="cv2-oval">
          <ellipse cx="190" cy="150" rx="118" ry="86" />
        </clipPath>
        <linearGradient id="cv2-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b7b1b" />
          <stop offset="30%" stopColor="#ffd700" />
          <stop offset="65%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#9b7b1b" />
        </linearGradient>
        <linearGradient id="cv2-tower" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#9b7b1b" />
        </linearGradient>
        <radialGradient id="cv2-dot" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff2a6" />
          <stop offset="100%" stopColor="#9b7b1b" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="380" height="520" fill="#FEFBF0" rx="10" />
      <rect width="380" height="520" fill="url(#cv2-fan)" rx="10" />

      {/* Triple Ornate Border */}
      <rect x="6" y="6" width="368" height="508" fill="none" stroke="url(#cv2-gold)" strokeWidth="2.5" rx="9" />
      <rect x="11" y="11" width="358" height="498" fill="none" stroke="#8B1A1A" strokeWidth="0.75" opacity="0.5" rx="8" />
      <rect x="16" y="16" width="348" height="488" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.3" rx="7" />

      {/* Corner Ornaments */}
      {([[26, 26], [354, 26], [26, 494], [354, 494]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
          <ellipse cx={cx} cy={cy - 5.5} rx="2.2" ry="4.2" fill="#C9A84C" opacity="0.45" />
          <ellipse cx={cx} cy={cy + 5.5} rx="2.2" ry="4.2" fill="#C9A84C" opacity="0.45" />
          <ellipse cx={cx - 5.5} cy={cy} rx="4.2" ry="2.2" fill="#C9A84C" opacity="0.45" />
          <ellipse cx={cx + 5.5} cy={cy} rx="4.2" ry="2.2" fill="#C9A84C" opacity="0.45" />
          <circle cx={cx} cy={cy} r="2.2" fill="url(#cv2-dot)" />
        </g>
      ))}

      {/* Top Auspicious Header */}
      <text x="62" y="44" fontSize="9.5" fill="#9b7b1b" opacity="0.75" fontFamily="'Playfair Display',serif" fontStyle="italic" letterSpacing="1.2">Srirasthu</text>
      <text x="190" y="44" textAnchor="middle" fontSize="9.5" fill="#9b7b1b" opacity="0.75" fontFamily="'Playfair Display',serif" fontStyle="italic" letterSpacing="1.2">Subhamasthu</text>
      <text x="318" y="44" textAnchor="end" fontSize="9.5" fill="#9b7b1b" opacity="0.75" fontFamily="'Playfair Display',serif" fontStyle="italic" letterSpacing="1.2">Avighnamasthu</text>
      <line x1="30" y1="51" x2="350" y2="51" stroke="#8B1A1A" strokeWidth="0.55" opacity="0.3" strokeDasharray="2.5 2" />

      {/* Scrollwork framing oval */}
      <path d="M 22 128 Q 45 88 74 104 Q 96 116 116 94 Q 132 76 150 90" fill="none" stroke="url(#cv2-gold)" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
      <path d="M 358 128 Q 335 88 306 104 Q 284 116 264 94 Q 248 76 230 90" fill="none" stroke="url(#cv2-gold)" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />

      {/* Oval Medallion */}
      <ellipse cx="190" cy="150" rx="118" ry="86" fill="#FEFBF0" />
      <rect x="72" y="64" width="236" height="172" fill="url(#cv2-dmd)" clipPath="url(#cv2-oval)" />
      <ellipse cx="190" cy="150" rx="118" ry="86" fill="none" stroke="url(#cv2-gold)" strokeWidth="3" />
      <ellipse cx="190" cy="150" rx="106" ry="75" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />

      {/* Diamond frame inside oval */}
      <polygon points="190,70 256,150 190,230 124,150" fill="white" fillOpacity="0.9" stroke="url(#cv2-gold)" strokeWidth="1.8" />

      {/* 8-petal Lotus Mandala */}
      {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180
        const ex = 190 + 21 * Math.cos(r)
        const ey = 150 + 21 * Math.sin(r)
        return (
          <ellipse
            key={i}
            cx={ex}
            cy={ey}
            rx="7"
            ry="20"
            transform={`rotate(${deg}, ${ex}, ${ey})`}
            fill="#C9A84C"
            fillOpacity="0.2"
            stroke="#C9A84C"
            strokeWidth="0.6"
            opacity="0.65"
          />
        )
      })}

      {/* Central Om */}
      <circle cx="190" cy="150" r="21" fill="#FEFBF0" stroke="url(#cv2-gold)" strokeWidth="1.5" />
      <text x="190" y="157" textAnchor="middle" fontSize="22" fill="#9b7b1b" fontFamily="serif" fontWeight="bold" opacity="0.95">ॐ</text>

      {/* Gopuram Tower */}
      {([[148, 272, 84, 11], [154, 261, 72, 11], [160, 250, 60, 11], [166, 239, 48, 11], [172, 228, 36, 11], [178, 217, 24, 11], [184, 206, 12, 11]] as [number, number, number, number][]).map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={`rgba(201,168,76,${0.18 + i * 0.08})`} stroke="url(#cv2-gold)" strokeWidth="0.6" rx="1.5" />
        </g>
      ))}
      <ellipse cx="190" cy="205" rx="7.5" ry="4.5" fill="url(#cv2-tower)" />
      <circle cx="190" cy="200" r="5.5" fill="url(#cv2-dot)" />

      {/* Namam Symbol */}
      <path d="M 183.5 284 L 183.5 300 Q 183.5 308 190 308 Q 196.5 308 196.5 300 L 196.5 284" fill="none" stroke="#8B1A1A" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="190" y1="286" x2="190" y2="308" stroke="#8B1A1A" strokeWidth="1.6" />

      {/* Temple Arch */}
      <path d="M 52 516 L 52 372 Q 52 310 190 304 Q 328 310 328 372 L 328 516" fill="none" stroke="url(#cv2-gold)" strokeWidth="2.8" />
      <path d="M 68 516 L 68 376 Q 68 322 190 316 Q 312 322 312 376 L 312 516" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.35" />

      {/* Divine Venkateswara & Padmavathi Icons */}
      <g>
        <circle cx="110" cy="418" r="38" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
        <path d="M 94 376 L 97 364 L 102 373 L 107 360 L 110 370 L 113 360 L 118 373 L 123 364 L 126 376" fill="none" stroke="url(#cv2-gold)" strokeWidth="1.6" strokeLinejoin="round" />
        <text x="110" y="424" textAnchor="middle" fontSize="9" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold">శ్రీ లక్ష్మీ</text>
      </g>
      <g>
        <circle cx="270" cy="418" r="38" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
        <rect x="258" y="357" width="24" height="20" fill="none" stroke="url(#cv2-gold)" strokeWidth="1.2" rx="2" />
        <text x="270" y="424" textAnchor="middle" fontSize="9" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold">శ్రీ వేంకటేశ</text>
      </g>

      {/* Footer Text */}
      <text x="190" y="508" textAnchor="middle" fontSize="7.5" fill="#9b7b1b" opacity="0.75" fontFamily="'Playfair Display',serif" fontStyle="italic" letterSpacing="2">
        {compliments.en.toUpperCase()}
      </text>
    </svg>
  )
}
