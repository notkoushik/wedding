import { useRef, useState, useEffect } from 'react'
import { SectionLabel } from '../common/GoldDivider'

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

const PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=900&h=1200&fit=crop&auto=format',
    title: 'Divine Rituals',
    alt: 'Couple performing sacred wedding ritual under floral canopy',
    tall: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1587271598589-3f91d0872f66?w=800&h=600&fit=crop&auto=format',
    title: 'Bridal Grace',
    alt: 'Bride in red and gold traditional silk attire',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1630764883473-e8c2056f0589?w=800&h=600&fit=crop&auto=format',
    title: 'Sacred Havan',
    alt: 'Sacred fire ritual at Hindu ceremony',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/flagged/photo-1570055349452-29232699cc63?w=900&h=1200&fit=crop&auto=format',
    title: 'Royal Ornaments',
    alt: 'Exquisite gold bridal jewellery and temple motifs',
    tall: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1607512566084-a20ed291d623?w=800&h=600&fit=crop&auto=format',
    title: 'Festive Marigolds',
    alt: 'Traditional marigold flowers and decorations',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1764286954620-28029fbae9b6?w=800&h=600&fit=crop&auto=format',
    title: 'Together in Love',
    alt: 'Bride and groom in traditional South Indian wedding attire',
    tall: false,
  },
]

export function GallerySection() {
  const [ref, visible] = useInView()
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section
      id="gallery"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fffdf5 0%, #fdf6e8 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-12 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel title="Captured Moments" sub="Memories in the Making" />

          {/* Masonry-Style Gallery Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
            style={{ gridAutoRows: '220px' }}
          >
            {PHOTOS.map((p, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  p.tall ? 'row-span-2' : 'row-span-1'
                }`}
                style={{
                  border: '1.5px solid rgba(201,168,76,0.35)',
                  boxShadow: '0 8px 30px rgba(139,26,26,0.08)',
                }}
                onClick={() => setLightbox(p.url)}
              >
                <img
                  src={p.url}
                  alt={p.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(61,8,8,0.85) 0%, rgba(61,8,8,0.2) 60%, transparent 100%)',
                  }}
                >
                  <p className="font-display font-semibold text-gold-light text-sm">
                    {p.title}
                  </p>
                  <p className="font-body text-parchment/70 text-xs italic">
                    Click to view full image
                  </p>
                </div>

                {/* Magnifier badge */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(201,168,76,0.9)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d0808" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 cursor-pointer animate-fadeUp"
          style={{
            background: 'rgba(15,3,3,0.96)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Wedding ceremony photograph enlarged"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            style={{
              border: '2px solid rgba(201,168,76,0.6)',
              boxShadow: '0 0 70px rgba(201,168,76,0.3)',
            }}
          />
          <button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full text-gold bg-black/60 border border-gold/40 hover:bg-gold/20 transition-colors text-xl font-bold"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  )
}
