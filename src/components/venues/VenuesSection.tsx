import { useRef, useState, useEffect } from 'react'
import { SectionLabel, GoldDivider } from '../common/GoldDivider'
import { OrnateCard } from '../common/OrnateCard'

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

  const venues = [
    {
      type: 'Wedding Ceremony Venue',
      typeTelugu: 'కళ్యాణవేదిక (హైదరాబాద్)',
      name: 'I Conventions',
      city: 'Hyderabad, Telangana',
      address: 'Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad - 502032',
      landmark: 'Near Sri Devi Cinema & Ameenpur Lake Junction',
      date: '22nd August 2026',
      time: 'Night 11:59 hrs',
      map: 'https://maps.google.com/?q=I+Conventions+Chanda+Nagar+Ameenpur+Hyderabad',
      icon: '🏛️',
    },
    {
      type: 'Reception & Feast Venue',
      typeTelugu: 'రిసెప్షన్ వేదిక (విశాఖపట్టణం)',
      name: 'Sri Sai Surya Function Hall',
      city: 'Visakhapatnam, Andhra Pradesh',
      address: 'Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam - 530048',
      landmark: 'Opposite Kommadi Junction, NH-16 Highway',
      date: '26th August 2026',
      time: '12:00 Noon Onwards',
      map: 'https://maps.google.com/?q=Sri+Sai+Surya+Function+Hall+Madhuravada+Visakhapatnam',
      icon: '🌸',
    },
  ]

  return (
    <section id="venues" className="relative bg-ivory py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 fan-pattern opacity-18 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel title="Venues & Locations" sub="Find Your Way" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {venues.map((v, i) => (
              <OrnateCard key={i} className="flex flex-col justify-between h-full">
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-crimson/5 border border-gold/40 text-2xl">
                    {v.icon}
                  </div>

                  <div>
                    <p className="font-display text-gold-dark text-[10px] uppercase tracking-[0.28em] font-semibold">
                      {v.type}
                    </p>
                    <p className="font-telugu text-crimson font-medium text-xs mt-0.5">
                      {v.typeTelugu}
                    </p>
                  </div>

                  <GoldDivider />

                  <div>
                    <h3
                      className="font-display font-bold text-crimson-dark mb-1"
                      style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}
                    >
                      {v.name}
                    </h3>
                    <p className="font-display text-gold-dark text-xs uppercase tracking-wider mb-2">
                      {v.city}
                    </p>
                    <p className="font-body italic text-[#633a3a] text-sm leading-relaxed max-w-sm mx-auto">
                      {v.address}
                    </p>
                  </div>

                  <div className="bg-gold/10 border border-gold/25 rounded-xl p-3 text-xs space-y-1">
                    <p className="text-[#7a4a4a] text-[11px]">
                      <span className="font-semibold text-crimson-dark">Landmark:</span> {v.landmark}
                    </p>
                    <p className="text-gold-dark font-semibold">
                      {v.date} · {v.time}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href={v.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full rounded-full py-3.5 text-parchment font-display text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #3d0808, #8b1a1a, #3d0808)',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Open Google Maps
                  </a>
                </div>
              </OrnateCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
