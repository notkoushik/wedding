import { useState, useEffect, useRef } from 'react'
import {
  isSupabaseConfigured,
  fetchLiveRsvps,
  fetchLiveWishes,
  deleteLiveRsvp,
  deleteLiveWish,
  type RsvpRecord,
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
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'rsvps' | 'media' | 'wishes'>('rsvps')
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'yes' | 'maybe' | 'no'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    const [liveRsvps, liveWishes] = await Promise.all([
      fetchLiveRsvps(),
      fetchLiveWishes(weddingData.initialWishes),
    ])
    setRsvps(liveRsvps)
    setWishes(liveWishes)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAdminData()

      const handleUpdate = () => {
        loadAdminData()
      }

      window.addEventListener('wedding_data_updated', handleUpdate)
      window.addEventListener('storage', handleUpdate)
      window.addEventListener('focus', handleUpdate)

      return () => {
        window.removeEventListener('wedding_data_updated', handleUpdate)
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

  const pureVegCount = rsvps
    .filter((r) => r.attendance === 'yes' && r.dietary === 'pure-veg')
    .reduce((sum, r) => sum + (parseInt(r.guests, 10) || 1), 0)

  const voiceNotesCount = wishes.filter((w) => Boolean(w.audioUrl)).length

  // CSV Export
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
                మోహన్ &amp; లీపిక వివాహ అతిథుల నివేదిక
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
                Enter your 4-digit wedding passcode to access private guest RSVPs and voice blessings.
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white border border-gold/35 p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{totalGuestsAttending}</p>
                <p className="font-display text-[11px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Attending Guests
                </p>
                <p className="text-[10px] text-[#7a4a4a]">హాజరయ్యే అతిథులు</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{weddingCount}</p>
                <p className="font-display text-[11px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Sumuhurtham (Hyd)
                </p>
                <p className="text-[10px] text-[#7a4a4a]">కళ్యాణ మహోత్సవం</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{receptionCount}</p>
                <p className="font-display text-[11px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Reception (Vizag)
                </p>
                <p className="text-[10px] text-[#7a4a4a]">విశాఖపట్నం విందు</p>
              </div>

              <div className="rounded-2xl bg-white border border-gold/35 p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-crimson font-display">{voiceNotesCount}</p>
                <p className="font-display text-[11px] uppercase tracking-wider text-gold-dark font-semibold mt-0.5">
                  Voice Blessings
                </p>
                <p className="text-[10px] text-[#7a4a4a]">ఆడియో సందేశాలు</p>
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
                  onClick={() => setActiveTab('media')}
                  className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                    activeTab === 'media'
                      ? 'bg-crimson text-gold-light shadow-md'
                      : 'text-[#5c0a0a] hover:bg-gold/10'
                  }`}
                >
                  🎙️ Voice &amp; Video Capsule ({wishes.length})
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

            {/* ── Tab 2: Media & Voice Blessings Vault ── */}
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

          </div>
        )}

      </div>
    </div>
  )
}
