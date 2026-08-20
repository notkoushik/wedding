import { useState, useRef, useEffect } from 'react'
import { SectionLabel } from '../common/GoldDivider'
import { OriginalCardViewer } from './OriginalCardViewer'
import { TeluguWeddingCard } from './TeluguWeddingCard'
import { DigitalEnglishCard } from './DigitalEnglishCard'
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

export function InvitationSection() {
  const [ref, visible] = useInView()
  const [language, setLanguage] = useState<'telugu' | 'english'>('telugu')
  const [zoomModalType, setZoomModalType] = useState<'cover' | 'content' | null>(null)
  const { couple, socialShare } = weddingData

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(socialShare.whatsappInvitationText(window.location.href))
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleDownloadCover = () => {
    const link = document.createElement('a')
    link.href = couple.coverCardImage
    link.download = `${couple.namesCombinedEn.replace(/\s+/g, '-')}-Wedding-Cover.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section
      id="invitation"
      className="relative bg-ivory py-16 sm:py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 fan-pattern opacity-18 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel
            title="The Wedding Invitation"
            sub={couple.familyHeaderTe}
          />

          {/* ── Top Language Category Selector with Royal Gold Sheen ── */}
          <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
            <p className="font-display text-[11px] text-gold-dark uppercase tracking-[0.25em] font-semibold mb-3">
              Select Language / భాషను ఎంచుకోండి
            </p>

            <div className="inline-flex p-1.5 rounded-full bg-white border border-gold/50 shadow-xl backdrop-blur-md">
              <button
                onClick={() => setLanguage('telugu')}
                className={`px-6 sm:px-8 py-3 rounded-full font-telugu text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  language === 'telugu'
                    ? 'bg-gradient-to-r from-[#5c0a0a] via-[#8b1a1a] to-[#5c0a0a] text-gold-light shadow-lg border border-gold/70 scale-105'
                    : 'text-[#5c0a0a] hover:bg-gold/10'
                }`}
              >
                <span>🪔</span>
                <span>తెలుగు పత్రిక (Telugu)</span>
              </button>

              <button
                onClick={() => setLanguage('english')}
                className={`px-6 sm:px-8 py-3 rounded-full font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  language === 'english'
                    ? 'bg-gradient-to-r from-[#5c0a0a] via-[#8b1a1a] to-[#5c0a0a] text-gold-light shadow-lg border border-gold/70 scale-105'
                    : 'text-[#5c0a0a] hover:bg-gold/10'
                }`}
              >
                <span>📜</span>
                <span>English Formal</span>
              </button>
            </div>
          </div>

          {/* ── Side-by-Side Dual Folio Booklet (Cover on Left, Flipping Card on Right) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch mb-10 max-w-4xl mx-auto">
            
            {/* Left Page: Opening Cover Card */}
            <div className="flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <h3 className="font-telugu font-bold text-crimson-dark text-sm sm:text-base">
                    కవర్ పేజీ (Opening Cover)
                  </h3>
                </div>
                <span className="font-display text-gold-dark text-[10px] uppercase tracking-wider font-semibold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
                  Front Cover
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <OriginalCardViewer onZoom={() => setZoomModalType('cover')} />
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
                <button
                  onClick={() => setZoomModalType('cover')}
                  className="py-2.5 px-3 rounded-full font-telugu text-xs font-semibold bg-gold/15 hover:bg-gold/25 border border-gold/40 text-[#5c0a0a] transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>🔍</span>
                  <span>కవర్ చూడండి (Zoom)</span>
                </button>
                <button
                  onClick={handleDownloadCover}
                  className="py-2.5 px-3 rounded-full font-display text-[11px] uppercase tracking-wider font-bold bg-white hover:bg-gold/10 border border-gold/60 text-crimson-dark transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>📥</span>
                  <span>Save Cover</span>
                </button>
              </div>
            </div>

            {/* Right Page: Language Card (Telugu / English) */}
            <div className="flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{language === 'telugu' ? '🪔' : '📜'}</span>
                  <h3 className="font-telugu font-bold text-crimson-dark text-sm sm:text-base">
                    {language === 'telugu' ? 'సంప్రదాయ తెలుగు శుభలేఖ' : 'Formal English Invitation'}
                  </h3>
                </div>
                <span className="font-display text-gold-dark text-[10px] uppercase tracking-wider font-semibold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {language === 'telugu' ? 'Telugu Card' : 'English Card'}
                </span>
              </div>

              {/* Language Card Container with Smooth Transition */}
              <div
                className="flex-1 flex flex-col justify-center cursor-pointer transition-all duration-300"
                onClick={() => setZoomModalType('content')}
              >
                <div key={language} className="animate-fadeUp h-full">
                  {language === 'telugu' ? <TeluguWeddingCard /> : <DigitalEnglishCard />}
                </div>
              </div>

              {/* Right Side Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
                <button
                  onClick={() => setZoomModalType('content')}
                  className="py-2.5 px-3 rounded-full font-telugu text-xs font-semibold bg-gold/15 hover:bg-gold/25 border border-gold/40 text-[#5c0a0a] transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>🔍</span>
                  <span>పెద్దదిగా చూడండి (Zoom)</span>
                </button>

                <button
                  onClick={shareToWhatsApp}
                  className="py-2.5 px-3 rounded-full font-display text-[11px] uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-green-600/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp Share</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Ultra-Smooth Elongated Luxury Lightbox Modal ── */}
      {zoomModalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/90 backdrop-blur-xl cursor-pointer transition-opacity duration-300"
          onClick={() => setZoomModalType(null)}
        >
          <div
            className="relative max-w-xl w-full bg-[#fdfaf0] p-4 sm:p-6 rounded-3xl shadow-2xl my-auto cursor-default modal-luxury-animation"
            style={{
              border: '2.5px solid rgba(255, 215, 0, 0.9)',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.45), 0 25px 70px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gold/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomModalType('cover')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    zoomModalType === 'cover'
                      ? 'bg-crimson text-gold-light border border-gold/60 shadow-md'
                      : 'bg-gold/15 text-[#5c0a0a] hover:bg-gold/25'
                  }`}
                >
                  👑 Opening Cover
                </button>

                <button
                  onClick={() => {
                    setZoomModalType('content')
                    setLanguage(language === 'telugu' ? 'english' : 'telugu')
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-telugu transition-all ${
                    zoomModalType === 'content'
                      ? 'bg-crimson text-gold-light border border-gold/60 shadow-md'
                      : 'bg-gold/15 text-[#5c0a0a] hover:bg-gold/25'
                  }`}
                >
                  {language === 'telugu' ? '🪔 తెలుగు పత్రిక' : '📜 English Card'} (Switch)
                </button>
              </div>

              <button
                onClick={() => setZoomModalType(null)}
                className="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center font-bold text-sm hover:bg-crimson-dark transition-all active:scale-95 shadow-md"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[78vh] flex justify-center py-1">
              {zoomModalType === 'cover' ? (
                <img
                  src={couple.coverCardImage}
                  alt="Opening wedding invitation cover"
                  className="w-full h-auto object-contain rounded-xl shadow-lg animate-fadeUp"
                />
              ) : language === 'telugu' ? (
                <div className="w-full animate-fadeUp">
                  <TeluguWeddingCard />
                </div>
              ) : (
                <div className="w-full animate-fadeUp">
                  <DigitalEnglishCard />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
