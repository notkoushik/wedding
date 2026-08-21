import { useState, useEffect } from 'react'
import { weddingData } from '../../data/weddingData'

export function GrandEntrance() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const { couple, muhurtham } = weddingData

  // Check if entrance was already passed in this session
  useEffect(() => {
    const passed = sessionStorage.getItem('wedding_grand_entrance_seen')
    if (passed === 'true') {
      setIsOpen(true)
    }

    // Simulated asset preloading progress bar (smooth 1s loading)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsReady(true)
          return 100
        }
        return prev + 25
      })
    }, 150)

    // Listen for re-play entrance event from navigation menu
    const handleReplay = () => {
      setIsOpen(false)
      setIsOpening(false)
      setIsReady(true)
      setProgress(100)
    }
    window.addEventListener('replay_grand_entrance', handleReplay)

    return () => {
      clearInterval(interval)
      window.removeEventListener('replay_grand_entrance', handleReplay)
    }
  }, [])

  // Web Audio Synthesizer for Auspicious Temple Bell Chimes
  const playTempleBellChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()

      // High spiritual temple bell frequencies
      const frequencies = [587.33, 880, 1174.66, 1760]
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.8)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.08)
        osc.stop(ctx.currentTime + idx * 0.08 + 1.9)
      })
    } catch {}
  }

  // Handle "Enter Royal Mandapam" Click
  const handleEnter = () => {
    if (isOpening) return
    setIsOpening(true)
    playTempleBellChime()

    // 1. Trigger Audio Player Play
    window.dispatchEvent(new CustomEvent('start_wedding_music'))

    // 2. Trigger 3D Sacred Akshintalu & Rose Petal Shower
    window.dispatchEvent(new CustomEvent('trigger_petal_shower'))

    // 3. Mark session as passed
    sessionStorage.setItem('wedding_grand_entrance_seen', 'true')

    // 4. Complete door opening animation
    setTimeout(() => {
      setIsOpen(true)
    }, 1600)
  }

  if (isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center pointer-events-auto select-none">
      
      {/* ── 🚪 Left Royal Palace Door / Velvet Curtain ── */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#1f0202] via-[#420606] to-[#2b0303] border-r-2 border-gold/70 shadow-2xl transition-all duration-1200 ease-in-out z-20 flex flex-col justify-between p-6 ${
          isOpening ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          boxShadow: '10px 0 50px rgba(0,0,0,0.8), inset -5px 0 25px rgba(201,168,76,0.3)',
        }}
      >
        <div className="absolute inset-0 fan-pattern opacity-20 pointer-events-none" />
        
        {/* Top Zari Gold Border */}
        <div className="h-6 w-full border-b border-t border-gold/60 flex items-center justify-around opacity-60">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-gold text-xs">✦</span>
          ))}
        </div>

        {/* Decorative Golden Arch Filigree */}
        <div className="my-auto self-end pr-4 sm:pr-8 text-right opacity-70 hidden sm:block">
          <span className="text-4xl text-gold-light/40">🪔</span>
        </div>

        {/* Bottom Door Trim */}
        <div className="h-6 w-full border-b border-t border-gold/60 flex items-center justify-around opacity-60">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-gold text-xs">✦</span>
          ))}
        </div>
      </div>

      {/* ── 🚪 Right Royal Palace Door / Velvet Curtain ── */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1f0202] via-[#420606] to-[#2b0303] border-l-2 border-gold/70 shadow-2xl transition-all duration-1200 ease-in-out z-20 flex flex-col justify-between p-6 ${
          isOpening ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          boxShadow: '-10px 0 50px rgba(0,0,0,0.8), inset 5px 0 25px rgba(201,168,76,0.3)',
        }}
      >
        <div className="absolute inset-0 fan-pattern opacity-20 pointer-events-none" />

        {/* Top Zari Gold Border */}
        <div className="h-6 w-full border-b border-t border-gold/60 flex items-center justify-around opacity-60">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-gold text-xs">✦</span>
          ))}
        </div>

        {/* Decorative Golden Arch Filigree */}
        <div className="my-auto self-start pl-4 sm:pl-8 text-left opacity-70 hidden sm:block">
          <span className="text-4xl text-gold-light/40">🪔</span>
        </div>

        {/* Bottom Door Trim */}
        <div className="h-6 w-full border-b border-t border-gold/60 flex items-center justify-around opacity-60">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-gold text-xs">✦</span>
          ))}
        </div>
      </div>

      {/* ── 🔱 Center Royal Auspicious Kalasam & Unlocking Portal ── */}
      <div
        className={`relative z-30 flex flex-col items-center text-center max-w-lg mx-4 p-6 sm:p-8 rounded-3xl bg-[#240303]/95 border-2 border-gold shadow-[0_0_60px_rgba(201,168,76,0.5)] backdrop-blur-xl transition-all duration-1000 ${
          isOpening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Floating Sacred Kalasam & Temple Bell */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#9b7b1b] via-[#ffd700] to-[#e8c97a] p-0.5 shadow-2xl flex items-center justify-center animate-flame">
            <div className="w-full h-full rounded-full bg-[#3d0808] flex items-center justify-center border-2 border-gold/60">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_2px_12px_rgba(255,215,0,0.8)]">
                🪔
              </span>
            </div>
          </div>
          {/* Outer Pulsing Aura */}
          <span className="absolute -inset-2 rounded-full bg-gold/30 animate-ping pointer-events-none opacity-60" />
        </div>

        {/* Sacred Telugu & Sanskrit Invocations */}
        <p className="font-telugu text-gold-bright text-xs sm:text-sm font-bold tracking-[0.2em] mb-1">
          {couple.sanskritHeader}
        </p>

        <h1 className="font-calligraphy text-gold-light text-3xl sm:text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
          {couple.namesCombinedEn}
        </h1>

        <p className="font-telugu text-gold/80 text-sm sm:text-base font-semibold pt-1">
          {couple.namesCombinedTe}
        </p>

        <p className="font-display italic text-parchment/80 text-xs mt-2 max-w-xs">
          "Turupada Family warmly welcomes you to witness the sacred wedding celebration."
        </p>

        {/* Muhurtham Badge */}
        <div className="my-4 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold-light text-[11px] font-display font-semibold">
          🗓 {muhurtham.dateStringEn} · {muhurtham.timeStringEn}
        </div>

        {/* ── Progress Bar or Interactive Enter Button ── */}
        {!isReady ? (
          <div className="w-full max-w-xs space-y-2 mt-2">
            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-gold/30">
              <div
                className="h-full bg-gradient-to-r from-gold via-gold-bright to-gold transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-display text-[10px] text-gold/60 uppercase tracking-widest animate-pulse">
              Preparing the Sacred Mandapam ({progress}%)...
            </p>
          </div>
        ) : (
          <button
            onClick={handleEnter}
            disabled={isOpening}
            className="group relative px-6 sm:px-8 py-3 rounded-full font-display text-xs sm:text-sm uppercase tracking-widest font-bold text-[#2b0303] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2 mt-1 animate-bounce"
          >
            <span>🪔</span>
            <span>Enter Royal Mandapam</span>
            <span>✨</span>

            {/* Glowing Ring */}
            <span className="absolute -inset-1 rounded-full bg-gold/40 animate-ping opacity-75 pointer-events-none" />
          </button>
        )}

        <p className="font-telugu text-[10px] text-gold/50 mt-3">
          (వివాహ వేదికలోకి ప్రవేశించడానికి తాకండి)
        </p>
      </div>

    </div>
  )
}
