import React from 'react'
import { GoldDivider, GoldStrip } from './GoldDivider'
import { weddingData } from '../../data/weddingData'

export function Footer() {
  const { couple, muhurtham, parents, compliments } = weddingData

  return (
    <footer
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 50%, #3d0808 0%, #220303 80%, #150202 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-7">
        {/* Om Sacred Emblem */}
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              border: '1.5px solid rgba(201,168,76,0.6)',
              background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(61,8,8,0.9) 70%)',
            }}
          >
            <span className="text-gold-light text-4xl" style={{ fontFamily: 'serif', lineHeight: 1 }}>
              ॐ
            </span>
          </div>
        </div>

        <GoldDivider light />

        {/* Couple Names */}
        <div className="space-y-1">
          <h2
            className="font-calligraphy text-white leading-none font-bold shimmer-gold"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
              textShadow: '0 2px 20px rgba(201,168,76,0.4)',
            }}
          >
            {couple.namesCombinedEn}
          </h2>
          <p className="font-display italic text-gold-light/75 text-xs tracking-wider">
            {muhurtham.dateStringEn} · {muhurtham.timeStringEn}
          </p>
        </div>

        <GoldDivider light />

        {/* Family Blessings */}
        <div className="space-y-2 max-w-lg mx-auto">
          <p className="font-telugu text-gold-light/90 text-sm md:text-base leading-loose font-medium">
            {compliments.te}
          </p>
          <p className="font-display italic text-parchment/65 text-xs">
            {compliments.en}
          </p>
        </div>

        <GoldDivider light />

        {/* Parents Note */}
        <div className="space-y-1">
          <p className="font-display font-semibold text-gold-light text-sm sm:text-base">
            {parents.groomParentsEn}
          </p>
          <p className="font-display italic text-parchment/50 text-xs">
            {parents.groomParentsCityEn}
          </p>
        </div>

        <div className="pt-4">
          <div
            className="h-px w-full mb-4 opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            }}
          />
          <p className="font-display text-gold/40 text-[10px] uppercase tracking-[0.35em]">
            ♡ Wishing The Couple A Lifetime of Love &amp; Togetherness ♡
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0">
        <GoldStrip />
      </div>
    </footer>
  )
}
