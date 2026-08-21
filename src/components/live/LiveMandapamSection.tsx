import { useState, useRef, useEffect } from 'react'
import { SectionLabel, GoldDivider } from '../common/GoldDivider'
import { weddingData } from '../../data/weddingData'

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

// Convert various YouTube links to embeddable URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    if (url.includes('youtube.com/embed/')) return url
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search)
      const id = urlParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (url.includes('youtube.com/live/')) {
      const id = url.split('youtube.com/live/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    return url
  } catch {
    return url
  }
}

export function LiveMandapamSection() {
  const [ref, visible] = useInView()
  const liveConfig = weddingData.liveStream

  // Allow live stream link to be updated in sessionStorage or localStorage by family
  const [streamUrl, setStreamUrl] = useState(() => {
    return localStorage.getItem('wedding_live_stream_url') || liveConfig?.streamUrl || ''
  })
  const [isLiveActive, setIsLiveActive] = useState(() => {
    const saved = localStorage.getItem('wedding_is_live_active')
    return saved !== null ? saved === 'true' : Boolean(liveConfig?.isLive)
  })

  const [isPlayingEmbed, setIsPlayingEmbed] = useState(false)

  // Listen for admin live stream updates
  useEffect(() => {
    const handleUpdate = () => {
      const savedUrl = localStorage.getItem('wedding_live_stream_url') || liveConfig?.streamUrl || ''
      const savedLive = localStorage.getItem('wedding_is_live_active')
      setStreamUrl(savedUrl)
      if (savedLive !== null) setIsLiveActive(savedLive === 'true')
    }
    window.addEventListener('live_stream_updated', handleUpdate)
    return () => window.removeEventListener('live_stream_updated', handleUpdate)
  }, [liveConfig])

  const embedUrl = getYouTubeEmbedUrl(streamUrl)

  const triggerShower = () => {
    window.dispatchEvent(new Event('trigger_petal_shower'))
  }

  return (
    <section
      id="live"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #3d0808 0%, #200303 60%, #120101 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* ── Section Header ── */}
          <SectionLabel
            title="Live Mandapam & Kalyanam Webcast"
            sub="కళ్యాణ ప్రత్యక్ష ప్రసారం · Watch the Sacred Sumuhurtham Live"
            light
          />

          <p className="text-center font-display italic text-xs sm:text-sm text-parchment/80 max-w-xl mx-auto mb-8 -mt-6">
            "For our beloved elders, relatives, and well-wishers across the globe who cannot join in person, witness the divine rituals live from Hyderabad."
          </p>

          {/* ── 🏛️ Royal Mandapam Video Portal Frame ── */}
          <div className="relative max-w-4xl mx-auto rounded-3xl p-3 sm:p-5 bg-[#2b0303]/90 border-2 border-gold/80 shadow-[0_0_50px_rgba(201,168,76,0.3)] backdrop-blur-xl">
            
            {/* Top Bar: Live Status & Timing */}
            <div className="flex items-center justify-between px-2 sm:px-4 pb-3 border-b border-gold/30 text-white flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold ${
                    isLiveActive
                      ? 'bg-red-600/90 text-white animate-pulse shadow-md'
                      : 'bg-gold/20 text-gold-light border border-gold/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{isLiveActive ? '🔴 LIVE NOW' : '⏳ LIVE WEBCAST'}</span>
                </span>
                <span className="font-telugu text-xs text-gold-bright font-semibold hidden sm:inline">
                  {liveConfig?.startTimeTe || 'శనివారం రాత్రి 7:00 గంటల నుండి'}
                </span>
              </div>

              <div className="text-xs font-display text-parchment/75">
                <span>🗓 22nd August 2026 · Sumuhurtham 11:59 PM</span>
              </div>
            </div>

            {/* Video Viewport / Mandapam Stage */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gold/50 shadow-2xl mt-3 flex items-center justify-center">
              {isPlayingEmbed && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Mohan Praneeth & Leepika Live Wedding"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-t from-[#150202] via-[#2d0505] to-[#150202]">
                  {/* Decorative Mandapam Graphic */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-gold to-gold-light p-0.5 shadow-2xl flex items-center justify-center mb-4">
                    <div className="w-full h-full rounded-full bg-[#3d0808] flex items-center justify-center border border-gold/60">
                      <span className="text-4xl sm:text-5xl">🪔</span>
                    </div>
                  </div>

                  <h3 className="font-calligraphy text-gold-light text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                    {liveConfig?.titleTe || 'కళ్యాణ మహోత్సవ ప్రత్యక్ష ప్రసారం'}
                  </h3>

                  <p className="font-display italic text-parchment/80 text-xs sm:text-sm mt-1 max-w-md">
                    {liveConfig?.descriptionEn ||
                      'Live video stream will broadcast the Sumuhurtham, Jeelakarra Bellam, and Mangalya Dharana.'}
                  </p>

                  <p className="font-display text-gold-bright text-xs font-semibold mt-2">
                    ⏰ {liveConfig?.startTimeEn || 'Saturday, 22nd August 2026 at 7:00 PM IST'}
                  </p>

                  {/* Watch / Play Trigger */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    {streamUrl && (
                      <button
                        onClick={() => setIsPlayingEmbed(true)}
                        className="px-6 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] hover:brightness-110 shadow-lg shadow-gold/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        <span>▶</span>
                        <span>Watch Live Stream</span>
                      </button>
                    )}

                    <a
                      href={streamUrl || 'https://youtube.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold text-white bg-red-700/80 hover:bg-red-700 border border-red-400 shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>📺</span>
                      <span>Open in YouTube</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ── 🌸 Live Interactive Reactions & Akshintalu Bar ── */}
            <div className="mt-4 pt-3 border-t border-gold/30 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-display text-gold-light font-semibold">
                  Live Virtual Reactions:
                </span>
                
                {/* 🌸 Shower Akshintalu Button */}
                <button
                  onClick={triggerShower}
                  className="px-3.5 py-1.5 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold-bright text-xs font-display font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                  title="Shower Virtual Akshintalu on Mandapam"
                >
                  <span className="animate-bounce">🌸</span>
                  <span>Shower Akshintalu (అక్షతలు)</span>
                </button>
              </div>

              {/* Quick Link to Post Blessing */}
              <button
                onClick={() => {
                  document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-xs font-display text-parchment/80 hover:text-gold-light underline flex items-center gap-1"
              >
                <span>🎙️</span>
                <span>Send Voice Blessing / Wish</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
