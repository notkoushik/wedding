import React from 'react'
import { weddingData } from '../../data/weddingData'

export function DigitalTeluguCard() {
  const { couple, parents, muhurtham, venues } = weddingData
  const weddingVenue = venues[0]
  const receptionVenue = venues[1]

  return (
    <svg
      viewBox="0 0 380 580"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      style={{
        filter:
          'drop-shadow(0 20px 50px rgba(92,10,10,0.22)) drop-shadow(0 4px 16px rgba(201,168,76,0.12))',
      }}
    >
      <defs>
        <pattern id="te2-fan" x="0" y="0" width="20" height="15" patternUnits="userSpaceOnUse">
          <path d="M-1 15 Q0 3 10 3 Q20 3 21 15" fill="none" stroke="#9b7b1b" strokeWidth="0.5" opacity="0.14" />
          <circle cx="10" cy="3" r="0.6" fill="#9b7b1b" opacity="0.18" />
        </pattern>
        <linearGradient id="te2-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b7b1b" />
          <stop offset="35%" stopColor="#ffd700" />
          <stop offset="70%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#9b7b1b" />
        </linearGradient>
        <radialGradient id="te2-dot" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff2a6" />
          <stop offset="100%" stopColor="#9b7b1b" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="380" height="580" fill="#FFFCF0" rx="10" />
      <rect width="380" height="580" fill="url(#te2-fan)" rx="10" />

      {/* Triple Ornate Border */}
      <rect x="6" y="6" width="368" height="568" fill="none" stroke="url(#te2-gold)" strokeWidth="2.5" rx="9" />
      <rect x="11" y="11" width="358" height="558" fill="none" stroke="#8B1A1A" strokeWidth="0.75" opacity="0.45" rx="8" />
      <rect x="16" y="16" width="348" height="548" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.3" rx="7" />

      {/* Corner Ornaments */}
      {([[26, 26], [354, 26], [26, 554], [354, 554]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5" />
          <circle cx={cx} cy={cy} r="2.2" fill="url(#te2-dot)" />
        </g>
      ))}

      {/* Diya icons flanking header */}
      <g>
        <path d="M 44 46 Q 44 40 51 40 Q 58 40 58 46 Q 59.5 50 51 51 Q 42.5 50 44 46 Z" fill="none" stroke="#C9A84C" strokeWidth="1" />
        <path d="M 51 40 Q 49 33 51 29 Q 53 33 51 40 Z" fill="#e52d27" opacity="0.8" />
      </g>
      <g>
        <path d="M 322 46 Q 322 40 329 40 Q 336 40 336 46 Q 337.5 50 329 51 Q 320.5 50 322 46 Z" fill="none" stroke="#C9A84C" strokeWidth="1" />
        <path d="M 329 40 Q 327 33 329 29 Q 331 33 329 40 Z" fill="#e52d27" opacity="0.8" />
      </g>

      {/* Top Blessing Text */}
      <text x="190" y="46" textAnchor="middle" fontSize="10" fill="#9b7b1b" opacity="0.9" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold" letterSpacing="1.5">
        {couple.sanskritHeaderTe.replace(/\|\|/g, '').trim()}
      </text>
      <line x1="30" y1="56" x2="350" y2="56" stroke="#8B1A1A" strokeWidth="0.6" opacity="0.35" strokeDasharray="2.5 2" />

      {/* Sita Rama Shloka */}
      <text x="190" y="74" textAnchor="middle" fontSize="8" fill="#7a4a4a" opacity="0.8" fontFamily="'Noto Serif Telugu',serif">
        శ్రీ॰ శ్రీరామపత్నీ జనకస్య పుత్రి సీతాంగనా సుందర కోమలాంగి
      </text>
      <text x="190" y="88" textAnchor="middle" fontSize="8" fill="#7a4a4a" opacity="0.8" fontFamily="'Noto Serif Telugu',serif">
        భూగర్భజాతా భువనైకమాతా వధూ వరాభ్యాం వరదా భవంతు॥
      </text>

      {/* Main Telugu Title */}
      <text x="190" y="124" textAnchor="middle" fontSize="22" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">
        {couple.familyHeaderTe}
      </text>

      {/* Parents Blessing & Invitation Note */}
      {parents.ancestorsTe && (
        <text x="190" y="148" textAnchor="middle" fontSize="8.5" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
          {parents.ancestorsTe}
        </text>
      )}

      <text x="190" y="170" textAnchor="middle" fontSize="12" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">
        {parents.groomParentsTe}
      </text>
      <text x="190" y="188" textAnchor="middle" fontSize="10.5" fill="#5c0a0a" fontFamily="'Noto Serif Telugu',serif" fontWeight="600">
        వ్రాయు శుభలేఖార్ధములు
      </text>
      <text x="190" y="206" textAnchor="middle" fontSize="9.5" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
        మా ఏకైక పుత్రుడు
      </text>

      {/* Groom Section */}
      <line x1="60" y1="216" x2="320" y2="216" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      <text x="190" y="232" textAnchor="middle" fontSize="9.5" fill="#9b7b1b" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold">
        {couple.groom.titleTe}
      </text>
      <text x="190" y="258" textAnchor="middle" fontSize="26" fill="#8B1A1A" fontFamily="'Great Vibes',cursive">
        {couple.groom.nameEn}
      </text>
      <text x="190" y="278" textAnchor="middle" fontSize="14" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">
        {couple.groom.nameTe}
      </text>
      <text x="190" y="294" textAnchor="middle" fontSize="9" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">కు</text>

      {/* Bride Section */}
      <line x1="60" y1="304" x2="320" y2="304" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
      <text x="190" y="320" textAnchor="middle" fontSize="9.5" fill="#9b7b1b" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold">
        {couple.bride.titleTe}
      </text>
      <text x="190" y="346" textAnchor="middle" fontSize="28" fill="#8B1A1A" fontFamily="'Great Vibes',cursive">
        {couple.bride.nameEn}
      </text>
      <text x="190" y="366" textAnchor="middle" fontSize="14" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">
        {couple.bride.nameTe}
      </text>
      <text x="190" y="382" textAnchor="middle" fontSize="8.5" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
        {couple.bride.parentDetailsTe}
      </text>

      <line x1="30" y1="394" x2="350" y2="394" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" strokeDasharray="4 3" />

      {/* Sumuhurtham Box */}
      <rect x="25" y="405" width="330" height="72" fill="rgba(201,168,76,0.08)" stroke="#C9A84C" strokeWidth="0.6" rx="6" />
      <text x="40" y="424" fontSize="11" fill="#5c0a0a" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">సుముహూర్తం :</text>
      <text x="40" y="440" fontSize="8.5" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
        {muhurtham.thithiTe}
      </text>
      <text x="40" y="455" fontSize="9" fill="#8B1A1A" fontFamily="'Noto Serif Telugu',serif" fontWeight="bold">
        {muhurtham.dateStringTe} {muhurtham.timeStringTe}
      </text>
      <text x="40" y="470" fontSize="8.5" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
        {muhurtham.nakshatramTe}, {muhurtham.lagnamTe}
      </text>

      {/* Venues Box */}
      <rect x="25" y="484" width="330" height="78" fill="rgba(139,26,26,0.04)" stroke="#C9A84C" strokeWidth="0.6" rx="6" />
      {weddingVenue && (
        <>
          <text x="40" y="502" fontSize="10.5" fill="#5c0a0a" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">{weddingVenue.typeTelugu}:</text>
          <text x="40" y="517" fontSize="8.2" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
            {weddingVenue.name}, {weddingVenue.landmark}
          </text>
        </>
      )}
      {receptionVenue && (
        <>
          <text x="40" y="534" fontSize="10.5" fill="#5c0a0a" fontFamily="'Noto Serif Telugu',serif" fontWeight="700">{receptionVenue.typeTelugu}:</text>
          <text x="40" y="549" fontSize="8.2" fill="#7a4a4a" fontFamily="'Noto Serif Telugu',serif">
            {receptionVenue.date} · {receptionVenue.name}, {receptionVenue.city}
          </text>
        </>
      )}

      <line x1="30" y1="570" x2="350" y2="570" stroke="#C9A84C" strokeWidth="0.4" opacity="0.3" />
    </svg>
  )
}
