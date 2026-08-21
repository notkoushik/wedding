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
  const { gallery } = weddingData

  // Guest Photos Stream
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoItem[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'official' | 'guests'>('all')
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false)
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set())

  const loadGuestPhotos = async () => {
    const photos = await fetchGuestPhotos()
    setGuestPhotos(photos)
  }

  useEffect(() => {
    loadGuestPhotos()
    const handleOpenPhotoBooth = () => {
      setActiveTab('guests')
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

  return (
    <section
      id="gallery"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fffdf5 0%, #fdf6e8 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-12 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel title="Wedding Photo Booth & Guest Snaps" sub="ఫోటో బూత్ · Snap & Cherish Live Moments" />

          {/* Subtitle description */}
          <p className="text-center font-display italic text-xs sm:text-sm text-[#7a4a4a] max-w-xl mx-auto mb-8 -mt-6">
            "Open our in-web Snapchat photo booth, apply royal wedding frames &amp; golden filters, and share your live selfies with Mohan &amp; Leepika!"
          </p>

          {/* Gallery Header Controls: Tabs & 1-Tap Snapchat Camera Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-3 border-b border-gold/30">
            <div className="flex items-center gap-2">
              {[
                { id: 'all' as const, label: `All Moments (${gallery.length + guestPhotos.length})` },
                { id: 'official' as const, label: `Official Portraits (${gallery.length})` },
                { id: 'guests' as const, label: `📸 Photo Booth Snaps (${guestPhotos.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-display transition-all ${
                    activeTab === tab.id
                      ? 'bg-crimson text-gold-light font-bold shadow-md'
                      : 'text-[#5c0a0a] hover:bg-gold/10 font-semibold'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 📸 1-Tap Snapchat-Style Live Camera Shutter Button */}
            <button
              onClick={() => setIsPhotoBoothOpen(true)}
              className="px-5 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] hover:brightness-110 shadow-lg shadow-gold/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="text-base animate-bounce">📸</span>
              <span>Open Photo Booth (Snap Selfie)</span>
            </button>
          </div>

          {/* ── 1. Official Gallery Grid (When Active) ── */}
          {(activeTab === 'all' || activeTab === 'official') && (
            <div className="mb-10">
              {activeTab === 'all' && (
                <h3 className="font-display font-bold text-crimson text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span>✦</span>
                  <span>Official Portraits &amp; Moments</span>
                </h3>
              )}
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
                style={{ gridAutoRows: '220px' }}
              >
                {gallery.map((p, i) => (
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
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(61,8,8,0.85) 0%, rgba(61,8,8,0.2) 60%, transparent 100%)',
                      }}
                    >
                      <p className="font-display font-semibold text-gold-light text-sm">{p.title}</p>
                      <p className="font-body text-parchment/70 text-xs italic">Click to view full image</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 2. Live Guest Snaps Stream Grid (When Active) ── */}
          {(activeTab === 'all' || activeTab === 'guests') && (
            <div>
              {activeTab === 'all' && (
                <h3 className="font-display font-bold text-crimson text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span>📸</span>
                  <span>Live Photos From Wedding Guests (అతిథుల చిత్రమాలిక)</span>
                </h3>
              )}

              {guestPhotos.length === 0 ? (
                <div className="text-center py-12 rounded-3xl bg-white border border-gold/30 p-6 space-y-3">
                  <span className="text-4xl animate-bounce">📷</span>
                  <p className="font-display font-bold text-crimson text-base">
                    Be the First to Snap a Wedding Selfie!
                  </p>
                  <p className="font-body text-xs text-[#7a4a4a] max-w-md mx-auto">
                    Take a live selfie with our royal photo booth filters and post it directly to Mohan &amp; Leepika's wedding album.
                  </p>
                  <button
                    onClick={() => setIsPhotoBoothOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-crimson text-gold-light font-display text-xs font-bold hover:bg-crimson-dark shadow-md"
                  >
                    📸 Open Camera &amp; Snap Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {guestPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl overflow-hidden bg-white border border-gold/35 shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <div
                        className="relative w-full aspect-square overflow-hidden cursor-pointer bg-[#fdf6e8]"
                        onClick={() => setLightbox(item.photo_url)}
                      >
                        <img
                          src={item.photo_url}
                          alt={item.caption || item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-display font-bold text-crimson text-xs truncate">
                            {item.name}
                          </p>
                          {item.caption && (
                            <p className="font-body text-[11px] text-[#5c0a0a] line-clamp-2 italic">
                              "{item.caption}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gold/15 text-[10px]">
                          <span className="text-[#9b7b1b] font-medium">Guest Snap</span>
                          <button
                            onClick={() => handleLike(item.id)}
                            className={`flex items-center gap-1 font-display font-semibold transition-transform active:scale-95 ${
                              likedPhotoIds.has(item.id) ? 'text-crimson' : 'text-[#7a4a4a] hover:text-crimson'
                            }`}
                          >
                            <span>{likedPhotoIds.has(item.id) ? '❤️' : '🤍'}</span>
                            <span>{item.likes || 1}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── 3. Lightbox Modal ── */}
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

      {/* ── 4. 📸 Snapchat-Style Wedding Photo Booth Camera Modal ── */}
      <PhotoBoothModal
        isOpen={isPhotoBoothOpen}
        onClose={() => setIsPhotoBoothOpen(false)}
        onPhotoUploaded={loadGuestPhotos}
      />
    </section>
  )
}
