import { useState, useEffect, useRef } from 'react'
import {
  fetchLiveRsvps,
  fetchLiveWishes,
  fetchGuestPhotos,
  deleteLiveRsvp,
  deleteLiveWish,
  deleteGuestPhoto,
  toggleHideGuestPhoto,
  type RsvpRecord,
  type GuestPhotoItem,
} from '../../lib/supabase'
import type { WishItem } from '../../types/wedding'
import { weddingData } from '../../data/weddingData'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  // Passcode verification (Default: 2026)
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)

  // Data
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([])
  const [wishes, setWishes] = useState<WishItem[]>([])
  const [guestPhotos, setGuestPhotos] = useState<GuestPhotoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'rsvps' | 'photos' | 'media' | 'live'>('rsvps')
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'yes' | 'maybe' | 'no'>('all')
  const [photoFilter, setPhotoFilter] = useState<'all' | 'visible' | 'hidden'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<GuestPhotoItem | null>(null)

  // Live Stream Controls
  const [adminStreamUrl, setAdminStreamUrl] = useState(() => {
    return localStorage.getItem('wedding_live_stream_url') || weddingData.liveStream?.streamUrl || ''
  })
  const [adminIsLive, setAdminIsLive] = useState(() => {
    const saved = localStorage.getItem('wedding_is_live_active')
    return saved !== null ? saved === 'true' : Boolean(weddingData.liveStream?.isLive)
  })
  const [liveSaveSuccess, setLiveSaveSuccess] = useState(false)

  // Audio playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '2026') {
      setIsAuthenticated(true)
      setPinError(false)
      loadAdminData()
    } else {
      setPinError(true)
    }
  }

  const loadAdminData = async () => {
    setLoading(true)
    const [liveRsvps, liveWishes, livePhotos] = await Promise.all([
      fetchLiveRsvps(),
      fetchLiveWishes(weddingData.initialWishes),
      fetchGuestPhotos(true), // Load all photos including hidden for Admin
    ])
    setRsvps(liveRsvps)
    setWishes(liveWishes)
    setGuestPhotos(livePhotos)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAdminData()

      const handleUpdate = () => {
        loadAdminData()
      }

      window.addEventListener('wedding_data_updated', handleUpdate)
      window.addEventListener('wedding_photos_updated', handleUpdate)
      window.addEventListener('storage', handleUpdate)
      window.addEventListener('focus', handleUpdate)

      return () => {
        window.removeEventListener('wedding_data_updated', handleUpdate)
        window.removeEventListener('wedding_photos_updated', handleUpdate)
        window.removeEventListener('storage', handleUpdate)
        window.removeEventListener('focus', handleUpdate)
      }
    }
  }, [isOpen, isAuthenticated])

  // Headcount calculation
  const totalGuestsAttending = rsvps
    .filter((r) => r.attendance === 'yes')
    .reduce((sum, r) => sum + (parseInt(r.guests, 10) || 1), 0)

  const weddingCount = rsvps
    .filter((r) => r.attendance === 'yes' && (r.events === 'both' || r.events === 'wedding'))
    .reduce((sum, r) => sum + (parseInt(r.guests, 10) || 1), 0)

  const receptionCount = rsvps
    .filter((r) => r.attendance === 'yes' && (r.events === 'both' || r.events === 'reception'))
    .reduce((sum, r) => sum + (parseInt(r.guests, 10) || 1), 0)

  const voiceNotesCount = wishes.filter((w) => Boolean(w.audioUrl)).length
  const hiddenPhotosCount = guestPhotos.filter((p) => p.is_hidden).length
  const visiblePhotosCount = guestPhotos.filter((p) => !p.is_hidden).length

  // CSV Export for RSVPs
  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Guests', 'Attendance', 'Events', 'Dietary', 'Message', 'Date']
    const rows = rsvps.map((r) => [
      `"${r.name}"`,
      `"${r.phone}"`,
      r.guests,
      r.attendance,
      r.events,
      r.dietary,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.created_at || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wedding_rsvps_mohan_leepika_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Audio Playback
  const togglePlayAudio = (id: string, url: string) => {
    if (playingAudioId === id) {
      audioPlayerRef.current?.pause()
      setPlayingAudioId(null)
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
      const audio = new Audio(url)
      audioPlayerRef.current = audio
      setPlayingAudioId(id)
      audio.play()
      audio.onended = () => setPlayingAudioId(null)
      audio.onerror = () => setPlayingAudioId(null)
    }
  }

  const handleDeleteRsvp = async (id?: string) => {
    if (!id) return
    if (confirm('Are you sure you want to delete this RSVP?')) {
      await deleteLiveRsvp(id)
      setRsvps((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const handleDeleteWish = async (id: string) => {
    if (confirm('Are you sure you want to delete this wish?')) {
      await deleteLiveWish(id)
      setWishes((prev) => prev.filter((w) => w.id !== id))
    }
  }

  // 🙈 Hide / Unhide Photo Toggle Action
  const handleToggleHide = async (photoId: string, currentlyHidden?: boolean) => {
    const nextHiddenState = !currentlyHidden
    await toggleHideGuestPhoto(photoId, nextHiddenState)
    setGuestPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, is_hidden: nextHiddenState } : p))
    )
    if (selectedPhotoPreview?.id === photoId) {
      setSelectedPhotoPreview((prev) => (prev ? { ...prev, is_hidden: nextHiddenState } : null))
    }
  }

  // 🗑️ Delete Guest Photo Action
  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Are you sure you want to permanently delete this guest photo?')) {
      await deleteGuestPhoto(photoId)
      setGuestPhotos((prev) => prev.filter((p) => p.id !== photoId))
      if (selectedPhotoPreview?.id === photoId) {
        setSelectedPhotoPreview(null)
      }
      // Update local storage cache and dispatch event for gallery update
      const existing: GuestPhotoItem[] = JSON.parse(localStorage.getItem('wedding_guest_photos') || '[]')
      localStorage.setItem(
        'wedding_guest_photos',
        JSON.stringify(existing.filter((p) => p.id !== photoId))
      )
      window.dispatchEvent(new Event('wedding_photos_updated'))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#fdfaf2] border-2 border-gold rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/30 bg-[#f5ede1]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👑</span>
            <div>
              <h2 className="font-display font-bold text-crimson text-lg">
                Wedding Family Admin Portal
              </h2>
              <p className="font-telugu text-gold-dark text-xs font-semibold">
                మోహన్ &amp; లీపిక వివాహ అతిథుల నివేదిక &amp; ఫోటోల నిర్వహణ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-crimson text-white font-bold flex items-center justify-center hover:bg-crimson-dark"
          >
            ✕
          </button>
        </div>

        {/* ── 1. PIN Lock Screen ── */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/50 flex items-center justify-center text-3xl">
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-crimson text-xl">
                Family Security PIN Required
              </h3>
              <p className="font-body text-xs text-[#7a4a4a] max-w-sm">
                Enter your 4-digit wedding passcode to access private guest RSVPs, guest photos, and voice blessings.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4 w-full max-w-xs">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (e.g. 2026)"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl border-2 border-gold/50 focus:border-crimson focus:outline-none bg-white shadow-inner"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-600 font-semibold animate-pulse">
                  Incorrect PIN. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-full font-display text-xs uppercase tracking-widest font-bold text-white bg-crimson hover:bg-crimson-dark shadow-md"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* ── 2. Authenticated Dashboard Content ── */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-2xl bg-white border border-gold/35 p-3.5 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{totalGuestsAttending}</p>
                <p className="font-display text-[10.5px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Attending Guests
                </p>
                <p className="text-[9px] text-[#7a4a4a]">హాజరయ్యే అతిథులు</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-3.5 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{weddingCount}</p>
                <p className="font-display text-[10.5px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Sumuhurtham (Hyd)
                </p>
                <p className="text-[9px] text-[#7a4a4a]">కళ్యాణ మహోత్సవం</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-3.5 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{receptionCount}</p>
                <p className="font-display text-[10.5px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Reception (Vizag)
                </p>
                <p className="text-[9px] text-[#7a4a4a]">విశాఖపట్నం విందు</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-3.5 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{guestPhotos.length}</p>
                <p className="font-display text-[10.5px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  📸 Guest Snaps
                </p>
                <p className="text-[9px] text-[#7a4a4a]">{visiblePhotosCount} Live · {hiddenPhotosCount} Hidden</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-3.5 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{voiceNotesCount}</p>
                <p className="font-display text-[10.5px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Voice Blessings
                </p>
                <p className="text-[9px] text-[#7a4a4a]">ఆడియో సందేశాలు</p>
              </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gold/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('rsvps')}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                    activeTab === 'rsvps'
                      ? 'bg-crimson text-gold-light shadow-md'
                      : 'text-[#5c0a0a] hover:bg-gold/10'
                  }`}
                >
                  📋 Guest RSVPs ({rsvps.length})
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                    activeTab === 'photos'
                      ? 'bg-crimson text-gold-light shadow-md'
                      : 'text-[#5c0a0a] hover:bg-gold/10'
                  }`}
                >
                  📸 Guest Photos Moderation ({guestPhotos.length})
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                    activeTab === 'media'
                      ? 'bg-crimson text-gold-light shadow-md'
                      : 'text-[#5c0a0a] hover:bg-gold/10'
                  }`}
                >
                  🎙️ Voice &amp; Video Capsule ({wishes.length})
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'live'
                      ? 'bg-red-700 text-white shadow-md'
                      : 'text-red-700 hover:bg-red-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>🔴 Live Stream Webcast</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAdminData}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full border border-gold/40 text-[#5c0a0a] text-xs font-display hover:bg-gold/10"
                >
                  {loading ? 'Refreshing...' : '🔄 Refresh'}
                </button>
                {activeTab === 'rsvps' && (
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ffd700] to-[#c9a84c] text-[#3a0505] text-xs font-display font-bold shadow-sm hover:scale-105 transition-all"
                  >
                    📥 Export CSV (Excel)
                  </button>
                )}
              </div>
            </div>

            {/* ── Tab 1: RSVPs Table ── */}
            {activeTab === 'rsvps' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {['all', 'yes', 'maybe', 'no'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setRsvpFilter(filter as any)}
                        className={`px-3 py-1 rounded-full text-[11px] font-display capitalize ${
                          rsvpFilter === filter ? 'bg-gold/30 text-crimson font-bold' : 'text-[#7a4a4a]'
                        }`}
                      >
                        {filter === 'all' ? 'All' : filter === 'yes' ? 'Attending' : filter === 'maybe' ? 'Tentative' : 'Declined'}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gold/40 text-xs bg-white focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="rounded-2xl border border-gold/30 overflow-x-auto bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5ede1] text-crimson font-display uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Guest Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Count</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Ceremonies</th>
                        <th className="p-3">Dietary</th>
                        <th className="p-3">Message</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/15">
                      {rsvps
                        .filter((r) => {
                          if (rsvpFilter !== 'all' && r.attendance !== rsvpFilter) return false
                          if (searchQuery) {
                            return (
                              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.phone.includes(searchQuery)
                            )
                          }
                          return true
                        })
                        .map((r, i) => (
                          <tr key={r.id || i} className="hover:bg-gold/5 transition-colors">
                            <td className="p-3 font-semibold text-crimson">{r.name}</td>
                            <td className="p-3 text-[#5c0a0a] font-mono">{r.phone}</td>
                            <td className="p-3 font-bold text-center">{r.guests}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.attendance === 'yes'
                                    ? 'bg-green-100 text-green-800'
                                    : r.attendance === 'maybe'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {r.attendance === 'yes' ? 'Attending' : r.attendance === 'maybe' ? 'Tentative' : 'Declined'}
                              </span>
                            </td>
                            <td className="p-3 text-[#633a3a] capitalize">{r.events}</td>
                            <td className="p-3 text-[#633a3a] capitalize">{r.dietary}</td>
                            <td className="p-3 text-[#7a4a4a] max-w-[200px] truncate">{r.message || '—'}</td>
                            <td className="p-3 text-right">
                              {r.id && (
                                <button
                                  onClick={() => handleDeleteRsvp(r.id)}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                  title="Delete RSVP"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Tab 2: 📸 Guest Photos Moderation & Hide Access ── */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'all', label: `All (${guestPhotos.length})` },
                      { id: 'visible', label: `🟢 Public (${visiblePhotosCount})` },
                      { id: 'hidden', label: `🙈 Hidden (${hiddenPhotosCount})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setPhotoFilter(tab.id as any)}
                        className={`px-3 py-1 rounded-full text-[11px] font-display font-semibold transition-all ${
                          photoFilter === tab.id
                            ? 'bg-gold/30 text-crimson font-bold shadow-xs'
                            : 'text-[#7a4a4a] hover:bg-gold/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <p className="font-display text-xs text-[#5c0a0a] italic">
                    💡 Hiding a photo removes it from the public gallery while keeping it safely preserved in your private album.
                  </p>
                </div>

                {guestPhotos.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gold/30 space-y-2">
                    <span className="text-3xl">📷</span>
                    <p className="font-display font-bold text-crimson text-sm">
                      No Guest Photos Uploaded Yet
                    </p>
                    <p className="text-xs text-[#7a4a4a]">
                      Photos uploaded by wedding guests in the Captured Moments section will appear here for moderation.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {guestPhotos
                      .filter((photo) => {
                        if (photoFilter === 'visible') return !photo.is_hidden
                        if (photoFilter === 'hidden') return photo.is_hidden
                        return true
                      })
                      .map((photo) => (
                        <div
                          key={photo.id}
                          className={`group relative rounded-2xl overflow-hidden bg-white border shadow-sm flex flex-col justify-between transition-all ${
                            photo.is_hidden ? 'border-amber-400/80 bg-amber-50/20' : 'border-gold/40'
                          }`}
                        >
                          <div
                            className="relative aspect-square cursor-pointer overflow-hidden bg-[#fdf6e8]"
                            onClick={() => setSelectedPhotoPreview(photo)}
                          >
                            <img
                              src={photo.photo_url}
                              alt={photo.caption || photo.name}
                              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                photo.is_hidden ? 'opacity-70 grayscale-30' : ''
                              }`}
                            />
                            {/* Status Badge */}
                            <div className="absolute top-2 left-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md ${
                                  photo.is_hidden
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-green-600 text-white'
                                }`}
                              >
                                {photo.is_hidden ? '🙈 Hidden from Public' : '🟢 Public'}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 space-y-1.5 bg-white">
                            <div>
                              <p className="font-display font-bold text-crimson text-xs truncate">
                                {photo.name}
                              </p>
                              {photo.caption && (
                                <p className="font-body text-[11px] text-[#5c0a0a] line-clamp-1 italic">
                                  "{photo.caption}"
                                </p>
                              )}
                            </div>

                            {/* Moderation Controls: Hide/Unhide & Delete */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-gold/15">
                              <button
                                onClick={() => handleToggleHide(photo.id, photo.is_hidden)}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                                  photo.is_hidden
                                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                }`}
                                title={photo.is_hidden ? 'Make photo visible in public gallery' : 'Hide photo from public gallery'}
                              >
                                <span>{photo.is_hidden ? '👁️ Unhide' : '🙈 Hide'}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <a
                                  href={photo.photo_url}
                                  download={`guest_photo_${photo.name}.webp`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gold-dark hover:text-crimson font-bold text-[11px]"
                                  title="Download Photo"
                                >
                                  ⬇
                                </a>
                                <button
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold"
                                  title="Permanently Delete Photo"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab 3: Media & Voice Blessings Vault ── */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishes.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-2xl bg-white border border-gold/35 p-4 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-bold text-crimson text-sm">{w.name}</h4>
                          <p className="text-xs text-gold-dark font-medium">
                            {w.relation} {w.location ? `· 📍 ${w.location}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteWish(w.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                          title="Delete Wish"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="font-body text-xs text-[#3d1a1a] italic">"{w.message}"</p>

                      {/* Audio Note Player */}
                      {w.audioUrl && (
                        <div className="flex items-center justify-between bg-gold/15 rounded-xl p-2.5 border border-gold/30">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => togglePlayAudio(w.id, w.audioUrl!)}
                              className="w-8 h-8 rounded-full bg-crimson text-gold-light flex items-center justify-center text-xs font-bold shadow"
                            >
                              {playingAudioId === w.id ? '⏸' : '▶'}
                            </button>
                            <div>
                              <p className="font-display text-xs font-bold text-crimson">🎙️ Voice Blessing</p>
                              <p className="text-[10px] text-[#7a4a4a]">{w.audioDuration || 24} seconds</p>
                            </div>
                          </div>
                          <a
                            href={w.audioUrl}
                            download={`voice_blessing_${w.name}.webm`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gold-dark hover:underline font-semibold"
                          >
                            ⬇ Download
                          </a>
                        </div>
                      )}

                      {/* Video Link / Photo Preview */}
                      <div className="flex items-center gap-2 pt-1">
                        {w.videoUrl && (
                          <a
                            href={w.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full bg-gold/15 text-crimson text-xs font-display font-semibold hover:bg-gold/25"
                          >
                            🎬 Watch Video Link
                          </a>
                        )}
                        {w.photoUrl && (
                          <a
                            href={w.photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full bg-gold/15 text-crimson text-xs font-display font-semibold hover:bg-gold/25"
                          >
                            📸 View Photo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab 4: Live Mandapam Webcast Control ── */}
            {activeTab === 'live' && (
              <div className="space-y-5 max-w-xl mx-auto bg-white p-6 rounded-3xl border border-gold/40 shadow-sm">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-2">
                    🔴
                  </div>
                  <h3 className="font-display font-bold text-crimson text-lg">
                    Live Mandapam Webcast Stream Manager
                  </h3>
                  <p className="font-body text-xs text-[#7a4a4a]">
                    Broadcast your wedding live to remote family &amp; friends around the world.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    localStorage.setItem('wedding_live_stream_url', adminStreamUrl.trim())
                    localStorage.setItem('wedding_is_live_active', adminIsLive ? 'true' : 'false')
                    window.dispatchEvent(new Event('live_stream_updated'))
                    setLiveSaveSuccess(true)
                    setTimeout(() => setLiveSaveSuccess(false), 3000)
                  }}
                  className="space-y-4"
                >
                  {/* Toggle Is Live */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gold/10 border border-gold/30">
                    <div>
                      <p className="font-display font-bold text-xs text-[#3d0808]">
                        Live Broadcast Status
                      </p>
                      <p className="text-[11px] text-[#7a4a4a]">
                        {adminIsLive ? '🔴 Currently marked as LIVE NOW' : '⏳ Currently in Upcoming / Countdown state'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAdminIsLive(!adminIsLive)}
                      className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                        adminIsLive
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {adminIsLive ? '🔴 Marked LIVE' : '⏳ Marked OFFLINE'}
                    </button>
                  </div>

                  {/* Stream URL Input */}
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1 font-bold">
                      YouTube Live / Stream Video Link
                    </label>
                    <input
                      type="url"
                      value={adminStreamUrl}
                      onChange={(e) => setAdminStreamUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full rounded-xl px-4 py-2.5 font-body text-xs sm:text-sm text-[#1c0a0a] bg-[#fdfaf2] border border-gold/40 focus:outline-none focus:border-crimson"
                      required
                    />
                    <p className="text-[10px] text-gold-dark mt-1 italic">
                      Paste the YouTube Live share link, video link, or live embed URL.
                    </p>
                  </div>

                  {liveSaveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center animate-fade-in">
                      ✓ Live Stream Settings Updated! The public website is now synchronized.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full font-display text-xs uppercase tracking-widest font-bold text-[#3a0505] bg-gradient-to-r from-gold via-gold-bright to-gold hover:brightness-110 shadow-md transition-all active:scale-95"
                  >
                    Save &amp; Update Live Mandapam Webcast
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ── Photo Preview Modal in Admin ── */}
      {selectedPhotoPreview && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 cursor-pointer"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-w-lg w-full bg-[#fdfaf2] p-5 rounded-3xl border-2 border-gold space-y-3 cursor-default">
            <div className="flex items-center justify-between pb-2 border-b border-gold/30">
              <div>
                <h4 className="font-display font-bold text-crimson text-sm">
                  Photo by {selectedPhotoPreview.name}
                </h4>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                    selectedPhotoPreview.is_hidden
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {selectedPhotoPreview.is_hidden ? '🙈 Currently Hidden from Public Gallery' : '🟢 Publicly Visible'}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhotoPreview(null)}
                className="w-7 h-7 rounded-full bg-crimson text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedPhotoPreview.photo_url}
              alt={selectedPhotoPreview.name}
              className="w-full max-h-[55vh] object-contain rounded-2xl shadow-md mx-auto"
            />
            {selectedPhotoPreview.caption && (
              <p className="font-body text-xs text-[#5c0a0a] text-center italic">
                "{selectedPhotoPreview.caption}"
              </p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gold/20">
              <button
                onClick={() => handleToggleHide(selectedPhotoPreview.id, selectedPhotoPreview.is_hidden)}
                className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                  selectedPhotoPreview.is_hidden
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {selectedPhotoPreview.is_hidden ? '👁️ Unhide (Show to Public)' : '🙈 Hide from Public Gallery'}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPhotoPreview.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-gold/20 text-crimson text-xs font-display font-semibold"
                >
                  ⬇ Full Res
                </a>
                <button
                  onClick={() => handleDeletePhoto(selectedPhotoPreview.id)}
                  className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-display font-bold hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
