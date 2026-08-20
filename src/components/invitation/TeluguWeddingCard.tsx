import React from 'react'
import { GoldDivider } from '../common/GoldDivider'
import { weddingData } from '../../data/weddingData'

export function TeluguWeddingCard() {
  const { couple, parents, muhurtham, venues, compliments } = weddingData
  const weddingVenue = venues[0]
  const receptionVenue = venues[1]

  return (
    <div
      className="relative rounded-[26px] p-2 transition-all duration-400 group h-full flex flex-col justify-between hover:-translate-y-1"
      style={{
        background:
          'linear-gradient(135deg, #ffd700 0%, #fff2a6 25%, #c9a84c 50%, #ffd700 75%, #9b7b1b 100%)',
        boxShadow:
          '0 0 24px rgba(255, 215, 0, 0.45), 0 12px 35px rgba(92, 10, 10, 0.18)',
        border: '2px solid rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* Shining Gold Edge Glow */}
      <div className="absolute inset-0 rounded-[26px] animate-pulse pointer-events-none opacity-25 bg-gradient-to-r from-gold-bright via-white to-gold-bright" />

      {/* Inner Card Frame Synchronized to Ivory Background */}
      <div className="relative rounded-[20px] bg-[#fffdf5] border border-gold/40 p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between shadow-inner text-center space-y-2.5">
        
        {/* Fan Pattern Watermark synced to background */}
        <div className="absolute inset-0 fan-pattern opacity-12 pointer-events-none" />

        {/* Ornate Filigree Corner Accents */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-gold opacity-75 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-gold opacity-75 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-gold opacity-75 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-gold opacity-75 rounded-br-sm pointer-events-none" />

        {/* ── Top Auspicious Header ── */}
        <div className="relative z-10 space-y-0.5">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-crimson text-xs">🪔</span>
            <p className="font-telugu font-bold text-crimson text-xs sm:text-sm tracking-widest">
              {couple.sanskritHeaderTe.replace(/\|\|/g, '').trim()}
            </p>
            <span className="text-crimson text-xs">🪔</span>
          </div>

          <p className="font-telugu text-[9.5px] sm:text-[10px] text-[#7a4a4a] leading-tight italic">
            శ్రీ॰ శ్రీరామపత్నీ జనకస్య పుత్రి సీతాంగనా సుందర కోమలాంగి<br />
            భూగర్భజాతా భువనైకమాతా వధూ వరాభ్యాం వరదా భవంతు॥
          </p>
        </div>

        <div className="relative z-10 my-0.5">
          <GoldDivider className="my-0.5" />
        </div>

        {/* ── Main Invitation Title ── */}
        <div className="relative z-10 space-y-0.5">
          <h2 className="font-telugu font-bold text-crimson-dark text-lg sm:text-xl md:text-2xl tracking-wide">
            {couple.familyHeaderTe}
          </h2>
          {parents.ancestorsTe && (
            <p className="font-telugu text-[9.5px] sm:text-[10px] text-[#7a4a4a]">
              {parents.ancestorsTe}
            </p>
          )}
        </div>

        {/* ── Parents' Names ── */}
        <div className="relative z-10 py-1 px-3 rounded-lg bg-gold/10 border border-gold/25 inline-block mx-auto">
          <p className="font-telugu font-bold text-crimson text-xs sm:text-sm">
            {parents.groomParentsTe}
          </p>
          <p className="font-telugu font-semibold text-crimson-dark text-[10px] sm:text-[11px]">
            వ్రాయు శుభలేఖార్ధములు — మా ఏకైక పుత్రుడు
          </p>
        </div>

        {/* ── Groom & Bride Section ── */}
        <div className="relative z-10 space-y-1.5 py-0.5">
          <div className="space-y-0.5">
            <p className="font-telugu font-bold text-gold-dark text-[11px] sm:text-xs">
              {couple.groom.titleTe} {couple.groom.nameTe}
            </p>
            <p className="font-calligraphy text-crimson font-bold text-xl sm:text-2xl leading-none">
              {couple.groom.nameEn}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gold/50" />
            <span className="font-telugu font-bold text-crimson-dark text-xs">కు</span>
            <div className="h-px w-8 bg-gold/50" />
          </div>

          <div className="space-y-0.5">
            <p className="font-telugu font-bold text-gold-dark text-[11px] sm:text-xs">
              {couple.bride.titleTe} {couple.bride.nameTe}
            </p>
            <p className="font-calligraphy text-crimson font-bold text-xl sm:text-2xl leading-none">
              {couple.bride.nameEn}
            </p>
            <p className="font-telugu text-[9.5px] sm:text-[10px] text-[#7a4a4a]">
              {couple.bride.parentDetailsTe}
            </p>
          </div>
        </div>

        {/* ── Sumuhurtham Schedule Box ── */}
        <div className="relative z-10 bg-crimson/5 border border-gold/35 rounded-xl p-2.5 sm:p-3 space-y-0.5 text-left">
          <div className="flex items-center gap-1 text-crimson font-bold text-xs font-telugu">
            <span>🪔</span>
            <span>సుముహూర్తం (Sumuhurtham):</span>
          </div>
          <p className="font-telugu text-crimson-dark font-bold text-xs">
            {muhurtham.dateStringTe} {muhurtham.timeStringTe} ({muhurtham.thithiTe})
          </p>
          <p className="font-telugu text-[#7a4a4a] text-[10px]">
            {muhurtham.nakshatramTe} · {muhurtham.lagnamTe}
          </p>
        </div>

        {/* ── Venues Summary ── */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left text-xs">
          {weddingVenue && (
            <div className="bg-gold/10 border border-gold/25 rounded-lg p-2 space-y-0.5">
              <p className="font-telugu font-bold text-crimson text-[10px]">{weddingVenue.typeTelugu}:</p>
              <p className="font-body text-[#5c0a0a] text-[10.5px] font-semibold">{weddingVenue.name}</p>
              <p className="font-telugu text-[#7a4a4a] text-[9.5px]">{weddingVenue.landmark}</p>
            </div>
          )}
          {receptionVenue && (
            <div className="bg-gold/10 border border-gold/25 rounded-lg p-2 space-y-0.5">
              <p className="font-telugu font-bold text-crimson text-[10px]">{receptionVenue.typeTelugu}:</p>
              <p className="font-body text-[#5c0a0a] text-[10.5px] font-semibold">{receptionVenue.name}</p>
              <p className="font-telugu text-[#7a4a4a] text-[9.5px]">{receptionVenue.date} · {receptionVenue.city}</p>
            </div>
          )}
        </div>

        {/* ── Family Compliments ── */}
        <div className="relative z-10 text-center pt-0.5">
          <p className="font-telugu text-gold-dark font-bold text-[11px] sm:text-xs">
            వధూవరులను ఆశీర్వదించ ప్రార్థన
          </p>
          <p className="font-display italic text-[#7a4a4a] text-[9.5px]">
            {compliments.en}
          </p>
        </div>

      </div>
    </div>
  )
}
