import { useState, useEffect } from 'react'
import {
  WEDDING_CEREMONY_EVENT,
  createGoogleCalendarUrl,
  downloadIcsFile,
} from '../../lib/calendar'
import { weddingData } from '../../data/weddingData'

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

export function HeroSection() {
  const { couple, muhurtham, venues, parents } = weddingData
  const t = useCountdown(muhurtham.dateTime)
  const [calOpen, setCalOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const primaryVenue = venues[0]

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{
        /* Warm ivory-cream background — like a premium printed wedding card */
        background: 'linear-gradient(160deg, #fdf8ee 0%, #f7efda 40%, #f0e4c8 70%, #fdf8ee 100%)',
      }}
    >
      {/* ── Very subtle background texture impression ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(155,123,27,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,26,26,0.04) 0%, transparent 50%)',
        }}
      />

      {/* ── Gold top accent strip ── */}
      <div
        className="absolute top-0 inset-x-0 h-1 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #c9a84c 15%, #ffd700 35%, #e8c97a 50%, #ffd700 65%, #c9a84c 85%, transparent 100%)',
        }}
      />
      {/* ── Thin line below the strip ── */}
      <div
        className="absolute top-1 inset-x-0 h-px pointer-events-none opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #9b7b1b 30%, #c9a84c 50%, #9b7b1b 70%, transparent 100%)',
        }}
      />

      {/* ── Main centerpiece — generous vertical spacing ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6 py-24 sm:py-28">

        {/* Sacred Sanskrit Header */}
        <div className="space-y-1">
          <p
            className="font-telugu text-xs sm:text-sm font-semibold tracking-[0.25em]"
            style={{ color: '#9b7b1b' }}
          >
            {couple.sanskritHeader}
          </p>
          <p
            className="font-display text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-medium"
            style={{ color: 'rgba(155,123,27,0.65)' }}
          >
            {couple.familyHeaderEn}
          </p>
        </div>

        {/* Ornamental separator */}
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c80)' }} />
          <span style={{ color: '#c9a84c', fontSize: '12px' }}>✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c80)' }} />
        </div>

        {/* Wedding label in Telugu */}
        <p
          className="font-telugu text-sm sm:text-base font-semibold"
          style={{ color: 'rgba(92,10,10,0.6)' }}
        >
          {couple.familyHeaderTe}
        </p>

        {/* ── THE BIG NAMES ── */}
        <div className="w-full space-y-0 leading-none pt-2">
          <h1
            className="font-calligraphy font-bold"
            style={{
              fontSize: 'clamp(3rem, 9.5vw, 6rem)',
              color: '#5c0a0a',
              textShadow: '0 2px 20px rgba(139,26,26,0.12)',
              letterSpacing: '0.01em',
              lineHeight: 1.05,
            }}
          >
            {couple.groom.nameEn}
          </h1>

          <div className="flex items-center justify-center gap-4 sm:gap-6 py-3 sm:py-4">
            <div
              className="flex-1 max-w-[100px] sm:max-w-[160px] h-px"
              style={{ background: 'linear-gradient(to right, transparent, #c9a84c99)' }}
            />
            <span
              className="font-calligraphy text-3xl sm:text-4xl md:text-5xl"
              style={{ color: '#9b7b1b' }}
            >
              &amp;
            </span>
            <div
              className="flex-1 max-w-[100px] sm:max-w-[160px] h-px"
              style={{ background: 'linear-gradient(to left, transparent, #c9a84c99)' }}
            />
          </div>

          <h1
            className="font-calligraphy font-bold"
            style={{
              fontSize: 'clamp(3rem, 9.5vw, 6rem)',
              color: '#5c0a0a',
              textShadow: '0 2px 20px rgba(139,26,26,0.12)',
              letterSpacing: '0.01em',
              lineHeight: 1.05,
            }}
          >
            {couple.bride.nameEn}
          </h1>
        </div>

        {/* Telugu names */}
        <p
          className="font-telugu text-sm sm:text-base font-semibold -mt-1"
          style={{ color: 'rgba(155,123,27,0.7)' }}
        >
          {couple.groom.nameTe} · {couple.bride.nameTe}
        </p>

        {/* ── Ornamental SVG divider ── */}
        <div className="flex items-center gap-3 w-full max-w-sm sm:max-w-md mx-auto py-1">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(155,123,27,0.4))' }} />
          <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
            <circle cx="30" cy="9" r="3.5" fill="rgba(155,123,27,0.55)" />
            <circle cx="30" cy="9" r="7" stroke="rgba(155,123,27,0.25)" strokeWidth="0.75" strokeDasharray="2 2" />
            <polygon points="12,9 18,4 23,9 18,14" fill="rgba(155,123,27,0.3)" />
            <polygon points="37,9 42,4 48,9 42,14" fill="rgba(155,123,27,0.3)" />
          </svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(155,123,27,0.4))' }} />
        </div>

        {/* Date, Sumuhurtham & Venue */}
        <div className="space-y-1.5 pt-1">
          <p
            className="font-display font-bold tracking-[0.2em] uppercase text-sm sm:text-base"
            style={{ color: '#3d0808' }}
          >
            {muhurtham.dateStringEn}
          </p>
          <p
            className="font-telugu text-xs sm:text-sm font-semibold"
            style={{ color: 'rgba(92,10,10,0.65)' }}
          >
            సుముహూర్తం: {muhurtham.timeStringTe}
          </p>
          {primaryVenue && (
            <p
              className="font-display italic text-xs sm:text-[13px]"
              style={{ color: 'rgba(100,60,40,0.55)' }}
            >
              {primaryVenue.name}, {primaryVenue.landmark} · {primaryVenue.city}
            </p>
          )}
        </div>

        {/* ── Countdown Timer ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
          {[
            { val: t.days, label: 'Days', labelTe: 'రోజులు' },
            { val: t.hours, label: 'Hrs', labelTe: 'గంటలు' },
            { val: t.minutes, label: 'Mins', labelTe: 'నిమిషాలు' },
            { val: t.seconds, label: 'Secs', labelTe: 'సెకన్లు' },
          ].map(({ val, label, labelTe }, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <span
                  className="text-xl font-light -mt-5"
                  style={{ color: 'rgba(155,123,27,0.35)' }}
                >
                  :
                </span>
              )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-13 sm:w-15 h-13 sm:h-15 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(155,123,27,0.25)',
                    boxShadow: '0 2px 12px rgba(155,123,27,0.08)',
                    width: '52px',
                    height: '52px',
                  }}
                >
                  <span
                    className="font-display font-bold text-xl sm:text-2xl tabular-nums"
                    style={{ color: '#5c0a0a' }}
                  >
                    {String(val).padStart(2, '0')}
                  </span>
                </div>
                <p
                  className="font-display text-[9px] sm:text-[10px] uppercase tracking-widest"
                  style={{ color: 'rgba(155,123,27,0.55)' }}
                >
                  {label}
                </p>
                <p
                  className="font-telugu text-[8px]"
                  style={{ color: 'rgba(92,10,10,0.4)' }}
                >
                  {labelTe}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">

          {/* Primary CTA — Gold */}
          <button
            onClick={() => scrollTo('invitation')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] tracking-[0.15em] uppercase font-semibold font-display transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #9b7b1b 0%, #c9a84c 30%, #ffd700 50%, #e8c97a 70%, #c9a84c 100%)',
              color: '#1a0808',
              boxShadow: '0 4px 20px rgba(155,123,27,0.3)',
            }}
          >
            📜 View Invitation
          </button>

          {/* Calendar */}
          <div className="relative">
            <button
              onClick={() => setCalOpen((o) => !o)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs tracking-[0.12em] uppercase font-display font-medium transition-all duration-200 hover:scale-105"
              style={{
                border: '1.5px solid rgba(155,123,27,0.45)',
                color: '#7a5a10',
                background: 'rgba(201,168,76,0.08)',
              }}
            >
              🗓 Calendar
            </button>
            {calOpen && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 rounded-xl overflow-hidden z-50 shadow-xl"
                style={{
                  background: '#fdf8ee',
                  border: '1.5px solid rgba(155,123,27,0.3)',
                }}
              >
                <button
                  onClick={() => { window.open(createGoogleCalendarUrl(WEDDING_CEREMONY_EVENT), '_blank'); setCalOpen(false) }}
                  className="w-full px-4 py-3 text-left text-[11px] font-display text-[#5c0a0a] hover:bg-gold/10 transition-colors"
                >
                  🌐 Google Calendar
                </button>
                <button
                  onClick={() => { downloadIcsFile(WEDDING_CEREMONY_EVENT); setCalOpen(false) }}
                  className="w-full px-4 py-3 text-left text-[11px] font-display text-[#5c0a0a] hover:bg-gold/10 transition-colors border-t border-gold/20"
                >
                  📅 Save .ics
                </button>
              </div>
            )}
          </div>

          {/* RSVP */}
          <button
            onClick={() => scrollTo('rsvp')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs tracking-[0.12em] uppercase font-display font-semibold transition-all duration-200 hover:scale-105"
            style={{
              border: '1.5px solid rgba(92,10,10,0.35)',
              color: '#5c0a0a',
              background: 'rgba(92,10,10,0.06)',
            }}
          >
            🌸 RSVP
          </button>
        </div>

        {/* Parents' gentle blessing note at bottom */}
        <div className="pt-3 space-y-0.5">
          <p
            className="font-telugu text-[10px] sm:text-xs font-medium"
            style={{ color: 'rgba(92,10,10,0.45)' }}
          >
            {parents.groomParentsTe} {couple.groom.parentDetailsTe}
          </p>
          <p
            className="font-display italic text-[10px] sm:text-[11px]"
            style={{ color: 'rgba(100,60,40,0.4)' }}
          >
            With joyful blessings from both families
          </p>
        </div>

      </div>

      {/* ── Scroll cue ── */}
      <button
        onClick={() => scrollTo('rituals')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 transition-opacity duration-300 hover:opacity-70"
        style={{ color: 'rgba(155,123,27,0.4)', fontSize: '10px' }}
      >
        <span className="font-display tracking-[0.3em] uppercase">Explore</span>
        <span className="animate-bounce text-xs">⌄</span>
      </button>

      {/* ── Gold bottom strip ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #c9a84c 15%, #ffd700 35%, #e8c97a 50%, #ffd700 65%, #c9a84c 85%, transparent 100%)',
        }}
      />
    </section>
  )
}
