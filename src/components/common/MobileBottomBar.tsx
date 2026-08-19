import { useState, useEffect } from 'react'

export function MobileBottomBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => {
      // Show bottom bar after scrolling past top 100px
      setShow(window.scrollY > 80)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `🌸 Wedding Invitation 🌸\n\nMohan Praneeth & Leepika's Wedding Ceremony\n📅 22nd August 2026, 11:59 PM @ Hyderabad\n\nView Invitation & RSVP:\n${window.location.href}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-all duration-300 transform ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-3 mb-3 bg-[#240404]/95 backdrop-blur-xl border border-gold/40 rounded-2xl shadow-2xl p-2 px-3 flex items-center justify-between gap-1.5 text-parchment">
        {/* Shubhlekha / Invitation */}
        <button
          onClick={() => scrollTo('invitation')}
          className="flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base">📜</span>
          <span className="font-telugu text-[10px] font-semibold leading-tight">శుభలేఖ</span>
        </button>

        {/* Venues / Directions */}
        <button
          onClick={() => scrollTo('venues')}
          className="flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base">🗺️</span>
          <span className="font-telugu text-[10px] font-semibold leading-tight">వేదిక (Map)</span>
        </button>

        {/* Primary CTA: RSVP */}
        <button
          onClick={() => scrollTo('rsvp')}
          className="flex-[1.4] py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#e8c97a] to-[#c9a84c] text-crimson-deep font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-gold/25 active:scale-95 transition-all"
        >
          <span className="text-sm leading-none">🌸</span>
          <span className="font-display text-[10px] uppercase tracking-wider font-extrabold leading-tight">
            RSVP Now
          </span>
        </button>

        {/* Wishes / Blessings */}
        <button
          onClick={() => scrollTo('wishes')}
          className="flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base">💌</span>
          <span className="font-telugu text-[10px] font-semibold leading-tight">ఆశీస్సులు</span>
        </button>

        {/* WhatsApp Share */}
        <button
          onClick={shareToWhatsApp}
          className="flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-[#25D366]"
        >
          <span className="text-base">📲</span>
          <span className="font-display text-[10px] font-semibold leading-tight">Share</span>
        </button>
      </div>
    </div>
  )
}
