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

type GalleryViewMode = 'palace-wall' | 'polaroid-board' | 'spotlight'
type FilterCategory = 'all' | 'couple' | 'guests' | 'trending'

export function GallerySection() {
  const [ref, visible] = useInView()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<GalleryViewMode>('palace-wall')
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  // Guest Photos Stream
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoItem[]>([])
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false)
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // Spotlight Slideshow State
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [isSpotlightPlaying, setIsSpotlightPlaying] = useState(true)

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
      likes: 128,
      created_at: 'Official Portrait',
    },
  ]

  const allDisplayPhotos = [...officialMoments, ...guestPhotos]
    .filter((p) => {
      // Category filter
      if (activeFilter === 'couple' && p.id !== 'official-couple') return false
      if (activeFilter === 'guests' && p.id === 'official-couple') return false
      if (activeFilter === 'trending' && (p.likes || 0) < 2) return true
      return true
    })
    .sort((a, b) => {
      if (activeFilter === 'trending') return (b.likes || 0) - (a.likes || 0)
      return 0
    })
    .filter((p) => {
      if (!searchQuery.trim()) return true
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })

  // Spotlight Auto-play
  useEffect(() => {
    if (viewMode !== 'spotlight' || !isSpotlightPlaying || allDisplayPhotos.length <= 1) return
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % allDisplayPhotos.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [viewMode, isSpotlightPlaying, allDisplayPhotos.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allDisplayPhotos.length : 0))
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + allDisplayPhotos.length) % allDisplayPhotos.length : 0
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, allDisplayPhotos.length])

  const currentLightboxPhoto =
    lightboxIndex !== null && allDisplayPhotos[lightboxIndex]
      ? allDisplayPhotos[lightboxIndex]
      : null

  const totalHearts = allDisplayPhotos.reduce((acc, curr) => acc + (curr.likes || 1), 0)

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
          {/* ── Grand Section Header ── */}
          <SectionLabel title="Royal Wedding Gallery & Memory Wall" sub="జ్ఞాపకాల చిత్రమాలిక · Cherished Moments" />

          <p className="text-center font-display italic text-xs sm:text-sm text-[#7a4a4a] max-w-xl mx-auto mb-8 -mt-6">
            "A living digital exhibition of memories, rituals, and guest snaps celebrating the union of Mohan Praneeth &amp; Leepika."
          </p>

          {/* ── 💎 Palace Control Bar (View Switcher, Filters & Live Stats) ── */}
          <div className="mb-6 bg-[#fffbf2]/95 backdrop-blur-md p-4 rounded-3xl border border-gold/40 shadow-xl space-y-4">
            
            {/* Row 1: Live Stats & Snap Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gold/20">
              <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
                {/* Live Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-display font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Wedding Wall</span>
                </div>

                {/* Counter Pills */}
                <div className="flex items-center gap-2 text-xs font-display text-crimson font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                    🖼️ {allDisplayPhotos.length} Moments
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-crimson">
                    ❤️ {totalHearts} Loves
                  </span>
                </div>
              </div>

              {/* 📸 1-Tap Snapchat Photo Booth Trigger */}
              <button
                onClick={() => setIsPhotoBoothOpen(true)}
                className="px-5 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] hover:brightness-110 shadow-lg shadow-gold/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span className="text-base group-hover:rotate-12 transition-transform">📸</span>
                <span>Snap Selfie / Upload to Wall</span>
              </button>
            </div>

            {/* Row 2: View Mode Switcher + Filter Categories + Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              
              {/* 🎨 Luxury View Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#f4e8cb] p-1 rounded-2xl border border-gold/30">
                {[
                  { id: 'palace-wall' as const, label: '👑 Palace Wall', icon: '🏛️' },
                  { id: 'polaroid-board' as const, label: '🎞️ Polaroid Board', icon: '📎' },
                  { id: 'spotlight' as const, label: '🎬 Spotlight Slideshow', icon: '✨' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-display transition-all flex items-center gap-1.5 ${
                      viewMode === mode.id
                        ? 'bg-crimson text-gold-light font-bold shadow-md'
                        : 'text-[#5c0a0a] hover:bg-gold/15 font-semibold'
                    }`}
                  >
                    <span>{mode.icon}</span>
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all' as const, label: 'All' },
                  { id: 'couple' as const, label: '👑 Couple' },
                  { id: 'guests' as const, label: '📸 Guests' },
                  { id: 'trending' as const, label: '🔥 Most Loved' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1 rounded-full text-xs font-display transition-all ${
                      activeFilter === filter.id
                        ? 'bg-gold text-[#3a0505] font-bold shadow-sm'
                        : 'text-[#7a4a4a] hover:bg-gold/10 font-medium'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Instant Search Bar */}
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="🔍 Search moments by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 px-3.5 py-1.5 rounded-xl text-xs bg-white border border-gold/40 text-[#3d0808] placeholder-gold-dark/50 focus:outline-none focus:border-crimson shadow-inner"
                />
              </div>

            </div>

          </div>

          {/* ── 🏛️ Presentation Canvas ── */}
          
          {/* VIEW 1: Palace Wall (Museum Frame Grid with Zero-Gap Alignment) */}
          {viewMode === 'palace-wall' && (
            <div
              className="relative rounded-3xl overflow-hidden border-[3px] border-gold/70 shadow-2xl p-4 sm:p-7"
              style={{
                background:
                  'radial-gradient(ellipse 90% 70% at 50% 30%, #fffef8 0%, #fbf3e2 60%, #f4e4c4 100%)',
                boxShadow:
                  'inset 0 0 40px rgba(201, 168, 76, 0.2), 0 20px 50px rgba(61, 8, 8, 0.12)',
              }}
            >
              {/* Header Hanging Rail */}
              <div className="flex items-center justify-between border-b border-gold/30 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-sm border border-[#3d0808]/40" />
                  <span className="font-display font-bold text-crimson text-xs sm:text-sm tracking-wider uppercase">
                    ✦ Turupada Family Memory Gallery · జ్ఞాపకాల తోరణం ✦
                  </span>
                </div>
                <span className="font-telugu text-gold-dark text-xs font-semibold hidden sm:inline">
                  రాజసౌధ చిత్రమాలిక
                </span>
              </div>

              {/* Scrollable Frame Wall */}
              <div className="max-h-[580px] sm:max-h-[680px] overflow-y-auto pr-2 sm:pr-3 custom-gold-scrollbar">
                {allDisplayPhotos.length === 0 ? (
                  <div className="text-center py-16 space-y-4 my-auto">
                    <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-dashed border-gold/60 flex items-center justify-center text-4xl bg-white shadow-inner">
                      🖼️
                    </div>
                    <p className="font-display font-bold text-crimson text-base">
                      No moments found in this filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-1">
                    {allDisplayPhotos.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="group relative transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
                      >
                        {/* 🖼️ Luxury Wall Picture Frame Styling */}
                        <div
                          className="relative bg-white rounded-2xl p-2.5 sm:p-3 border-[5px] sm:border-[6px] border-[#4a0808] transition-all duration-300 group-hover:border-[#380505] flex flex-col justify-between h-full"
                          style={{
                            boxShadow:
                              '0 10px 24px rgba(61, 8, 8, 0.16), 0 3px 8px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255, 215, 0, 0.7)',
                          }}
                        >
                          {/* Top Hanging Brass Pin */}
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#c9a84c] to-[#ffd700] border border-[#3d0808] shadow-md z-10" />

                          {/* Inner Picture Matting (Passe-partout) with Perfect Uniform Aspect Ratio */}
                          <div
                            className="relative aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer bg-[#fdfaf2] border border-gold/30 shadow-inner group shrink-0"
                            onClick={() => setLightboxIndex(index)}
                          >
                            <img
                              src={item.photo_url}
                              alt={item.caption || item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />

                            {/* Hover View Magnifier Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                              <span className="px-3.5 py-1.5 rounded-full bg-gold text-[#3a0505] font-display text-xs font-bold shadow-lg flex items-center gap-1">
                                <span>🔍</span>
                                <span>View Full Photo</span>
                              </span>
                            </div>
                          </div>

                          {/* Bottom Brass Engraved Plaque Label */}
                          <div className="mt-2.5 pt-2 border-t border-gold/30 flex items-center justify-between min-h-[40px]">
                            <div className="min-w-0 pr-2 flex-1">
                              <p className="font-display font-bold text-crimson text-xs sm:text-sm truncate leading-tight">
                                {item.name}
                              </p>
                              {item.caption ? (
                                <p className="font-body text-[11px] text-[#5c0a0a] truncate italic leading-tight">
                                  "{item.caption}"
                                </p>
                              ) : (
                                <p className="font-body text-[10px] text-gold-dark italic leading-tight">
                                  Wedding Guest Moment
                                </p>
                              )}
                            </div>

                            {/* Actions: Download & Like Reaction */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={item.photo_url}
                                download={`wedding_photo_${item.name.replace(/\s+/g, '_')}.webp`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-gold-dark hover:text-crimson hover:bg-gold/15 transition-all text-xs font-bold"
                                title="Download high resolution photo"
                                onClick={(e) => e.stopPropagation()}
                              >
                                ⬇
                              </a>

                              <button
                                onClick={() => handleLike(item.id)}
                                className={`px-2.5 py-1 rounded-full text-xs font-display font-semibold transition-all active:scale-90 flex items-center gap-1 ${
                                  likedPhotoIds.has(item.id)
                                    ? 'bg-red-50 text-crimson border border-red-200 shadow-sm'
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
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {allDisplayPhotos.length > 4 && (
                <div className="mt-4 pt-2 border-t border-gold/20 text-center">
                  <p className="text-[11px] font-display text-[#7a4a4a] italic flex items-center justify-center gap-1">
                    <span>↕ Scroll inside this frame to view all moments</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: Polaroid Board (Organic, Warm & Festive with Washi Tape & Clothespins) */}
          {viewMode === 'polaroid-board' && (
            <div
              className="relative rounded-3xl overflow-hidden border-2 border-gold/50 shadow-2xl p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, #fbf7ee 0%, #f4ebd5 100%)',
              }}
            >
              <div className="max-h-[580px] sm:max-h-[680px] overflow-y-auto pr-2 custom-gold-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-4">
                  {allDisplayPhotos.map((item, index) => {
                    const tilt = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0'
                    return (
                      <div
                        key={item.id || index}
                        className={`group relative bg-white p-3.5 pb-5 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:-translate-y-2 cursor-pointer ${tilt} border border-gold/20 flex flex-col justify-between`}
                        onClick={() => setLightboxIndex(index)}
                      >
                        {/* Washi tape header */}
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#c9a84c]/40 backdrop-blur-sm border-t border-b border-gold/40 -rotate-2 rounded-sm shadow-sm" />

                        <div className="relative aspect-square w-full rounded overflow-hidden bg-[#faf7ef] border border-black/5 shadow-inner">
                          <img
                            src={item.photo_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="mt-3.5 px-1 flex items-end justify-between">
                          <div>
                            <p className="font-calligraphy text-crimson text-xl font-bold leading-none">
                              {item.name}
                            </p>
                            {item.caption && (
                              <p className="font-body text-[11px] text-[#7a4a4a] italic line-clamp-1 mt-0.5">
                                "{item.caption}"
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-display text-crimson font-bold">
                            ❤️ {item.likes || 1}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Spotlight Slideshow (Cinematic Theatre Showcase) */}
          {viewMode === 'spotlight' && allDisplayPhotos.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden bg-[#180303] border-2 border-gold/80 shadow-2xl p-4 sm:p-8 text-white">
              <div className="relative max-w-3xl mx-auto flex flex-col items-center">
                
                {/* Spotlight Main Viewport */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-2 border-gold shadow-2xl bg-black">
                  <img
                    src={allDisplayPhotos[spotlightIndex].photo_url}
                    alt={allDisplayPhotos[spotlightIndex].name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                  />

                  {/* Gradient Overlay & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-gold-light text-base sm:text-xl font-bold">
                          {allDisplayPhotos[spotlightIndex].name}
                        </h3>
                        {allDisplayPhotos[spotlightIndex].caption && (
                          <p className="font-body text-xs sm:text-sm text-parchment/90 italic">
                            "{allDisplayPhotos[spotlightIndex].caption}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(allDisplayPhotos[spotlightIndex].id)}
                          className="px-3 py-1 rounded-full bg-crimson/80 border border-gold/40 text-gold-light text-xs font-bold flex items-center gap-1 active:scale-95"
                        >
                          <span>❤️</span>
                          <span>{allDisplayPhotos[spotlightIndex].likes || 1}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spotlight Controls & Thumbnails Strip */}
                <div className="w-full mt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      setSpotlightIndex(
                        (prev) => (prev - 1 + allDisplayPhotos.length) % allDisplayPhotos.length
                      )
                    }
                    className="w-9 h-9 rounded-full bg-[#3d0808] border border-gold/60 text-gold-light font-bold flex items-center justify-center hover:bg-crimson transition-all"
                  >
                    ←
                  </button>

                  {/* Play / Pause Toggle */}
                  <button
                    onClick={() => setIsSpotlightPlaying(!isSpotlightPlaying)}
                    className="px-4 py-1.5 rounded-full bg-gold/20 border border-gold text-gold-light font-display text-xs font-bold"
                  >
                    {isSpotlightPlaying ? '⏸ Pause Slideshow' : '▶ Play Slideshow'}
                  </button>

                  <button
                    onClick={() =>
                      setSpotlightIndex((prev) => (prev + 1) % allDisplayPhotos.length)
                    }
                    className="w-9 h-9 rounded-full bg-[#3d0808] border border-gold/60 text-gold-light font-bold flex items-center justify-center hover:bg-crimson transition-all"
                  >
                    →
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── 🎬 Ultra-Deluxe HD Lightbox with Full Cinematic Viewer ── */}
      {currentLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0a0101]/95 backdrop-blur-2xl cursor-pointer"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[94vh] w-full flex flex-col items-center justify-center p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close & Navigation Pill */}
            <div className="w-full flex items-center justify-between mb-2 px-2 text-white">
              <span className="font-display text-xs text-gold-light font-bold">
                {lightboxIndex !== null ? lightboxIndex + 1 : 1} of {allDisplayPhotos.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-crimson text-white font-bold flex items-center justify-center hover:bg-crimson-dark text-xs shadow-lg"
              >
                ✕
              </button>
            </div>

            {/* Main Picture Frame in Lightbox */}
            <div className="relative border-4 border-gold/90 rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
              <img
                src={currentLightboxPhoto.photo_url}
                alt={currentLightboxPhoto.name}
                className="max-w-full max-h-[72vh] object-contain mx-auto"
              />

              {/* Prev / Next Floating Arrows */}
              {allDisplayPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(
                        (prev) =>
                          (prev !== null ? prev - 1 + allDisplayPhotos.length : 0) %
                          allDisplayPhotos.length
                      )
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-gold/70 text-white font-bold flex items-center justify-center hover:bg-crimson transition-all shadow-xl"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(
                        (prev) => (prev !== null ? (prev + 1) % allDisplayPhotos.length : 0)
                      )
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-gold/70 text-white font-bold flex items-center justify-center hover:bg-crimson transition-all shadow-xl"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Bottom Metadata Plaque & Download CTA */}
            <div className="mt-3 w-full max-w-xl bg-[#240303]/90 border border-gold/60 rounded-2xl p-3 sm:p-4 flex items-center justify-between text-white shadow-xl backdrop-blur-md">
              <div className="min-w-0 pr-3">
                <p className="font-display font-bold text-gold-light text-sm sm:text-base truncate">
                  {currentLightboxPhoto.name}
                </p>
                {currentLightboxPhoto.caption && (
                  <p className="font-body text-xs text-parchment/80 italic line-clamp-1">
                    "{currentLightboxPhoto.caption}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleLike(currentLightboxPhoto.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-display font-bold flex items-center gap-1 transition-transform active:scale-95 ${
                    likedPhotoIds.has(currentLightboxPhoto.id)
                      ? 'bg-crimson text-gold-light'
                      : 'bg-white/10 text-white hover:bg-crimson'
                  }`}
                >
                  <span>{likedPhotoIds.has(currentLightboxPhoto.id) ? '❤️' : '🤍'}</span>
                  <span>{currentLightboxPhoto.likes || 1}</span>
                </button>

                <a
                  href={currentLightboxPhoto.photo_url}
                  download={`wedding_photo_${currentLightboxPhoto.name.replace(/\s+/g, '_')}.webp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-[#3a0505] font-display text-xs font-bold hover:brightness-110 shadow-md flex items-center gap-1.5"
                >
                  <span>⬇</span>
                  <span>Download</span>
                </a>
              </div>
            </div>

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
