import { useEffect, useRef, useState } from 'react'

interface Petal {
  x: number
  y: number
  size: number
  type: 'rose-red' | 'rose-pink' | 'marigold' | 'akshinthalu' | 'gold-sparkle'
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
  swaySpeed: number
  swayOffset: number
}

// Auspicious Telugu Vedic Wedding Blessings
const VEDIC_BLESSINGS = [
  { te: '|| శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ||', en: 'May you be blessed with divine prosperity & eternal harmony' },
  { te: '|| చిరంజీవ సుఖీభవ · దీర్ఘాయుష్మాన్ భవ ||', en: 'Wishing a lifetime of health, togetherness and bliss' },
  { te: '|| అష్టలక్ష్మీ సమన్వితో భవతు ||', en: 'Blessed with love, wisdom and abundance forever' },
]

export function PetalShower() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [blessingIndex, setBlessingIndex] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const petalsRef = useRef<Petal[]>([])

  // Auspicious synthesized temple bell chime via Web Audio API
  const playAuspiciousChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Swaras)

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)

        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 1.2)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + i * 0.12)
        osc.stop(ctx.currentTime + i * 0.12 + 1.3)
      })
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  const triggerShower = () => {
    setBlessingIndex((prev) => (prev + 1) % VEDIC_BLESSINGS.length)
    setIsActive(true)
    playAuspiciousChime()

    // Spawn 120 vibrant petals and akshintalu
    const count = window.innerWidth < 640 ? 70 : 120
    const newPetals: Petal[] = []

    for (let i = 0; i < count; i++) {
      const types: Petal['type'][] = ['rose-red', 'rose-pink', 'marigold', 'akshinthalu', 'gold-sparkle']
      const type = types[Math.floor(Math.random() * types.length)]

      newPetals.push({
        x: Math.random() * window.innerWidth,
        y: -30 - Math.random() * (window.innerHeight * 0.6),
        size: type === 'akshinthalu' ? 3 + Math.random() * 3 : 10 + Math.random() * 14,
        type,
        speedX: (Math.random() - 0.5) * 2.5,
        speedY: 2.2 + Math.random() * 3.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: 1,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayOffset: Math.random() * Math.PI * 2,
      })
    }

    petalsRef.current = [...petalsRef.current, ...newPetals]
  }

  // Listen for global custom event to trigger shower anywhere
  useEffect(() => {
    const handleGlobalTrigger = () => triggerShower()
    window.addEventListener('trigger_petal_shower', handleGlobalTrigger)
    return () => window.removeEventListener('trigger_petal_shower', handleGlobalTrigger)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let startTime = Date.now()
    const duration = 4200 // 4.2 seconds shower

    const render = () => {
      const elapsed = Date.now() - startTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((p) => {
        p.swayOffset += p.swaySpeed
        p.x += p.speedX + Math.sin(p.swayOffset) * 1.8
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        // Fade out toward end
        if (elapsed > duration * 0.7) {
          p.opacity = Math.max(0, 1 - (elapsed - duration * 0.7) / (duration * 0.3))
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity

        if (p.type === 'akshinthalu') {
          // Yellow Turmeric Dipped Rice Grain (అక్షతలు)
          ctx.fillStyle = '#ffd700'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 1.6, Math.PI / 4, 0, 2 * Math.PI)
          ctx.fill()
          ctx.strokeStyle = '#e6a100'
          ctx.lineWidth = 0.5
          ctx.stroke()
        } else if (p.type === 'marigold') {
          // Bright Orange-Gold Marigold Petal (బంతిపూల రేకులు)
          ctx.fillStyle = '#ff9800'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.8, p.size * 1.4, 0, 0, 2 * Math.PI)
          ctx.fill()
        } else if (p.type === 'rose-pink') {
          // Soft Pink Rose Petal
          ctx.fillStyle = '#f06292'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size * 1.3, 0, 0, 2 * Math.PI)
          ctx.fill()
        } else if (p.type === 'gold-sparkle') {
          // Golden Dust Sparkle
          ctx.fillStyle = '#fff0a6'
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.4, 0, 2 * Math.PI)
          ctx.fill()
        } else {
          // Deep Crimson Red Rose Petal (ఎరుపు గులాబీ రేకులు)
          ctx.fillStyle = '#b71c1c'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size * 1.4, 0, 0, 2 * Math.PI)
          ctx.fill()
        }

        ctx.restore()
      })

      // Clean up petals that fell off screen
      petalsRef.current = petalsRef.current.filter((p) => p.y < canvas.height + 50 && p.opacity > 0)

      if (elapsed < duration || petalsRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(render)
      } else {
        setIsActive(false)
        petalsRef.current = []
      }
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isActive])

  return (
    <>
      {/* 🌸 Floating Interactive Shower Action Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40">
        <button
          onClick={triggerShower}
          className="group relative px-4 py-2.5 rounded-full font-display text-xs font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] shadow-xl border border-white/60 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 hover:shadow-2xl hover:shadow-gold/40"
          title="Shower Sacred Akshintalu & Rose Petals on the Couple"
        >
          <span className="text-base animate-bounce">🌸</span>
          <span className="tracking-wide">Shower Blessings</span>
          <span className="hidden sm:inline text-[10px] text-crimson font-telugu font-semibold">
            (అక్షతలు వేయండి)
          </span>

          {/* Golden Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-gold/30 animate-ping pointer-events-none opacity-75 group-hover:opacity-100" />
        </button>
      </div>

      {/* 🌸 Canvas Layer when Active */}
      {isActive && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start pt-16 sm:pt-24">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* 📜 Auspicious Vedic Blessing Ribbon Toast */}
          <div className="relative z-10 animate-fade-in-down max-w-lg mx-4 px-6 py-4 rounded-3xl bg-[#3d0808]/90 border-2 border-gold/80 shadow-2xl backdrop-blur-md text-center space-y-1 text-white">
            <div className="flex items-center justify-center gap-2 text-gold-light text-xs font-display uppercase tracking-widest font-bold">
              <span>🪔</span>
              <span>అక్షతారోపణం &amp; పుష్పవృష్టి</span>
              <span>🪔</span>
            </div>
            <h3 className="font-telugu text-gold-bright text-base sm:text-lg font-bold leading-relaxed">
              {VEDIC_BLESSINGS[blessingIndex].te}
            </h3>
            <p className="font-display italic text-parchment/80 text-xs">
              {VEDIC_BLESSINGS[blessingIndex].en}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
