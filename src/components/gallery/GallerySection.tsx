import { useRef, useState, useEffect } from 'react'
import { SectionLabel } from '../common/GoldDivider'
import { weddingData } from '../../data/weddingData'
import {
  fetchGuestPhotos,
  likeGuestPhoto,
  type GuestPhotoItem,
} from '../../lib/supabase'
import { PhotoBoothModal } from './PhotoBoothModal'

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

export function GallerySection() {
  const [ref, visible] = useInView()
  const [lightbox, setLightbox] = useState<string | null>(null)

  // Guest Photos Stream
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoItem[]>([])
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false)
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const loadGuestPhotos = async () => {
    const photos = await fetchGuestPhotos()
    setGuestPhotos(photos)
  }

  useEffect(() => {
    loadGuestPhotos()
    const handleOpenPhotoBooth = () => {
      setIsPhotoBoothOpen(true)
    }
    window.addEventListener('open_photo_booth_modal', handleOpenPhotoBooth)
    window.addEventListener('wedding_photos_updated', loadGuestPhotos)
    return () => {
      window.removeEventListener('open_photo_booth_modal', handleOpenPhotoBooth)
      window.removeEventListener('wedding_photos_updated', loadGuestPhotos)
    }
  }, [])

  const handleLike = (photoId: string) => {
    if (likedPhotoIds.has(photoId)) return
    setLikedPhotoIds((prev) => new Set(prev).add(photoId))
    setGuestPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: (p.likes || 0) + 1 } : p))
    )
    likeGuestPhoto(photoId)
  }

  // Combined authentic photos list (Couple Official + Live Guest Uploads)
  const officialMoments: GuestPhotoItem[] = [
    {
      id: 'official-couple',
      name: weddingData.couple.namesCombinedEn,
      caption: 'The Happy Couple · మోహన్ ప్రణీత్ & లీపిక',
      photo_url: weddingData.couple.avatarImage,
      likes: 108,
      created_at: 'Official Portrait',
    },
  ]

  const allDisplayPhotos = [...officialMoments, ...guestPhotos].filter((p) => {
    if (!searchQuery.trim()) return true
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <section
      id="gallery"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fdf8ee 0%, #f7eed9 50%, #fdf8ee 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Section Header */}
          <SectionLabel title="Royal Wedding Photo Wall" sub="అతిథుల చిత్రమాలిక గోడ · Live Guest Memories" />

          <p className="text-center font-display italic text-xs sm:text-sm text-[#7a4a4a] max-w-xl mx-auto mb-8 -mt-6">
            "Every photo uploaded by our family and friends is framed on this royal memory wall. Snap a live selfie to hang your moment with Mohan &amp; Leepika!"
          </p>

          {/* Wall Header Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#fffbf2]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-gold/40 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-crimson font-display text-xs font-bold">
                <span>🖼️</span>
                <span>{allDisplayPhotos.length} Memories Hung on Wall</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search filter for large galleries */}
              {allDisplayPhotos.length > 4 && (
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white border border-gold/40 text-[#3d0808] focus:outline-none focus:border-crimson w-36 sm:w-48"
                />
              )}

              {/* 📸 Open Photo Booth Trigger Button */}
              <button
                onClick={() => setIsPhotoBoothOpen(true)}
                className="px-4 sm:px-5 py-2 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] hover:brightness-110 shadow-md shadow-gold/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="text-sm animate-bounce">📸</span>
                <span>Snap / Upload to Wall</span>
              </button>
            </div>
          </div>

          {/* ── 🏛️ Royal Wall-Mounted Picture Frame Board (With Internal Scroll) ── */}
          <div
            className="relative rounded-3xl overflow-hidden border-[3px] border-gold/70 shadow-2xl p-4 sm:p-8"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 30%, #fffef8 0%, #fbf3e2 60%, #f4e4c4 100%)',
              boxShadow:
                'inset 0 0 40px rgba(201, 168, 76, 0.2), 0 20px 50px rgba(61, 8, 8, 0.12)',
            }}
          >
            {/* Top Ornate Brass Hanging Bar / Rail Decoration */}
            <div className="flex items-center justify-between border-b border-gold/30 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-sm border border-[#3d0808]/40" />
                <span className="font-display font-bold text-crimson text-xs sm:text-sm tracking-wider uppercase">
                  ✦ Turupada Family Memory Gallery · జ్ఞాపకాల తోరణం ✦
                </span>
              </div>
              <span className="font-telugu text-gold-dark text-xs font-semibold hidden sm:inline">
                ఫోటోల గ్యాలరీ
              </span>
            </div>

            {/* Scrollable Gallery Wall Canvas (Restricted max-height with custom golden scrollbar) */}
            <div className="max-h-[580px] sm:max-h-[660px] overflow-y-auto pr-2 sm:pr-3 custom-gold-scrollbar">
              
              {allDisplayPhotos.length === 0 ? (
                <div className="text-center py-16 space-y-4 my-auto">
                  <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-dashed border-gold/60 flex items-center justify-center text-4xl bg-white shadow-inner">
                    🖼️
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-crimson text-base">
                      The Memory Wall Awaits Your Snapshot!
                    </p>
                    <p className="font-body text-xs text-[#7a4a4a] max-w-sm mx-auto">
                      Be the first to snap a live selfie with our Snapchat filters and hang it on the wedding wall.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPhotoBoothOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-crimson text-gold-light font-display text-xs font-bold hover:bg-crimson-dark shadow-md"
                  >
                    📸 Snap &amp; Hang Photo Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-2">
                  {allDisplayPhotos.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="group relative transition-all duration-300 hover:-translate-y-1.5"
                    >
                      {/* 🖼️ Luxury Wall Picture Frame Styling */}
                      <div
                        className="relative bg-white rounded-2xl p-2.5 sm:p-3 border-[6px] sm:border-[7px] border-[#4a0808] transition-all duration-300 group-hover:border-[#380505] flex flex-col justify-between"
                        style={{
                          boxShadow:
                            '0 12px 28px rgba(61, 8, 8, 0.18), 0 4px 10px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255, 215, 0, 0.7)',
                        }}
                      >
                        {/* Top Hanging Brass Pin */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#c9a84c] to-[#ffd700] border border-[#3d0808] shadow-md z-10" />

                        {/* Inner Picture Matting (Passe-partout) */}
                        <div
                          className="relative aspect-square w-full rounded-xl overflow-hidden cursor-pointer bg-[#fdfaf2] border border-gold/30 shadow-inner group"
                          onClick={() => setLightbox(item.photo_url)}
                        >
                          <img
                            src={item.photo_url}
                            alt={item.caption || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />

                          {/* Hover View Magnifier Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-3 py-1 rounded-full bg-gold text-[#3a0505] font-display text-[11px] font-bold shadow-lg">
                              🔍 View Full Photo
                            </span>
                          </div>
                        </div>

                        {/* Bottom Brass Engraved Plaque Label */}
                        <div className="mt-3 pt-2.5 border-t border-gold/30 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <p className="font-display font-bold text-crimson text-xs sm:text-sm truncate">
                              {item.name}
                            </p>
                            {item.caption && (
                              <p className="font-body text-[11px] text-[#5c0a0a] line-clamp-1 italic">
                                "{item.caption}"
                              </p>
                            )}
                          </div>

                          {/* Like Reaction Button */}
                          <button
                            onClick={() => handleLike(item.id)}
                            className={`px-2 py-1 rounded-full text-xs font-display font-semibold transition-all active:scale-90 flex items-center gap-1 shrink-0 ${
                              likedPhotoIds.has(item.id)
                                ? 'bg-red-50 text-crimson border border-red-200'
                                : 'text-[#7a4a4a] hover:text-crimson hover:bg-gold/10'
                            }`}
                            title="Love this photo"
                          >
                            <span>{likedPhotoIds.has(item.id) ? '❤️' : '🤍'}</span>
                            <span className="text-[11px] font-bold">{item.likes || 1}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom Subtle Scroll Hint if many photos */}
            {allDisplayPhotos.length > 6 && (
              <div className="mt-4 pt-2 border-t border-gold/20 text-center">
                <p className="text-[11px] font-display text-[#7a4a4a] italic flex items-center justify-center gap-1">
                  <span>↕ Scroll inside this frame to view all memories</span>
                </p>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={lightbox}
              alt="Expanded view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border-2 border-gold shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-sm shadow-lg hover:bg-crimson-dark"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── 📸 Snapchat-Style Wedding Photo Booth Camera Modal ── */}
      <PhotoBoothModal
        isOpen={isPhotoBoothOpen}
        onClose={() => setIsPhotoBoothOpen(false)}
        onPhotoUploaded={loadGuestPhotos}
      />
    </section>
  )
}
