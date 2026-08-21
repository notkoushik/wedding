import { useRef, useState, useEffect } from 'react'
import { SectionLabel, GoldDivider } from '../common/GoldDivider'
import { OrnateCard } from '../common/OrnateCard'
import { weddingData } from '../../data/weddingData'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

export function VenuesSection() {
  const [ref, visible] = useInView()
  const { venues } = weddingData

  return (
    <section id="venues" className="relative bg-ivory py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 fan-pattern opacity-18 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* ── Section Title ── */}
          <SectionLabel title="Venues & Smart Travel Guide" sub="కళ్యాణ వేదికల మార్గదర్శి · Navigation & Parking" />

          {/* 🪔 Tomorrow's Auspicious Wedding Day Alert Banner */}
          <div className="mb-10 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-[#3d0808]/90 via-[#680808]/90 to-[#3d0808]/90 border-2 border-gold/70 shadow-xl text-center text-white space-y-1 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-gold-light text-xs font-display font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Wedding is Tomorrow · 22nd August 2026</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="font-telugu text-gold-bright text-sm sm:text-base font-bold">
              హైదరాబాద్ వివాహ వేదికకు విచ్చేయు బంధుమిత్రులకు స్వాగతం!
            </p>
            <p className="font-display italic text-parchment/80 text-xs">
              "We eagerly look forward to welcoming you to the Kalyana Mandapam in Hyderabad. Safe travels!"
            </p>
          </div>

          {/* ── Venues Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {venues.map((v, i) => (
              <OrnateCard key={i} className="flex flex-col justify-between h-full group hover:shadow-2xl transition-all duration-300">
                <div className="space-y-4">
                  {/* Top Venue Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-crimson/5 border border-gold/40 text-2xl shadow-xs">
                      {v.icon}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-crimson font-display text-[11px] font-bold uppercase tracking-wider">
                      {v.city.split(',')[0]}
                    </span>
                  </div>

                  <div>
                    <p className="font-display text-gold-dark text-[10px] uppercase tracking-[0.25em] font-semibold">
                      {v.type}
                    </p>
                    <p className="font-telugu text-crimson font-bold text-xs mt-0.5">
                      {v.typeTelugu}
                    </p>
                  </div>

                  <GoldDivider />

                  {/* Venue Name & Address */}
                  <div>
                    <h3
                      className="font-display font-bold text-crimson-dark mb-1"
                      style={{ fontSize: 'clamp(1.25rem, 3vw, 1.55rem)' }}
                    >
                      {v.name}
                    </h3>
                    <p className="font-display text-gold-dark text-xs uppercase tracking-wider mb-2 font-semibold">
                      {v.city}
                    </p>
                    <p className="font-body italic text-[#633a3a] text-sm leading-relaxed">
                      {v.address}
                    </p>
                  </div>

                  {/* 📍 Landmark & Timings Card */}
                  <div className="bg-gold/10 border border-gold/30 rounded-2xl p-3.5 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-crimson font-bold">📍</span>
                      <p className="text-[#5c0a0a] text-xs">
                        <span className="font-bold text-crimson-dark">Landmark:</span> {v.landmark}
                      </p>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-gold/20">
                      <span className="text-gold-dark font-bold">⏰</span>
                      <p className="text-[#3d0808] font-bold text-xs">
                        {v.date} · {v.time}
                      </p>
                    </div>

                    {v.parkingInfo && (
                      <div className="flex items-start gap-2 pt-1 border-t border-gold/20">
                        <span className="text-emerald-700 font-bold">🅿️</span>
                        <p className="text-emerald-800 text-[11px] font-medium leading-tight">
                          <span className="font-bold">Parking:</span> {v.parkingInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 🚗 1-Tap Navigation Actions ── */}
                <div className="pt-6 space-y-2.5">
                  {/* Primary Google Maps Navigation */}
                  <a
                    href={v.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full rounded-full py-3.5 text-parchment font-display text-xs uppercase tracking-[0.18em] font-bold transition-all duration-300 hover:shadow-xl hover:scale-102 active:scale-95 shadow-md shadow-crimson/20"
                    style={{
                      background: 'linear-gradient(135deg, #3d0808 0%, #8b1a1a 50%, #3d0808 100%)',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Google Maps Directions</span>
                  </a>

                  {/* Secondary Fast Ride Links (Uber & Apple Maps) */}
                  <div className="flex items-center gap-2">
                    {v.uberLink && (
                      <a
                        href={v.uberLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-black text-white text-[11px] font-display font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-xs"
                      >
                        <span>🚖</span>
                        <span>Book Uber</span>
                      </a>
                    )}

                    {v.appleMapsLink && (
                      <a
                        href={v.appleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-[#e5dfd3] border border-gold/40 text-[#3d0808] text-[11px] font-display font-bold flex items-center justify-center gap-1.5 hover:bg-gold/20 transition-colors shadow-xs"
                      >
                        <span>🍏</span>
                        <span>Apple Maps</span>
                      </a>
                    )}
                  </div>
                </div>
              </OrnateCard>
            ))}
          </div>

          {/* ── 📞 Family Hospitality & Help Desk ── */}
          <div className="mt-12 bg-[#fffdfa] rounded-3xl border border-gold/40 p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/15 border border-gold/30 text-crimson font-display text-xs font-bold uppercase tracking-wider">
              <span>🤝</span>
              <span>Hospitality &amp; Travel Assistance</span>
            </div>

            <h3 className="font-display font-bold text-crimson-dark text-lg sm:text-xl">
              Need Assistance with Directions or Accommodations?
            </h3>

            <p className="font-body italic text-[#633a3a] text-xs sm:text-sm max-w-lg mx-auto">
              Our family coordinators are at the venue to assist out-of-town guests with vehicle parking, room check-in, and venue directions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://wa.me/?text=Hello%20Turupada%20Family%2C%20I%20am%20attending%20Mohan%20Praneeth%20%26%20Leepika%27s%20wedding%20and%20need%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#25D366] text-white font-display text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
              >
                <span>💬</span>
                <span>WhatsApp Family Helpdesk</span>
              </a>

              <button
                onClick={() => {
                  window.location.hash = 'rsvp'
                  document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-5 py-2.5 rounded-full bg-gold/20 hover:bg-gold/30 text-crimson-dark border border-gold/50 font-display text-xs font-bold transition-all"
              >
                <span>📋</span>
                <span>Review RSVP Details</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
