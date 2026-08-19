import { useState, useEffect } from 'react'
import coupleAvatar from '../../assets/aestatics/head reshaped image.jpg'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  const links = [
    { id: 'hero', label: 'Home' },
    { id: 'rituals', label: 'Traditions' },
    { id: 'invitation', label: 'Shubhlekha' },
    { id: 'events', label: 'Ceremonies' },
    { id: 'venues', label: 'Venues' },
    { id: 'gallery', label: 'Moments' },
    { id: 'wishes', label: 'Blessings' },
    { id: 'rsvp', label: 'RSVP' },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-[#fdfaf2]/95 backdrop-blur-md border-b border-[#c9a84c]/35 shadow-md shadow-[#9b7b1b]/10'
          : 'bg-[#fdfaf2]/80 backdrop-blur-sm border-b border-[#c9a84c]/20'
      }`}
    >
      {/* ── 1. Top Ornate Royal Gold Zari Border (Traditional Wedding Zari Trim) ── */}
      <div className="relative h-[3px] w-full bg-gradient-to-r from-[#9b7b1b] via-[#ffd700] to-[#9b7b1b] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">
        
        {/* ── 2. Brand Monogram with Aesthetic Couple Avatar & Traditional Telugu Tag ── */}
        <button
          onClick={() => go('hero')}
          className="group flex items-center gap-2.5 sm:gap-3 text-left transition-transform duration-300 hover:scale-102"
        >
          {/* Aesthetic Couple Avatar inside a 24K Gold Filigree Ring */}
          <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#c9a84c] shadow-sm bg-[#f5ede1] flex items-center justify-center p-0.5 group-hover:border-[#ffd700] transition-colors">
            <img
              src={coupleAvatar}
              alt="Mohan & Leepika"
              className="w-full h-full object-cover object-top rounded-full"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-calligraphy text-2xl md:text-3xl text-crimson group-hover:text-crimson-dark transition-colors leading-none font-bold">
              Mohan &amp; Leepika
            </span>
            <span className="font-telugu text-[10px] text-[#9b7b1b] font-semibold -mt-0.5 hidden sm:inline">
              తురుపాడ వారి శుభవివాహం
            </span>
          </div>
        </button>

        {/* ── 3. Desktop Navigation Menu (Crisp Crimson Typography on Light Ivory) ── */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="relative font-display text-[11px] uppercase tracking-[0.2em] text-[#5c0a0a]/80 hover:text-crimson font-bold transition-colors py-1 group"
            >
              {l.label}
              {/* Golden Hover Underline */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9b7b1b] to-[#ffd700] group-hover:w-full transition-all duration-300" />
            </button>
          ))}

          {/* Luxury Metallic RSVP Button */}
          <button
            onClick={() => go('rsvp')}
            className="px-5 py-2 rounded-full font-display text-[11px] uppercase tracking-[0.18em] text-[#3a0505] font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-[#9b7b1b]/20"
            style={{
              background:
                'linear-gradient(135deg, #c9a84c 0%, #ffd700 45%, #e8c97a 75%, #c9a84c 100%)',
            }}
          >
            RSVP
          </button>
        </div>

        {/* ── 4. Mobile Header Buttons ── */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => go('rsvp')}
            className="px-3.5 py-1.5 rounded-full font-display text-[10px] uppercase tracking-wider text-[#3a0505] font-bold shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, #c9a84c 0%, #ffd700 50%, #c9a84c 100%)',
            }}
          >
            RSVP
          </button>
          
          <button
            className="p-1.5 text-crimson hover:text-crimson-dark"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-crimson transition-all duration-300 origin-center ${
                  open ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-crimson transition-all duration-300 ${
                  open ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-crimson transition-all duration-300 origin-center ${
                  open ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

      </div>

      {/* ── 5. Mobile Drawer Menu (Matching Frosted Ivory & Gold) ── */}
      {open && (
        <div className="lg:hidden bg-[#fdfaf2] border-t border-[#c9a84c]/30 px-6 py-4 space-y-2 shadow-xl animate-fadeUp">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="block w-full text-left font-display text-xs uppercase tracking-[0.2em] text-[#5c0a0a] font-bold hover:text-crimson py-2.5 border-b border-[#c9a84c]/15"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
