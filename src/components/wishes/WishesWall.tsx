import { useState, useRef, useEffect } from 'react'
import { SectionLabel } from '../common/GoldDivider'
import { OrnateCard } from '../common/OrnateCard'
import type { WishItem } from '../../types/wedding'
import { weddingData } from '../../data/weddingData'
import {
  isSupabaseConfigured,
  fetchLiveWishes,
  submitLiveWish,
  likeLiveWish,
  uploadWeddingMedia,
} from '../../lib/supabase'

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

export function WishesWall() {
  const [ref, visible] = useInView()
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    const saved = localStorage.getItem('wedding_wishes')
    return saved ? JSON.parse(saved) : weddingData.initialWishes
  })

  // Load live wishes from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchLiveWishes(weddingData.initialWishes).then((live) => {
        if (live && live.length > 0) {
          setWishes(live)
          localStorage.setItem('wedding_wishes', JSON.stringify(live))
        }
      })
    }
  }, [])

  // Form State
  const [form, setForm] = useState({
    name: '',
    relation: '',
    location: '',
    message: '',
    videoUrl: '',
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Media recorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<number | null>(null)

  // Active playing audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const activeAudioRef = useRef<HTMLAudioElement | null>(null)

  // Active video/photo modal
  const [modalMedia, setModalMedia] = useState<{ type: 'video' | 'photo'; url: string; title: string } | null>(null)

  // Filter Tab
  const [activeFilter, setActiveFilter] = useState<'all' | 'audio' | 'video' | 'photo'>('all')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const audioUrl = URL.createObjectURL(blob)
        setRecordedAudioUrl(audioUrl)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      alert('Microphone access is required to record a voice blessing. You can also type your message below.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }

  const deleteVoiceNote = () => {
    setAudioBlob(null)
    setRecordedAudioUrl(null)
    setRecordingTime(0)
    setIsRecording(false)
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
    }
  }

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Audio Playback
  const togglePlayAudio = (id: string, url: string) => {
    if (playingAudioId === id) {
      activeAudioRef.current?.pause()
      setPlayingAudioId(null)
    } else {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause()
      }
      const audio = new Audio(url)
      activeAudioRef.current = audio
      setPlayingAudioId(id)
      audio.play()
      audio.onended = () => setPlayingAudioId(null)
      audio.onerror = () => setPlayingAudioId(null)
    }
  }

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return
    setLikedIds((prev) => new Set(prev).add(id))
    
    // Update locally
    setWishes((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
      localStorage.setItem('wedding_wishes', JSON.stringify(updated))
      return updated
    })

    // Update in Supabase
    if (isSupabaseConfigured) {
      likeLiveWish(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setIsUploading(true)

    let finalAudioUrl: string | undefined = recordedAudioUrl || undefined
    let finalPhotoUrl: string | undefined = photoPreview || undefined

    // Upload to Supabase Storage if configured
    if (isSupabaseConfigured) {
      if (audioBlob) {
        const uploadedAudio = await uploadWeddingMedia(audioBlob, 'audio', 'webm')
        if (uploadedAudio) finalAudioUrl = uploadedAudio
      }
      if (photoFile) {
        const ext = photoFile.name.split('.').pop() || 'jpg'
        const uploadedPhoto = await uploadWeddingMedia(photoFile, 'photos', ext)
        if (uploadedPhoto) finalPhotoUrl = uploadedPhoto
      }
    }

    const wishPayload = {
      name: form.name.trim(),
      relation: form.relation.trim() || 'Well Wisher',
      location: form.location.trim() || undefined,
      message: form.message.trim() || 'Wishing Mohan Praneeth & Leepika lifelong joy and blessings!',
      audioUrl: finalAudioUrl,
      audioDuration: recordingTime > 0 ? recordingTime : undefined,
      videoUrl: form.videoUrl.trim() || undefined,
      photoUrl: finalPhotoUrl,
      likes: 1,
    }

    let createdWish: WishItem | null = null

    if (isSupabaseConfigured) {
      createdWish = await submitLiveWish(wishPayload)
    }

    const newWish: WishItem = createdWish || {
      id: Date.now().toString(),
      ...wishPayload,
      timeAgo: 'Just now',
    }

    const updated = [newWish, ...wishes]
    setWishes(updated)
    localStorage.setItem('wedding_wishes', JSON.stringify(updated))

    // Reset Form
    setForm({ name: '', relation: '', location: '', message: '', videoUrl: '' })
    setPhotoFile(null)
    setPhotoPreview(null)
    setAudioBlob(null)
    setRecordedAudioUrl(null)
    setRecordingTime(0)
    setIsUploading(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  // Filtered wishes
  const filteredWishes = wishes.filter((w) => {
    if (activeFilter === 'audio') return !!w.audioUrl
    if (activeFilter === 'video') return !!w.videoUrl
    if (activeFilter === 'photo') return !!w.photoUrl
    return true
  })

  const inputCls = `w-full rounded-xl px-4 py-2.5 font-body text-xs sm:text-sm text-[#1c0a0a] bg-white
    border border-gold/40 placeholder-[#7a4a4a]/45
    focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15 transition-all`

  return (
    <section id="wishes" className="relative bg-[#fefbf3] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 fan-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel
            title="Blessings, Voice & Memories"
            sub="ఆత్మీయుల శుభాకాంక్షలు &amp; జ్ఞాపకాలు"
          />

          {/* Intro description */}
          <p className="text-center font-display italic text-xs sm:text-sm text-[#7a4a4a] max-w-xl mx-auto mb-10 -mt-6">
            "Whether joining in person or celebrating from afar, share your voice blessings, video messages, and cherished memories with Mohan &amp; Leepika."
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── 1. Left Side: Submit Blessing & Media Recorder Form ── */}
            <div className="lg:col-span-5">
              <OrnateCard className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="font-display font-semibold text-crimson-dark text-base sm:text-lg">
                    Send a Voice Note, Video or Wish
                  </h3>
                  <p className="font-telugu text-[11px] sm:text-xs text-gold-dark font-medium">
                    మీ ఆశీస్సులు, మాటల సందేశం లేదా వీడియో పంపండి
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                      Your Name / కుటుంబం *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Suresh Kumar & Family"
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                        Relation / బంధుత్వం
                      </label>
                      <input
                        type="text"
                        value={form.relation}
                        onChange={(e) => setForm({ ...form, relation: e.target.value })}
                        placeholder="e.g. Uncle / Friend"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                        Location / నగరం
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Dallas, USA / Hyderabad"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                      Heartfelt Message / శుభాకాంక్షలు
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your wishes and blessings for the couple..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* ── Voice Blessing Recorder Box ── */}
                  <div className="rounded-2xl bg-[#fdf6e8] border border-gold/40 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-crimson">
                      <span className="flex items-center gap-1.5">
                        <span>🎙️</span>
                        <span>Record Voice Blessing (ఆడియో సందేశం)</span>
                      </span>
                      {isRecording && (
                        <span className="flex items-center gap-1 text-red-600 font-mono text-[11px] animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-red-600" />
                          00:{recordingTime.toString().padStart(2, '0')} / 01:00
                        </span>
                      )}
                    </div>

                    {!recordedAudioUrl ? (
                      <div>
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="w-full py-2.5 rounded-xl bg-white border border-gold/60 hover:bg-gold/15 text-crimson text-xs font-display font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                          >
                            <span className="text-base">🔴</span>
                            <span>Tap to Record Voice Blessing</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-display font-bold flex items-center justify-center gap-2 shadow-md transition-all animate-pulse"
                          >
                            <span>⏹</span>
                            <span>Stop Recording &amp; Attach (పూర్తయింది)</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-gold/40 shadow-sm">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePlayAudio('preview', recordedAudioUrl)}
                            className="w-8 h-8 rounded-full bg-gold/20 text-crimson flex items-center justify-center text-sm font-bold hover:bg-gold/30"
                          >
                            {playingAudioId === 'preview' ? '⏸' : '▶'}
                          </button>
                          <span className="font-display text-xs text-[#5c0a0a] font-medium">
                            Voice Note Ready ({recordingTime || 15}s)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={deleteVoiceNote}
                          className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Video Link or Photo Attachment ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                        🎬 Video Link (YouTube / Drive)
                      </label>
                      <input
                        type="url"
                        value={form.videoUrl}
                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                        📸 Memory Photo / చిత్రం
                      </label>
                      <label className="w-full cursor-pointer rounded-xl px-3 py-2 text-center text-xs font-display text-[#5c0a0a] bg-white border border-gold/40 hover:bg-gold/10 flex items-center justify-center gap-1.5 truncate">
                        <span>{photoPreview ? '✓ Photo Attached' : '📁 Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {photoPreview && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gold/40 shadow-sm mx-auto">
                      <img src={photoPreview} alt="Memory Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-crimson text-white text-[10px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 rounded-full font-display text-xs uppercase tracking-[0.2em] font-semibold text-white bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark hover:brightness-110 shadow-lg shadow-crimson/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>🌸</span>
                    <span>{isUploading ? 'Uploading & Sending...' : 'Send Blessing / సమర్పించండి'}</span>
                  </button>

                  {submitted && (
                    <div className="p-3 rounded-xl bg-gold/15 border border-gold/50 text-center animate-fadeUp">
                      <p className="font-telugu font-bold text-crimson text-xs">
                        ధన్యవాదాలు! మీ ఆశీస్సులు &amp; సందేశం నమోదయ్యాయి.
                      </p>
                      <p className="font-display italic text-[11px] text-[#7a4a4a]">
                        Thank you! Your heartfelt wish and media note have been shared with Mohan &amp; Leepika.
                      </p>
                    </div>
                  )}
                </form>
              </OrnateCard>
            </div>

            {/* ── 2. Right Side: Interactive Media Guestbook Wall ── */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Media Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gold/30">
                <div className="flex items-center gap-1 sm:gap-2">
                  {[
                    { id: 'all' as const, label: 'All Wishes' },
                    { id: 'audio' as const, label: '🎙️ Voice Notes' },
                    { id: 'video' as const, label: '🎬 Videos' },
                    { id: 'photo' as const, label: '📸 Memories' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-display transition-all ${
                        activeFilter === tab.id
                          ? 'bg-crimson text-gold-light font-bold shadow-sm'
                          : 'text-[#5c0a0a] hover:bg-gold/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="font-display text-xs text-gold-dark font-semibold">
                  {filteredWishes.length} {filteredWishes.length === 1 ? 'Blessing' : 'Blessings'}
                </span>
              </div>

              {/* Wishes List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredWishes.map((w) => (
                  <div
                    key={w.id}
                    className="relative rounded-2xl bg-[#fffdfa] border border-gold/35 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all space-y-3 group"
                  >
                    {/* Header: Name, Relation, Location */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-bold text-crimson text-sm sm:text-base">
                          {w.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gold-dark font-medium">
                          <span>{w.relation}</span>
                          {w.location && (
                            <>
                              <span>·</span>
                              <span className="text-[#633a3a]">📍 {w.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-display text-[10px] text-[#9b7b1b]/70">
                        {w.timeAgo}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="font-body text-xs sm:text-sm text-[#3d1a1a] leading-relaxed">
                      "{w.message}"
                    </p>

                    {/* ── Audio Voice Blessing Player (if attached) ── */}
                    {w.audioUrl && (
                      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/40 p-2.5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePlayAudio(w.id, w.audioUrl!)}
                            className="w-9 h-9 rounded-full bg-crimson text-gold-light flex items-center justify-center text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                          >
                            {playingAudioId === w.id ? '⏸' : '▶'}
                          </button>
                          <div>
                            <p className="font-display text-xs font-bold text-crimson">
                              🎙️ Voice Blessing Note
                            </p>
                            <p className="font-display text-[10px] text-[#7a4a4a]">
                              {playingAudioId === w.id ? 'Playing audio...' : `${w.audioDuration || 24} seconds`}
                            </p>
                          </div>
                        </div>

                        {/* Animated Equalizer Bars when playing */}
                        {playingAudioId === w.id && (
                          <div className="flex items-center gap-0.5">
                            {[12, 24, 16, 28, 14].map((h, i) => (
                              <span
                                key={i}
                                className="w-1 bg-crimson rounded-full animate-pulse"
                                style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Video / Photo Media Attachments ── */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {w.videoUrl && (
                        <button
                          onClick={() => setModalMedia({ type: 'video', url: w.videoUrl!, title: `${w.name}'s Video Wish` })}
                          className="px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 hover:bg-gold/25 text-crimson text-xs font-display font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <span>🎬</span>
                          <span>Watch Video Message</span>
                        </button>
                      )}

                      {w.photoUrl && (
                        <button
                          onClick={() => setModalMedia({ type: 'photo', url: w.photoUrl!, title: `Memory shared by ${w.name}` })}
                          className="px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 hover:bg-gold/25 text-crimson text-xs font-display font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <span>📸</span>
                          <span>View Memory Photo</span>
                        </button>
                      )}
                    </div>

                    {/* Footer: Likes */}
                    <div className="flex items-center justify-end pt-1 border-t border-gold/20">
                      <button
                        onClick={() => handleLike(w.id)}
                        className={`flex items-center gap-1.5 text-xs font-display transition-transform active:scale-95 ${
                          likedIds.has(w.id) ? 'text-crimson font-bold' : 'text-[#7a4a4a] hover:text-crimson'
                        }`}
                      >
                        <span>{likedIds.has(w.id) ? '❤️' : '🤍'}</span>
                        <span>{w.likes} Blessings</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── Modal for Video / Photo Preview ── */}
      {modalMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md cursor-pointer"
          onClick={() => setModalMedia(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#fdfaf2] p-4 sm:p-6 rounded-3xl shadow-2xl border-2 border-gold cursor-default modal-luxury-animation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gold/30">
              <h3 className="font-display font-bold text-crimson text-sm sm:text-base">
                {modalMedia.title}
              </h3>
              <button
                onClick={() => setModalMedia(null)}
                className="w-7 h-7 rounded-full bg-crimson text-white text-xs font-bold hover:bg-crimson-dark"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-center">
              {modalMedia.type === 'photo' ? (
                <img src={modalMedia.url} alt={modalMedia.title} className="w-full max-h-[60vh] object-contain rounded-2xl shadow-md mx-auto" />
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gold/15 text-3xl">
                    🎬
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#5c0a0a]">
                    Click below to open the video blessing:
                  </p>
                  <a
                    href={modalMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-crimson text-gold-light font-display text-xs font-bold hover:bg-crimson-dark shadow-md"
                  >
                    <span>▶</span>
                    <span>Open Video Message in New Tab</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
