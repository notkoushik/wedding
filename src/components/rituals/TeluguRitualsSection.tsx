import { useState } from 'react'
import { weddingData } from '../../data/weddingData'

export function TeluguRitualsSection() {
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null)
  const { couple, rituals } = weddingData

  return (
    <section
      id="rituals"
      className="relative py-20 sm:py-28 md:py-32"
      style={{
        backgroundColor: '#E8DCCA',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ── Section Header (Clean, Serene & High Aesthetic) ── */}
        <div className="text-center space-y-2 mb-20 sm:mb-28">
          <p className="font-telugu text-[#6b1212] text-xs sm:text-sm tracking-[0.2em] font-semibold">
            {couple.sanskritHeaderTe}
          </p>
          <h2 className="font-calligraphy text-crimson text-3xl sm:text-4xl md:text-5xl font-bold">
            Sacred Telugu Traditions
          </h2>
          <p className="font-telugu text-[#4a0808] text-base sm:text-lg font-medium">
            సాంప్రదాయ వివాహ ఘట్టాల విశిష్టత
          </p>
          <div className="w-16 h-[1px] bg-[#9b7b1b] mx-auto mt-3 opacity-60" />
        </div>

        {/* ── 1. Featured Couple Portrait ── */}
        <div className="max-w-2xl mx-auto mb-24 sm:mb-32 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div
            className="w-52 sm:w-60 md:w-64 flex-shrink-0 cursor-pointer group hover:scale-102 transition-transform duration-500"
            onClick={() => setActiveModalImg(couple.portraitImage)}
          >
            <img
              src={couple.portraitImage}
              alt={couple.namesCombinedEn}
              className="w-full h-auto object-contain drop-shadow-md rounded-2xl"
            />
          </div>

          <div className="text-center md:text-left space-y-2">
            <h3 className="font-telugu font-bold text-crimson text-2xl sm:text-3xl">
              {couple.namesCombinedTe}
            </h3>
            <p className="font-display font-medium text-gold-dark text-sm sm:text-base tracking-wide">
              {couple.namesCombinedEn}
            </p>
            <p className="font-telugu text-[#4a0808] text-xs sm:text-sm leading-relaxed pt-1">
              {couple.taglineTe}
            </p>
            <p className="font-display italic text-[#633a3a] text-xs sm:text-[13px] leading-relaxed">
              "{couple.taglineEn}"
            </p>
          </div>
        </div>

        {/* ── 2. Clean Editorial Storytelling Flow for the Rituals ── */}
        <div className="space-y-24 sm:space-y-36">
          {rituals.map((ritual, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={ritual.id}
                className={`flex flex-col ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                } items-center gap-8 sm:gap-14 md:gap-18`}
              >
                {/* ── Artwork Illustration (Seamless on #E8DCCA) ── */}
                <div className="w-full md:w-5/12 flex justify-center">
                  <div
                    onClick={() => setActiveModalImg(ritual.image)}
                    className="w-full max-w-[280px] sm:max-w-xs cursor-pointer group hover:scale-102 transition-transform duration-500"
                  >
                    <img
                      src={ritual.image}
                      alt={ritual.titleTelugu}
                      className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm"
                    />
                  </div>
                </div>

                {/* ── Story Narrative ── */}
                <div className="w-full md:w-7/12 text-center md:text-left space-y-3">
                  
                  {/* Special Badge for Jeelakarra Bellam */}
                  {ritual.id === 'jeelakarra-bellam' && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5c0a0a] text-gold-light text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-widest shadow-md">
                      <span>🪔</span>
                      <span>ప్రధాన సుముహూర్త ఘట్టం · Auspicious Climax (11:59 PM)</span>
                    </div>
                  )}

                  {/* Step Index & Shloka */}
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs">
                    <span className="font-display font-bold text-crimson tracking-widest uppercase">
                      — {ritual.number} —
                    </span>
                    <span className="text-[#9b7b1b]">·</span>
                    <span className="font-telugu text-[#6b1212] font-semibold text-xs">
                      {ritual.shloka}
                    </span>
                  </div>

                  {/* Title & English Subtitle */}
                  <div>
                    <h3 className={`font-telugu font-bold text-2xl sm:text-3xl md:text-4xl ${ritual.id === 'jeelakarra-bellam' ? 'text-[#7a0c0c] font-black' : 'text-crimson'}`}>
                      {ritual.titleTelugu}
                    </h3>
                    <p className="font-display font-medium text-[#7a4a4a] text-xs sm:text-[13px] tracking-wider uppercase">
                      {ritual.titleEnglish}
                    </p>
                  </div>

                  {/* Telugu Significance */}
                  <p className="font-telugu text-[#3a0505] text-xs sm:text-sm leading-relaxed pt-1">
                    {ritual.significanceTelugu}
                  </p>

                  {/* English Significance */}
                  <p className="font-body text-[#4d2626] text-xs sm:text-[13px] leading-relaxed">
                    {ritual.significanceEnglish}
                  </p>

                  {/* Cultural Details */}
                  <div className="pt-2 space-y-1 text-left inline-block">
                    {ritual.culturalDetailsTelugu.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs font-telugu text-[#5c0a0a]">
                        <span className="text-[#9b7b1b] text-xs mt-0.5">✦</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* ── 3. HD Lightbox Modal ── */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md cursor-pointer transition-opacity duration-300"
          onClick={() => setActiveModalImg(null)}
        >
          <div
            className="relative max-w-lg w-full p-4 sm:p-6 rounded-2xl shadow-2xl my-auto cursor-default border border-gold/40"
            style={{ backgroundColor: '#E8DCCA' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end pb-2">
              <button
                onClick={() => setActiveModalImg(null)}
                className="w-7 h-7 rounded-full bg-crimson text-white flex items-center justify-center text-xs hover:bg-crimson-dark transition-all"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[80vh] flex justify-center py-1">
              <img
                src={activeModalImg}
                alt="Telugu Ritual Artwork"
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
