import { useRef, useState, useEffect } from 'react'
import { SectionLabel } from '../common/GoldDivider'
import { weddingData } from '../../data/weddingData'
import {
  fetchGuestPhotos,
  submitGuestPhoto,
  likeGuestPhoto,
  type GuestPhotoItem,
} from '../../lib/supabase'
import { compressImage } from '../../lib/imageCompressor'

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [uploaderCaption, setUploaderCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set())

  const loadGuestPhotos = async () => {
    const photos = await fetchGuestPhotos()
    setGuestPhotos(photos)
  }

  useEffect(() => {
    loadGuestPhotos()
    window.addEventListener('wedding_photos_updated', loadGuestPhotos)
    return () => window.removeEventListener('wedding_photos_updated', loadGuestPhotos)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    try {
      // ⚡ High-speed client-side image compression (downsizes 12MB raw photo to ~400KB in ~100ms)
      const compressedBlob = await compressImage(selectedFile, 1600, 1600, 0.82)
      await submitGuestPhoto(uploaderName, uploaderCaption, compressedBlob)

      // Reset and close modal
      setSelectedFile(null)
      setPhotoPreview(null)
      setUploaderName('')
      setUploaderCaption('')
      setIsUploadModalOpen(false)
      loadGuestPhotos()
    } catch (err) {
      alert('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

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
          <SectionLabel title="Captured Moments & Guest Snaps" sub="Memories In The Making" />

          {/* Subtitle description */}
          <p className="text-center font-display italic text-xs sm:text-sm text-[#7a4a4a] max-w-xl mx-auto mb-8 -mt-6">
            "Browse official moments or snap and share your own live photos from the wedding celebration to cherish forever."
          </p>

          {/* Gallery Header Controls: Tabs & 1-Tap Camera Upload Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-3 border-b border-gold/30">
            <div className="flex items-center gap-2">
              {[
                { id: 'all' as const, label: `All Moments (${gallery.length + guestPhotos.length})` },
                { id: 'official' as const, label: `Official (${gallery.length})` },
                { id: 'guests' as const, label: `📸 Guest Snaps (${guestPhotos.length})` },
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

            {/* 📸 1-Tap Live Camera Upload CTA */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] hover:brightness-110 shadow-md shadow-gold/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="text-sm">📸</span>
              <span>Upload / Snap a Photo</span>
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
                  <span className="text-4xl">📷</span>
                  <p className="font-display font-bold text-crimson text-base">
                    Be the First to Share a Wedding Photo!
                  </p>
                  <p className="font-body text-xs text-[#7a4a4a] max-w-md mx-auto">
                    Take a selfie at the mandapam or reception and upload it here to contribute to Mohan &amp; Leepika's universal photo album.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-crimson text-gold-light font-display text-xs font-bold hover:bg-crimson-dark shadow-md"
                  >
                    📸 Snap &amp; Upload Now
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
                          <span className="text-[#9b7b1b] font-medium">Guest Photo</span>
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

      {/* ── 4. 📸 Guest Photo Upload Modal ── */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#fdfaf2] p-6 rounded-3xl border-2 border-gold shadow-2xl space-y-4 cursor-default modal-luxury-animation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gold/30">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="font-display font-bold text-crimson text-base">
                  Share a Wedding Moment
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-crimson text-white text-xs font-bold hover:bg-crimson-dark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="font-display text-crimson text-[10px] uppercase tracking-wider block mb-1 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="e.g. Anand & Divya"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-gold/40 bg-white focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="font-display text-crimson text-[10px] uppercase tracking-wider block mb-1 font-semibold">
                  Short Caption / Memory Note (Optional)
                </label>
                <input
                  type="text"
                  value={uploaderCaption}
                  onChange={(e) => setUploaderCaption(e.target.value)}
                  placeholder="e.g. Sangeet dance moments with Mohan bro!"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-gold/40 bg-white focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="font-display text-crimson text-[10px] uppercase tracking-wider block mb-1 font-semibold">
                  Select Photo or Snap Live with Camera *
                </label>
                <label className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-gold/60 p-6 flex flex-col items-center justify-center gap-2 bg-[#fefbf3] hover:bg-gold/10 transition-colors">
                  <span className="text-3xl">📷</span>
                  <span className="font-display text-xs font-bold text-crimson">
                    {selectedFile ? '✓ Photo Selected (Tap to Change)' : 'Tap to Open Camera or Gallery'}
                  </span>
                  <span className="text-[10px] text-[#7a4a4a]">
                    Auto-compressed in ~0.1s for high speed upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {photoPreview && (
                <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden border border-gold/50 shadow-md">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPhotoPreview(null) }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-crimson text-white text-[10px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full py-3 rounded-full font-display text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark hover:brightness-110 shadow-lg shadow-crimson/25 transition-all duration-300 disabled:opacity-50"
              >
                {uploading ? '⚡ Compressing & Uploading...' : '📸 Post to Wedding Album'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
