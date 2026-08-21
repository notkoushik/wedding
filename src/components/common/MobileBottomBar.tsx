import { useState, useEffect } from 'react'

export function MobileBottomBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => {
      // Show bottom bar after scrolling past top 60px
      setShow(window.scrollY > 60)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openPhotoBooth = () => {
    scrollTo('gallery')
    window.dispatchEvent(new Event('open_photo_booth_modal'))
  }

  const triggerBlessings = () => {
    window.dispatchEvent(new Event('trigger_petal_shower'))
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-all duration-300 transform ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-2.5 mb-2.5 bg-[#200303]/95 backdrop-blur-xl border border-gold/50 rounded-2xl shadow-[0_-5px_25px_rgba(0,0,0,0.6)] p-1.5 px-2 flex items-center justify-between gap-1 text-parchment">
        
        {/* 1. 📜 Shubhlekha / Invitation */}
        <button
          onClick={() => scrollTo('invitation')}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base leading-none">📜</span>
          <span className="font-telugu text-[9.5px] font-semibold leading-tight">శుభలేఖ</span>
        </button>

        {/* 2. 📸 Photo Booth (Selfie & Moments Upload) */}
        <button
          onClick={openPhotoBooth}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light group"
        >
          <span className="text-base leading-none animate-pulse">📸</span>
          <span className="font-telugu text-[9.5px] font-bold text-[#ffe58f] leading-tight">
            ఫోటో బూత్
          </span>
        </button>

        {/* 3. 👑 Central Highlighted RSVP CTA */}
        <button
          onClick={() => scrollTo('rsvp')}
          className="flex-[1.3] py-2 px-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] text-[#3d0808] font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-gold/30 active:scale-95 transition-all"
        >
          <span className="text-xs leading-none">👑</span>
          <span className="font-display text-[10px] uppercase tracking-wider font-extrabold leading-tight">
            RSVP NOW
          </span>
        </button>

        {/* 4. 🌸 Shower Akshintalu & Petals */}
        <button
          onClick={triggerBlessings}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base leading-none">🌸</span>
          <span className="font-telugu text-[9.5px] font-semibold leading-tight">అక్షతలు</span>
        </button>

        {/* 5. 🗺️ Venues / Maps */}
        <button
          onClick={() => scrollTo('venues')}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl hover:bg-gold/15 active:scale-95 transition-all text-gold-light"
        >
          <span className="text-base leading-none">🗺️</span>
          <span className="font-telugu text-[9.5px] font-semibold leading-tight">వేదిక</span>
        </button>

      </div>
    </div>
  )
}
