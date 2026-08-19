import { useState, useRef, useEffect } from 'react'
import defaultAlbumCover from '../../../Card/couple1.png'

interface Track {
  id: number
  titleTelugu: string
  titleEnglish: string
  subtitle: string
  url: string
  cover?: string
}

const PLAYLIST: Track[] = [
  {
    id: 1,
    titleTelugu: 'మంగళం భవంతు',
    titleEnglish: 'MANGALAM BHAVANTHU',
    subtitle: 'Traditional Shehnai & Nadaswaram',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-traditional-background-music-112194.mp3',
    cover: defaultAlbumCover,
  },
  {
    id: 2,
    titleTelugu: 'సీతారాముల కళ్యాణం',
    titleEnglish: 'SITARAMA KALYANAM',
    subtitle: 'Carnatic Classical Flute & Veena',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3523e4210.mp3?filename=relaxing-indian-flute-music-11100.mp3',
    cover: defaultAlbumCover,
  },
  {
    id: 3,
    titleTelugu: 'మాంగల్య ధారణ మహోత్సవం',
    titleEnglish: 'MAANGALYA DHARANA',
    subtitle: 'Auspicious Sumuhurtham Melodies',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_348a735160.mp3?filename=indian-instrumental-music-flute-sitar-tabla-7140.mp3',
    cover: defaultAlbumCover,
  },
]

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

interface MusicPlayerProps {
  customAlbumCover?: string
}

export function MusicPlayer({ customAlbumCover }: MusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.6)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLoop, setIsLoop] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrack = PLAYLIST[currentTrackIndex]
  const activeCover = customAlbumCover || currentTrack.cover || defaultAlbumCover

  useEffect(() => {
    const audio = new Audio(currentTrack.url)
    audio.volume = volume
    audio.loop = isLoop

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('ended', handleTrackEnded)

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [currentTrackIndex])

  const handleTrackEnded = () => {
    if (isLoop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      nextTrack()
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay policy handling
      })
    }
  }

  const prevTrack = () => {
    const newIdx = currentTrackIndex === 0 ? PLAYLIST.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(newIdx)
  }

  const nextTrack = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * PLAYLIST.length)
      setCurrentTrackIndex(randomIdx)
    } else {
      const newIdx = (currentTrackIndex + 1) % PLAYLIST.length
      setCurrentTrackIndex(newIdx)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      setIsMuted(val === 0)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume || 0.5
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  return (
    <>
      {/* ── 1. Floating Trigger Pill (Bottom Right / Center) ── */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-gold-light bg-gradient-to-r from-[#4a0606] via-[#2e0404] to-[#4a0606] border border-gold/60 shadow-2xl hover:border-gold hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
          style={{
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.35), 0 8px 25px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Animated Gold Aura Glow */}
          <div className="absolute inset-0 rounded-full animate-pulse opacity-25 bg-gradient-to-r from-gold-bright via-white to-gold-bright pointer-events-none" />

          {/* Left Lotus Icon */}
          <span className="text-xs text-gold">🌸</span>

          {/* Icon & Label */}
          <span className="text-sm">{isPlaying ? '🔊' : '🎵'}</span>
          <span className="font-display font-bold text-xs uppercase tracking-widest text-gold-light group-hover:text-white">
            {isPlaying ? 'Playing Shehnai' : 'Play Shehnai'}
          </span>

          {/* Right Lotus Icon */}
          <span className="text-xs text-gold">🌸</span>
        </button>
      </div>

      {/* ── 2. Expanded Royal Audio Player Console Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-[28px] sm:rounded-[36px] overflow-hidden p-3.5 sm:p-6 md:p-8 modal-luxury-animation my-auto shadow-2xl"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 40%, #4a0606 0%, #2e0303 55%, #190101 100%)',
              border: '2.5px solid rgba(255, 215, 0, 0.9)',
              boxShadow:
                '0 0 45px rgba(255, 215, 0, 0.45), 0 25px 70px rgba(0, 0, 0, 0.85), inset 0 0 20px rgba(255, 215, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Crown Lotus Ornament */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path
                  d="M 24 2 C 22 10, 14 16, 8 20 C 18 20, 22 14, 24 8 C 26 14, 30 20, 40 20 C 34 16, 26 10, 24 2 Z"
                  fill="url(#gold-grad-crown)"
                  stroke="#9b7b1b"
                  strokeWidth="0.5"
                />
                <defs>
                  <linearGradient id="gold-grad-crown" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff2a6" />
                    <stop offset="50%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#c9a84c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Bottom Crown Lotus Ornament */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none rotate-180">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path
                  d="M 24 2 C 22 10, 14 16, 8 20 C 18 20, 22 14, 24 8 C 26 14, 30 20, 40 20 C 34 16, 26 10, 24 2 Z"
                  fill="url(#gold-grad-crown)"
                  stroke="#9b7b1b"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Close / Minimize Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-gold/15 hover:bg-gold/30 border border-gold/50 text-gold-light hover:text-white flex items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-md"
            >
              ✕
            </button>

            {/* Background Subtle Fan Pattern */}
            <div className="absolute inset-0 fan-pattern opacity-10 pointer-events-none" />

            {/* ── Main 3-Column Player Layout ── */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column (Cols 1-4): Hanging Bells + Circular Album Cover in Mandala Halo */}
              <div className="md:col-span-4 flex items-center justify-center gap-3">
                {/* SVG Hanging Bells Line-Art */}
                <div className="hidden sm:block opacity-60">
                  <svg width="28" height="90" viewBox="0 0 28 90" fill="none" className="stroke-gold">
                    <line x1="14" y1="0" x2="14" y2="40" strokeWidth="1" />
                    <path d="M 6 48 Q 14 42 22 48 L 24 52 L 4 52 Z" fill="#ffd700" opacity="0.6" />
                    <circle cx="14" cy="54" r="2" fill="#ffd700" />
                    <line x1="14" y1="56" x2="14" y2="76" strokeWidth="1" />
                    <path d="M 8 82 Q 14 78 20 82 L 21 85 L 7 85 Z" fill="#ffd700" opacity="0.6" />
                  </svg>
                </div>

                {/* Circular Album Artwork in Ornate Mandala Filigree Halo */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center">
                    
                    {/* Rotating SVG Sunburst Mandala Ring */}
                    <svg
                      viewBox="0 0 160 160"
                      className={`absolute inset-0 w-full h-full pointer-events-none transition-transform ${
                        isPlaying ? 'animate-spin-slow' : ''
                      }`}
                    >
                      <circle cx="80" cy="80" r="74" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <circle cx="80" cy="80" r="70" stroke="#ffd700" strokeWidth="1" opacity="0.8" />
                      {Array.from({ length: 24 }).map((_, i) => (
                        <circle
                          key={i}
                          cx={80 + 74 * Math.cos((i * 15 * Math.PI) / 180)}
                          cy={80 + 74 * Math.sin((i * 15 * Math.PI) / 180)}
                          r="2"
                          fill="#ffd700"
                        />
                      ))}
                    </svg>

                    {/* Album Cover Photo */}
                    <div className="w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gold-bright shadow-2xl relative bg-black/40">
                      <img
                        src={activeCover}
                        alt="Album Cover"
                        className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                          isPlaying ? 'scale-105' : 'scale-100'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Golden Lotus Accent Under Artwork */}
                  <div className="mt-1">
                    <span className="text-sm text-gold">🪷</span>
                  </div>
                </div>
              </div>

              {/* Center Column (Cols 5-9): Title, Vedic Invocations, Seeker, Controls */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                
                {/* Sacred Header: ↠ ॐ ↞ */}
                <div className="flex items-center justify-center gap-2 text-gold">
                  <span className="text-xs opacity-75">↠</span>
                  <span className="text-lg font-serif text-gold-bright drop-shadow-md">ॐ</span>
                  <span className="text-xs opacity-75">↞</span>
                </div>

                {/* Track Titles */}
                <div className="space-y-0.5">
                  <h3 className="font-telugu font-bold text-gold-bright text-lg sm:text-xl md:text-2xl tracking-wide drop-shadow">
                    || {currentTrack.titleTelugu} ||
                  </h3>
                  <p className="font-display font-medium text-parchment/90 text-xs sm:text-sm tracking-[0.25em] uppercase">
                    {currentTrack.titleEnglish}
                  </p>
                  <p className="font-display italic text-[#e8c97a]/70 text-[10px]">
                    {currentTrack.subtitle}
                  </p>
                </div>

                {/* Fine Gold Divider */}
                <div className="flex items-center justify-center gap-2 w-36 opacity-60 my-0.5">
                  <div className="h-px w-full bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[10px] text-gold">❖</span>
                  <div className="h-px w-full bg-gradient-to-l from-transparent to-gold" />
                </div>

                {/* ── Seeker Slider Bar ── */}
                <div className="w-full space-y-1 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full gold-slider cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-gold-light/80 px-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* ── Playback Control Buttons ── */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
                  {/* Shuffle Button */}
                  <button
                    onClick={() => setIsShuffle((s) => !s)}
                    className={`text-sm transition-all active:scale-95 ${
                      isShuffle ? 'text-gold-bright scale-110 drop-shadow' : 'text-gold/45 hover:text-gold'
                    }`}
                    title="Shuffle"
                  >
                    🔀
                  </button>

                  {/* Previous Track */}
                  <button
                    onClick={prevTrack}
                    className="text-gold-light hover:text-gold-bright text-lg transition-all active:scale-95"
                    title="Previous"
                  >
                    ⏮
                  </button>

                  {/* Center Golden Play/Pause Medallion with Sunburst Halo */}
                  <button
                    onClick={togglePlay}
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 35%, #fff2a6 0%, #ffd700 45%, #c9a84c 85%, #9b7b1b 100%)',
                      border: '2px solid #ffffff',
                      boxShadow:
                        '0 0 25px rgba(255, 215, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
                    }}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    <span className="text-crimson-deep font-bold text-lg sm:text-xl">
                      {isPlaying ? '❚❚' : '▶'}
                    </span>
                  </button>

                  {/* Next Track */}
                  <button
                    onClick={nextTrack}
                    className="text-gold-light hover:text-gold-bright text-lg transition-all active:scale-95"
                    title="Next"
                  >
                    ⏭
                  </button>

                  {/* Loop / Repeat Button */}
                  <button
                    onClick={() => setIsLoop((l) => !l)}
                    className={`text-sm transition-all active:scale-95 ${
                      isLoop ? 'text-gold-bright scale-110 drop-shadow' : 'text-gold/45 hover:text-gold'
                    }`}
                    title="Repeat"
                  >
                    🔁
                  </button>
                </div>

              </div>

              {/* Right Column (Cols 10-12): Classical Veena Line-Art & Volume Slider */}
              <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center space-y-3 pt-2 md:pt-0">
                
                {/* SVG Classical Veena & Musical Notes Illustration */}
                <div className="relative w-28 h-28 hidden md:flex items-center justify-center opacity-75">
                  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-gold">
                    {/* Veena Body */}
                    <circle cx="35" cy="70" r="20" strokeWidth="1.2" fill="#ffd700" fillOpacity="0.08" />
                    <circle cx="35" cy="70" r="14" strokeWidth="0.8" />
                    {/* Veena Neck */}
                    <line x1="35" y1="50" x2="75" y2="15" strokeWidth="2.5" stroke="#ffd700" />
                    {/* Upper Gourd */}
                    <ellipse cx="75" cy="18" rx="8" ry="6" strokeWidth="1" fill="#ffd700" fillOpacity="0.08" />
                    {/* Strings */}
                    <line x1="32" y1="50" x2="72" y2="15" strokeWidth="0.5" stroke="#fff2a6" />
                    <line x1="35" y1="50" x2="75" y2="15" strokeWidth="0.5" stroke="#fff2a6" />
                    <line x1="38" y1="50" x2="78" y2="15" strokeWidth="0.5" stroke="#fff2a6" />
                    {/* Floating Musical Notes */}
                    <text x="75" y="45" fill="#ffd700" fontSize="12" className="animate-pulse">♪</text>
                    <text x="85" y="30" fill="#ffd700" fontSize="14" className="animate-pulse">♫</text>
                  </svg>
                </div>

                {/* Volume Slider Control */}
                <div className="flex items-center gap-2 w-full max-w-[160px]">
                  <button
                    onClick={toggleMute}
                    className="text-gold-light hover:text-gold-bright text-xs transition-colors"
                  >
                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full gold-slider cursor-pointer"
                  />
                </div>

                {/* Playlist Quick Switcher Pill */}
                <div className="flex items-center gap-1.5 pt-1">
                  {PLAYLIST.map((trk, i) => (
                    <button
                      key={trk.id}
                      onClick={() => setCurrentTrackIndex(i)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-telugu font-semibold transition-all ${
                        currentTrackIndex === i
                          ? 'bg-gold/30 text-gold-light border border-gold/70'
                          : 'bg-black/30 text-gold/50 hover:bg-gold/10'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  )
}
