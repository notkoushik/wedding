import React from 'react'
import { GoldDivider } from '../common/GoldDivider'

export function DigitalEnglishCard() {
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

      {/* Inner Parchment Card Content Synced to Background */}
      <div className="relative rounded-[20px] bg-[#fffdf5] border border-gold/40 p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between shadow-inner text-center space-y-2.5">
        
        {/* Fan Pattern Watermark */}
        <div className="absolute inset-0 fan-pattern opacity-12 pointer-events-none" />

        {/* Ornate Filigree Corner Accents */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-gold opacity-75 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-gold opacity-75 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-gold opacity-75 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-gold opacity-75 rounded-br-sm pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 space-y-0.5">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-crimson text-xs">🪔</span>
            <p className="font-display italic text-gold-dark text-[10.5px] uppercase tracking-[0.28em] font-semibold">
              Srirasthu · Subhamasthu · Avighnamasthu
            </p>
            <span className="text-crimson text-xs">🪔</span>
          </div>

          <p className="font-telugu font-semibold text-crimson text-xs">
            శ్రీ రస్తు శుభమస్తు అవిఘ్నమస్తు
          </p>
        </div>

        <div className="relative z-10 my-0.5">
          <GoldDivider className="my-0.5" />
        </div>

        {/* Ancestral Blessings */}
        <div className="relative z-10 space-y-0.5">
          <p className="font-display font-medium text-gold-dark text-[9.5px] uppercase tracking-[0.22em]">
            With Divine Ancestral Blessings
          </p>
          <p className="font-display italic text-[#7a4a4a] text-[11px] leading-tight">
            Late Sri T. Rami Naidu &amp; Late Sri G. Venkata Jagannadha Naidu
          </p>
        </div>

        {/* Parents' Names */}
        <div className="relative z-10 py-1 px-3 rounded-lg bg-gold/10 border border-gold/25 inline-block mx-auto">
          <p className="font-display font-bold text-crimson text-xs sm:text-sm">
            Sri Turupada Rama Krishna &amp; Smt. Visalakshi
          </p>
          <p className="font-display text-[#7a4a4a] text-[10px]">
            Visakhapatnam &amp; Hyderabad
          </p>
        </div>

        <p className="relative z-10 font-body italic text-[#7a4a4a] text-[11px] leading-tight max-w-md mx-auto">
          solicit the honour of your presence at the wedding ceremony of their only son
        </p>

        {/* Groom & Bride Names */}
        <div className="relative z-10 space-y-1.5 py-0.5">
          <div className="space-y-0.5">
            <p className="font-display italic text-[#7a4a4a] text-[10px]">Chy. :</p>
            <h2 className="font-calligraphy text-crimson font-bold text-xl sm:text-2xl leading-none">
              Mohan Praneeth
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gold/50" />
            <span className="font-display italic text-[#7a4a4a] text-xs font-semibold">with</span>
            <div className="h-px w-8 bg-gold/50" />
          </div>

          <div className="space-y-0.5">
            <p className="font-display italic text-[#7a4a4a] text-[10px]">Chy. La. Sow. :</p>
            <h2 className="font-calligraphy text-crimson font-bold text-xl sm:text-2xl leading-none">
              Leepika
            </h2>
            <p className="font-body italic text-[#7a4a4a] text-[10px] pt-0.5">
              Only daughter of Sri Bangari R. Sunil Kumar, (Late. Smt. Navaneetha) of Hyderabad
            </p>
          </div>
        </div>

        {/* Sumuhurtham Box */}
        <div className="relative z-10 bg-crimson/5 border border-gold/35 rounded-xl p-2.5 sm:p-3 space-y-0.5 text-left">
          <p className="font-display font-bold text-crimson-dark text-xs uppercase tracking-wider">
            Sumuhurtham (Wedding Ceremony)
          </p>
          <p className="font-body font-bold text-crimson text-xs">
            Saturday, 22nd August 2026 at Night 11:59 hrs
          </p>
          <p className="font-body italic text-[#7a4a4a] text-[10px]">
            Śrāvaṇa Śuddha Daśami · Mūla Nakshatram · Mēṣa Lagnam
          </p>
        </div>

        {/* Venues Summary */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left text-xs">
          <div className="bg-gold/10 border border-gold/25 rounded-lg p-2 space-y-0.5">
            <p className="font-display font-bold text-crimson text-[10px]">Wedding Venue (Hyd):</p>
            <p className="font-body text-[#5c0a0a] text-[10.5px] font-semibold">I Conventions</p>
            <p className="font-body text-[#7a4a4a] text-[9.5px]">Chanda Nagar, Ameenpur</p>
          </div>
          <div className="bg-gold/10 border border-gold/25 rounded-lg p-2 space-y-0.5">
            <p className="font-display font-bold text-crimson text-[10px]">Reception Venue (Vizag):</p>
            <p className="font-body text-[#5c0a0a] text-[10.5px] font-semibold">Sri Sai Surya Function Hall</p>
            <p className="font-body text-[#7a4a4a] text-[9.5px]">26th Aug · Kommadi Jn</p>
          </div>
        </div>

        {/* Family Compliments */}
        <div className="relative z-10 text-center pt-0.5">
          <p className="font-telugu text-gold-dark font-bold text-[11px] sm:text-xs">
            వధూవరులను ఆశీర్వదించ ప్రార్థన
          </p>
          <p className="font-display italic text-[#7a4a4a] text-[9.5px]">
            With best compliments from Families and Near &amp; Dear
          </p>
        </div>

      </div>
    </div>
  )
}
