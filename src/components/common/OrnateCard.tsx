import React from 'react'

interface OrnateCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'ivory' | 'crimson'
}

export function OrnateCard({
  children,
  className = '',
  variant = 'ivory',
}: OrnateCardProps) {
  const isCrimson = variant === 'crimson'

  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 ${
        isCrimson
          ? 'glass-crimson text-ivory'
          : 'bg-ivory text-[#1c0a0a] ornate-border'
      } ${className}`}
    >
      {/* Corner Filigree Accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold opacity-60 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold opacity-60 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold opacity-60 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold opacity-60 rounded-br-sm pointer-events-none" />

      {/* Tiny corner dots */}
      <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-gold opacity-80 pointer-events-none" />
      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-gold opacity-80 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-gold opacity-80 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-gold opacity-80 pointer-events-none" />

      {children}
    </div>
  )
}
