import { useRef, useState, useEffect } from 'react'
import { SectionLabel, GoldDivider, GoldStrip } from '../common/GoldDivider'
import {
  WEDDING_CEREMONY_EVENT,
  RECEPTION_EVENT,
  createGoogleCalendarUrl,
  downloadIcsFile,
} from '../../lib/calendar'

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

export function EventsSection() {
  const [ref, visible] = useInView()

  const events = [
    {
      id: 'muhurtham',
      emoji: '🪔',
      title: 'Sumuhurtham',
      titleTelugu: 'సముహూర్తం (కళ్యాణ మహోత్సవం)',
      subtitle: 'Auspicious Wedding Ceremony',
      day: 'Saturday',
      date: '22nd August 2026',
      time: 'Night 11:59 hrs',
      nakshatram: 'Śrāvaṇa Śuddha Daśami · Mūla Nakshatram · Mēṣa Lagnam',
      nakshatramTelugu: 'శ్రావణ శుద్ధ దశమి, మూలా నక్షత్రయుక్త, మేష లగ్న పుష్పాంశమువంద',
      venueName: 'I Conventions',
      venueAddress: 'Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad',
      dressCode: 'Traditional South Indian Silk / Festive Pattu Wear',
      dressCodeTelugu: 'సంప్రదాయ పట్టు వస్త్రములు',
      calendarEvent: WEDDING_CEREMONY_EVENT,
      mapLink: 'https://maps.google.com/?q=I+Conventions+Chanda+Nagar+Ameenpur+Hyderabad',
    },
    {
      id: 'reception',
      emoji: '🌺',
      title: 'Grand Reception',
      titleTelugu: 'రిసెప్షన్ & విందు',
      subtitle: 'Celebration of Joy & Blessings',
      day: 'Wednesday',
      date: '26th August 2026',
      time: '12:00 Noon Onwards',
      nakshatram: 'Grand Luncheon & Family Gathering',
      nakshatramTelugu: 'బంధుమిత్రుల సమక్షంలో స్నేహపూర్వక విందు',
      venueName: 'Sri Sai Surya Function Hall',
      venueAddress: 'Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam',
      dressCode: 'Traditional Ethnic / Royal Formal',
      dressCodeTelugu: 'రాచరిక సాంప్రదాయ దుస్తులు',
      calendarEvent: RECEPTION_EVENT,
      mapLink: 'https://maps.google.com/?q=Sri+Sai+Surya+Function+Hall+Madhuravada+Visakhapatnam',
    },
  ]

  return (
    <section
      id="events"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 50%, #5c0a0a 0%, #3d0808 60%, #220303 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel
            title="Ceremonies & Timeline"
            sub="Save The Auspicious Dates"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {events.map((ev, i) => (
              <div
                key={ev.id}
                className="relative rounded-3xl overflow-hidden glass-crimson flex flex-col justify-between transition-all duration-300 hover:border-gold/60 shadow-2xl group"
                style={{
                  border: '1.5px solid rgba(201,168,76,0.35)',
                }}
              >
                <GoldStrip />

                <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6">
                  {/* Event Header */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gold/15 border border-gold/40 text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                      {ev.emoji}
                    </div>
                    <h3
                      className="font-calligraphy text-gold-light leading-none font-bold"
                      style={{ fontSize: 'clamp(2.2rem, 5vw, 2.8rem)' }}
                    >
                      {ev.title}
                    </h3>
                    <p className="font-telugu text-gold/70 text-sm font-semibold">
                      {ev.titleTelugu}
                    </p>
                    <p className="font-display italic text-parchment/60 text-xs">
                      {ev.subtitle}
                    </p>
                  </div>

                  <GoldDivider light />

                  {/* Date & Time Badge */}
                  <div className="rounded-2xl p-4 sm:p-5 text-center glass-gold-tile space-y-1">
                    <p className="font-display text-gold-light text-[10px] uppercase tracking-[0.3em] font-semibold">
                      {ev.day}
                    </p>
                    <p className="font-display text-white font-bold text-xl sm:text-2xl">
                      {ev.date}
                    </p>
                    <p className="font-display italic text-gold-bright text-base font-semibold">
                      {ev.time}
                    </p>
                  </div>

                  {/* Astrological & Muhurtham details */}
                  <div className="text-center space-y-1.5 px-2">
                    <p className="font-body text-parchment/90 text-xs sm:text-sm italic">
                      {ev.nakshatram}
                    </p>
                    <p className="font-telugu text-gold/60 text-xs leading-relaxed">
                      {ev.nakshatramTelugu}
                    </p>
                  </div>

                  {/* Dress Code & Venue */}
                  <div className="bg-black/25 rounded-xl p-3.5 border border-gold/20 space-y-2 text-center">
                    <div className="text-xs">
                      <span className="text-gold/60 uppercase text-[9px] tracking-wider block mb-0.5">
                        Venue
                      </span>
                      <p className="font-display font-semibold text-white">
                        {ev.venueName}
                      </p>
                      <p className="font-body text-parchment/60 text-[11px] italic">
                        {ev.venueAddress}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gold/15">
                      <span className="text-gold/60 uppercase text-[9px] tracking-wider block mb-0.5">
                        Attire / Dress Code
                      </span>
                      <p className="font-display text-gold-light text-xs font-medium">
                        {ev.dressCode}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={createGoogleCalendarUrl(ev.calendarEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-full font-display text-[10px] uppercase tracking-wider text-parchment bg-white/10 hover:bg-white/20 border border-gold/40 text-center transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <span>📅 Google Cal</span>
                    </a>
                    <a
                      href={ev.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-full font-display text-[10px] uppercase tracking-wider text-crimson-deep font-bold bg-gradient-to-r from-gold-light to-gold hover:brightness-110 text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>🗺️ Directions</span>
                    </a>
                  </div>
                </div>

                <GoldStrip />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: '56px' }}
        >
          <path d="M0 16 Q360 64 720 32 Q1080 0 1440 48 L1440 64 L0 64 Z" fill="#fffdf5" />
        </svg>
      </div>
    </section>
  )
}
