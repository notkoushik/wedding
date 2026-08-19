import React from 'react'

interface GoldDividerProps {
  light?: boolean
  className?: string
}

export function GoldDivider({ light = false, className = '' }: GoldDividerProps) {
  const c = light ? '#E8C97A' : '#C9A84C'
  return (
    <div className={`flex items-center justify-center my-6 gap-2 px-2 ${className}`}>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${c}bb, ${c})` }}
      />
      <svg width="72" height="24" viewBox="0 0 72 24" fill="none">
        <circle cx="36" cy="12" r="4.5" fill={c} opacity="0.95" />
        <circle cx="36" cy="12" r="8" stroke={c} strokeWidth="0.75" opacity="0.4" strokeDasharray="2 2" />
        <polygon points="18,12 25,6 31,12 25,18" fill={c} opacity="0.45" />
        <polygon points="41,12 47,6 54,12 47,18" fill={c} opacity="0.45" />
        <line x1="0" y1="12" x2="14" y2="12" stroke={c} strokeWidth="1" opacity="0.6" />
        <line x1="58" y1="12" x2="72" y2="12" stroke={c} strokeWidth="1" opacity="0.6" />
      </svg>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(to left, transparent, ${c}bb, ${c})` }}
      />
    </div>
  )
}

export function GoldStrip({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-[3px] w-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, #9b7b1b 15%, #ffd700 35%, #e8c97a 50%, #ffd700 65%, #9b7b1b 85%, transparent 100%)',
      }}
    />
  )
}

export function SectionLabel({
  title,
  sub,
  light = false,
}: {
  title: string
  sub?: string
  light?: boolean
}) {
  return (
    <div className="text-center mb-10 md:mb-14">
      {sub && (
        <p
          className={`font-display italic text-xs uppercase tracking-[0.38em] mb-2.5 ${
            light ? 'text-gold-light/80' : 'text-gold-dark font-medium'
          }`}
        >
          {sub}
        </p>
      )}
      <h2
        className={`font-display font-semibold tracking-wide ${
          light ? 'text-ivory' : 'text-crimson-dark'
        }`}
        style={{ fontSize: 'clamp(1.85rem, 5vw, 3.2rem)' }}
      >
        {title}
      </h2>
      <GoldDivider light={light} />
    </div>
  )
}
