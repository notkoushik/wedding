import { useEffect, useRef, useState } from 'react'

interface BotanicalPetal {
  x: number
  y: number
  z: number // Depth for 3D scale
  size: number
  variety:
    | 'full-blooming-rose'
    | 'pink-blooming-rose'
    | 'velvet-rose'
    | 'pink-rose'
    | 'marigold-saffron'
    | 'jasmine-mogra'
    | 'lotus-petal'
    | 'sacred-akshintalu'
    | 'gold-stardust'
  speedX: number
  speedY: number
  speedZ: number
  angle: number
  angleSpeed: number
  tilt: number
  tiltSpeed: number
  flip: number
  flipSpeed: number
  opacity: number
  swaySpeed: number
  swayRadius: number
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
  const petalsRef = useRef<BotanicalPetal[]>([])

  // Web Audio Synthesizer for Authentic Vedic Temple Chimes
  const playAuspiciousChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const notes = [587.33, 739.99, 880, 1174.66] // D5, F#5, A5, D6 (Raga Kalyani Auspicious notes)

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)

        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1)
        gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + i * 0.1 + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 1.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 1.5)
      })
    } catch {}
  }

  const triggerShower = () => {
    setBlessingIndex((prev) => (prev + 1) % VEDIC_BLESSINGS.length)
    setIsActive(true)
    playAuspiciousChime()

    // Spawn rich array of botanical petals AND full blooming roses
    const count = window.innerWidth < 640 ? 70 : 120
    const newPetals: BotanicalPetal[] = []

    for (let i = 0; i < count; i++) {
      const varieties: BotanicalPetal['variety'][] = [
        'full-blooming-rose', // 🌹 Full Red Blooming Rose
        'full-blooming-rose',
        'pink-blooming-rose', // 🌸 Full Pink Blooming Rose
        'velvet-rose',
        'velvet-rose',
        'pink-rose',
        'marigold-saffron',
        'jasmine-mogra',
        'lotus-petal',
        'sacred-akshintalu',
        'sacred-akshintalu',
        'gold-stardust',
      ]
      const variety = varieties[Math.floor(Math.random() * varieties.length)]

      newPetals.push({
        x: Math.random() * window.innerWidth,
        y: -50 - Math.random() * (window.innerHeight * 0.8),
        z: 0.75 + Math.random() * 0.5,
        size:
          variety === 'full-blooming-rose' || variety === 'pink-blooming-rose'
            ? 22 + Math.random() * 18 // Prominent full rose size
            : variety === 'sacred-akshintalu'
            ? 3.5 + Math.random() * 2
            : variety === 'jasmine-mogra'
            ? 9 + Math.random() * 4
            : 14 + Math.random() * 16,
        variety,
        speedX: (Math.random() - 0.5) * 2.2,
        speedY:
          variety === 'full-blooming-rose' || variety === 'pink-blooming-rose'
            ? 1.8 + Math.random() * 2.2 // Gentle heavier drift for full roses
            : 2.2 + Math.random() * 3.2,
        speedZ: 0,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.03,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.02 + Math.random() * 0.035,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.025 + Math.random() * 0.04,
        opacity: 1,
        swaySpeed: 0.025 + Math.random() * 0.035,
        swayRadius: 25 + Math.random() * 35,
        swayOffset: Math.random() * Math.PI * 2,
      })
    }

    petalsRef.current = [...petalsRef.current, ...newPetals]
  }

  // Listen for global custom event
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
    const duration = 4800 // 4.8 seconds graceful fall

    const render = () => {
      const elapsed = Date.now() - startTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((p) => {
        p.swayOffset += p.swaySpeed
        p.tilt += p.tiltSpeed
        p.flip += p.flipSpeed
        p.angle += p.angleSpeed

        p.x += p.speedX + Math.sin(p.swayOffset) * (p.swayRadius * 0.05)
        p.y += p.speedY * p.z

        // Fade out smoothly near end of animation
        if (elapsed > duration * 0.65) {
          p.opacity = Math.max(0, 1 - (elapsed - duration * 0.65) / (duration * 0.35))
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        // 3D Tumbling Projection (cosine scaling)
        const scaleX = Math.cos(p.tilt) * p.z
        const scaleY = Math.sin(p.flip) * p.z
        ctx.scale(scaleX, scaleY)
        ctx.globalAlpha = Math.max(0.05, p.opacity)

        // ── 🎨 Render Master Botanical Flowers & Petals ──
        drawBotanicalElement(ctx, p)

        ctx.restore()
      })

      // Remove fallen petals
      petalsRef.current = petalsRef.current.filter((p) => p.y < canvas.height + 70 && p.opacity > 0)

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

  // ── Botanical Drawing Procedures ──
  const drawBotanicalElement = (ctx: CanvasRenderingContext2D, p: BotanicalPetal) => {
    const s = p.size

    if (p.variety === 'full-blooming-rose' || p.variety === 'pink-blooming-rose') {
      // 🌹 Full 3D Blooming Royal Rose (పూర్తి గులాబీ పువ్వు)
      drawFullBloomingRose(ctx, s, p.variety === 'pink-blooming-rose')
    } else if (p.variety === 'velvet-rose') {
      // 🌹 Velvet Crimson Rose Petal (Organic curved heart shape with velvet ombre)
      const grad = ctx.createRadialGradient(-s * 0.2, -s * 0.3, s * 0.1, 0, 0, s * 1.2)
      grad.addColorStop(0, '#e53935') // Soft bright crimson highlight
      grad.addColorStop(0.4, '#b71c1c') // Rich red velvet
      grad.addColorStop(0.85, '#680808') // Deep royal shadow
      grad.addColorStop(1, '#3d0303')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, s * 0.9) // Base calyx
      ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.95, -s * 0.4, -s * 0.4, -s * 0.9)
      ctx.bezierCurveTo(-s * 0.1, -s * 1.05, s * 0.1, -s * 1.05, s * 0.4, -s * 0.9)
      ctx.bezierCurveTo(s * 0.95, -s * 0.4, s * 0.7, s * 0.5, 0, s * 0.9)
      ctx.closePath()
      ctx.fill()

      // Delicate center vein
      ctx.strokeStyle = 'rgba(255, 180, 180, 0.25)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(0, s * 0.8)
      ctx.quadraticCurveTo(s * 0.05, 0, 0, -s * 0.7)
      ctx.stroke()
    } else if (p.variety === 'pink-rose') {
      // 🌸 Soft Pink Rose Petal
      const grad = ctx.createRadialGradient(-s * 0.1, -s * 0.2, s * 0.1, 0, 0, s * 1.1)
      grad.addColorStop(0, '#fff0f5')
      grad.addColorStop(0.3, '#f48fb1')
      grad.addColorStop(0.8, '#d81b60')
      grad.addColorStop(1, '#880e4f')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, s * 0.85)
      ctx.bezierCurveTo(-s * 0.65, s * 0.4, -s * 0.85, -s * 0.4, -s * 0.35, -s * 0.85)
      ctx.bezierCurveTo(0, -s * 1.0, 0, -s * 1.0, s * 0.35, -s * 0.85)
      ctx.bezierCurveTo(s * 0.85, -s * 0.4, s * 0.65, s * 0.4, 0, s * 0.85)
      ctx.closePath()
      ctx.fill()
    } else if (p.variety === 'marigold-saffron') {
      // 🏵️ Saffron Marigold Petal (Fluted ruffly wedding marigold)
      const grad = ctx.createLinearGradient(0, s, 0, -s)
      grad.addColorStop(0, '#e65100') // Deep orange base
      grad.addColorStop(0.5, '#ff9800') // Vibrant marigold
      grad.addColorStop(0.95, '#ffd54f') // Saffron gold ruffled tip

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, s * 0.8)
      ctx.bezierCurveTo(-s * 0.4, s * 0.3, -s * 0.55, -s * 0.4, -s * 0.2, -s * 0.8)
      // Ruffled scalloped tip
      ctx.lineTo(0, -s * 0.95)
      ctx.lineTo(s * 0.2, -s * 0.8)
      ctx.bezierCurveTo(s * 0.55, -s * 0.4, s * 0.4, s * 0.3, 0, s * 0.8)
      ctx.closePath()
      ctx.fill()
    } else if (p.variety === 'jasmine-mogra') {
      // 🌼 Scented Jasmine Floret (మల్లెపూవు - 5 Petal Star with golden pistil)
      ctx.fillStyle = '#fffdf7'
      for (let j = 0; j < 5; j++) {
        ctx.save()
        ctx.rotate((j * Math.PI * 2) / 5)
        ctx.beginPath()
        ctx.ellipse(0, -s * 0.5, s * 0.22, s * 0.45, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      // Golden center core
      ctx.fillStyle = '#fbc02d'
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2)
      ctx.fill()
    } else if (p.variety === 'lotus-petal') {
      // 🪷 Sacred Lotus Petal (కమల రేకు)
      const grad = ctx.createLinearGradient(0, s, 0, -s)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.5, '#f8bbd0')
      grad.addColorStop(1, '#c2185b')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, s * 0.9)
      ctx.bezierCurveTo(-s * 0.5, s * 0.3, -s * 0.45, -s * 0.5, 0, -s * 0.95)
      ctx.bezierCurveTo(s * 0.45, -s * 0.5, s * 0.5, s * 0.3, 0, s * 0.9)
      ctx.closePath()
      ctx.fill()
    } else if (p.variety === 'sacred-akshintalu') {
      // 🌾 Sacred Turmeric-Dipped Rice Grain (అక్షతలు)
      const grad = ctx.createLinearGradient(-s, -s, s, s)
      grad.addColorStop(0, '#fff59d') // Highlight
      grad.addColorStop(0.4, '#ffd700') // Turmeric Gold
      grad.addColorStop(1, '#c98a00') // Warm Saffron shade

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(0, 0, s * 0.5, s * 1.5, Math.PI / 4, 0, 2 * Math.PI)
      ctx.fill()

      // Natural rice grain crease
      ctx.strokeStyle = 'rgba(180, 110, 0, 0.4)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(-s * 0.2, -s * 0.8)
      ctx.lineTo(s * 0.2, s * 0.8)
      ctx.stroke()
    } else {
      // ✨ Golden Stardust Sparkle
      ctx.fillStyle = '#fff9c4'
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.25, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // 🌹 Procedural Master Full Blooming Rose Drawing Algorithm
  const drawFullBloomingRose = (ctx: CanvasRenderingContext2D, size: number, isPink = false) => {
    const s = size * 1.25

    // 1. Green Sepals (Behind petals)
    ctx.fillStyle = '#2e7d32'
    for (let k = 0; k < 5; k++) {
      ctx.save()
      ctx.rotate((k * Math.PI * 2) / 5 + Math.PI / 10)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(-s * 0.15, s * 0.6, 0, s * 0.9)
      ctx.quadraticCurveTo(s * 0.15, s * 0.6, 0, 0)
      ctx.fill()
      ctx.restore()
    }

    // 2. Layer 1: Outer 5 Wide Guard Petals
    const cOuter1 = isPink ? '#f48fb1' : '#b71c1c'
    const cOuter2 = isPink ? '#ad1457' : '#5c0505'
    for (let i = 0; i < 5; i++) {
      ctx.save()
      ctx.rotate((i * Math.PI * 2) / 5)
      const g = ctx.createRadialGradient(0, s * 0.3, s * 0.1, 0, s * 0.45, s * 0.75)
      g.addColorStop(0, cOuter1)
      g.addColorStop(1, cOuter2)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(0, s * 0.42, s * 0.45, s * 0.38, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // 3. Layer 2: Intermediate Spiraled Cupped Petals (6 petals)
    const cMid1 = isPink ? '#ff80ab' : '#d32f2f'
    const cMid2 = isPink ? '#880e4f' : '#7f0000'
    for (let j = 0; j < 6; j++) {
      ctx.save()
      ctx.rotate((j * Math.PI * 2) / 6 + Math.PI / 6)
      const g = ctx.createRadialGradient(0, s * 0.2, s * 0.05, 0, s * 0.25, s * 0.5)
      g.addColorStop(0, cMid1)
      g.addColorStop(1, cMid2)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(0, s * 0.26, s * 0.34, s * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // 4. Layer 3: Inner Tight Spiral Petals
    const cCore1 = isPink ? '#ff4081' : '#e53935'
    const cCore2 = isPink ? '#4a148c' : '#4a0000'
    for (let m = 0; m < 5; m++) {
      ctx.save()
      ctx.rotate((m * Math.PI * 2) / 5 + Math.PI / 4)
      ctx.fillStyle = cCore1
      ctx.beginPath()
      ctx.ellipse(0, s * 0.14, s * 0.22, s * 0.16, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // 5. Central Rosebud Swirl Core
    const coreGrad = ctx.createRadialGradient(-s * 0.05, -s * 0.05, s * 0.02, 0, 0, s * 0.18)
    coreGrad.addColorStop(0, isPink ? '#ffffff' : '#ffcdd2')
    coreGrad.addColorStop(0.5, cCore1)
    coreGrad.addColorStop(1, cCore2)
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Delicate Spiral Swirl Line
    ctx.strokeStyle = isPink ? 'rgba(255,255,255,0.8)' : 'rgba(255, 180, 180, 0.8)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.08, 0, Math.PI * 1.5)
    ctx.stroke()
  }

  return (
    <>
      {/* 🌸 Floating Interactive Shower Action Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-40">
        <button
          onClick={triggerShower}
          className="group relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-display text-[11px] sm:text-xs font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] shadow-xl border border-white/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 hover:shadow-2xl hover:shadow-gold/40 backdrop-blur-md"
          title="Shower Sacred Akshintalu, Blooming Roses & Petals on the Couple"
        >
          <span className="text-sm sm:text-base animate-bounce">🌸</span>
          <span className="tracking-wide">Shower Blessings</span>
          <span className="hidden sm:inline text-[10px] text-crimson font-telugu font-semibold">
            (పుష్పవృష్టి &amp; అక్షతలు)
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
