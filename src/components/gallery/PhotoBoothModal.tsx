import { useState, useRef, useEffect } from 'react'
import { compressImage } from '../../lib/imageCompressor'
import { submitGuestPhoto } from '../../lib/supabase'

interface PhotoBoothModalProps {
  isOpen: boolean
  onClose: () => void
  onPhotoUploaded: () => void
}

type CameraFacing = 'user' | 'environment'
type PhotoFilter = 'normal' | 'golden' | 'cinematic' | 'vibrant'
type PhotoFrame = 'none' | 'royal-gold' | 'toranam' | 'watermark'

export function PhotoBoothModal({ isOpen, onClose, onPhotoUploaded }: PhotoBoothModalProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera')
  const [facingMode, setFacingMode] = useState<CameraFacing>('user')
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>('normal')
  const [activeFrame, setActiveFrame] = useState<PhotoFrame>('royal-gold')

  // Stream & Video
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [isFlashActive, setIsFlashActive] = useState(false)

  // Captured / Selected Image
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Form Fields
  const [uploaderName, setUploaderName] = useState('')
  const [uploaderCaption, setUploaderCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Start Camera Stream
  const startCamera = async () => {
    stopCamera()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
      setHasCameraPermission(true)
    } catch (err) {
      console.warn('Camera access error:', err)
      setHasCameraPermission(false)
      setActiveMode('upload') // Fallback to file picker if camera blocked
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    if (isOpen && activeMode === 'camera' && !previewUrl) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isOpen, activeMode, facingMode, previewUrl])

  // Camera Flip
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  // Shutter Sound Synthesizer via Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.09)
    } catch {}
  }

  // 📸 Snap Live Photo from Viewfinder
  const takeSnapshot = () => {
    const video = videoRef.current
    if (!video) return

    playShutterSound()
    setIsFlashActive(true)
    setTimeout(() => setIsFlashActive(false), 200)

    const canvas = document.createElement('canvas')
    const size = Math.min(video.videoWidth || 720, video.videoHeight || 720)
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Apply Filter Styles on Canvas
    if (activeFilter === 'golden') {
      ctx.filter = 'sepia(0.35) saturate(1.4) contrast(1.1) brightness(1.05)'
    } else if (activeFilter === 'cinematic') {
      ctx.filter = 'contrast(1.25) saturate(1.15) brightness(0.95)'
    } else if (activeFilter === 'vibrant') {
      ctx.filter = 'saturate(1.5) contrast(1.1) brightness(1.05)'
    } else {
      ctx.filter = 'none'
    }

    // Crop center square
    const startX = ((video.videoWidth || size) - size) / 2
    const startY = ((video.videoHeight || size) - size) / 2

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(size, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size)

    // Reset transform & filter for frames/watermarks
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = 'none'

    // 🎨 Draw Selected Wedding Frame & Stamp Overlays
    drawFrameOverlay(ctx, size)

    // Export high-quality blob
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          // Compress immediately for superfast upload
          const compressed = await compressImage(blob, 1400, 1400, 0.85)
          setCapturedBlob(compressed)
          setPreviewUrl(URL.createObjectURL(compressed))
          stopCamera()
        }
      },
      'image/webp',
      0.9
    )
  }

  // Draw Royal Frame / Toranam Overlays
  const drawFrameOverlay = (ctx: CanvasRenderingContext2D, size: number) => {
    if (activeFrame === 'royal-gold') {
      // Royal 24K Gold Zari Border Frame
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)'
      ctx.lineWidth = size * 0.02
      ctx.strokeRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96)

      ctx.strokeStyle = 'rgba(201, 168, 76, 0.6)'
      ctx.lineWidth = size * 0.006
      ctx.strokeRect(size * 0.035, size * 0.035, size * 0.93, size * 0.93)

      // Gold Bottom Title Badge
      ctx.fillStyle = 'rgba(61, 8, 8, 0.85)'
      ctx.fillRect(size * 0.1, size * 0.88, size * 0.8, size * 0.09)
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'
      ctx.lineWidth = 2
      ctx.strokeRect(size * 0.1, size * 0.88, size * 0.8, size * 0.09)

      ctx.fillStyle = '#ffd700'
      ctx.font = `bold ${Math.round(size * 0.035)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('✨ Mohan & Leepika Wedding 2026 ✨', size * 0.5, size * 0.935)
    } else if (activeFrame === 'toranam') {
      // Festive Mango Leaf & Marigold Toranam
      ctx.fillStyle = 'rgba(61, 8, 8, 0.85)'
      ctx.fillRect(size * 0.08, size * 0.88, size * 0.84, size * 0.09)
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 2
      ctx.strokeRect(size * 0.08, size * 0.88, size * 0.84, size * 0.09)

      ctx.fillStyle = '#ffe58f'
      ctx.font = `bold ${Math.round(size * 0.032)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('🌿 శుభవివాహం · Kalyanam Vibes 🌿', size * 0.5, size * 0.935)
    } else if (activeFrame === 'watermark') {
      // Discreet Royal Monogram Stamp
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.beginPath()
      ctx.roundRect(size * 0.62, size * 0.9, size * 0.35, size * 0.07, 12)
      ctx.fill()

      ctx.fillStyle = '#ffd700'
      ctx.font = `bold ${Math.round(size * 0.026)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('👑 Mohan & Leepika', size * 0.795, size * 0.945)
    }
  }

  // Handle Local Photo File Selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const compressed = await compressImage(file, 1400, 1400, 0.85)
      setCapturedBlob(compressed)
      setPreviewUrl(URL.createObjectURL(compressed))
    }
  }

  // Retake / Reset
  const retakePhoto = () => {
    setCapturedBlob(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  // Submit to Wedding Album
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!capturedBlob) return

    setIsUploading(true)
    try {
      await submitGuestPhoto(uploaderName, uploaderCaption, capturedBlob)
      onPhotoUploaded()
      handleClose()
    } catch (err) {
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    retakePhoto()
    setUploaderName('')
    setUploaderCaption('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1a0202] border-2 border-gold/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default modal-luxury-animation max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gold/30 bg-[#2b0505]">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">📸</span>
            <div>
              <h3 className="font-display font-bold text-gold-light text-sm sm:text-base">
                Snapchat Wedding Photo Booth
              </h3>
              <p className="font-telugu text-gold/75 text-[10px]">
                లైవ్ కెమెరాతో సెల్ఫీ దిగి ఆల్బమ్‌లో చేర్చండి
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-crimson text-white font-bold flex items-center justify-center hover:bg-crimson-dark text-xs"
          >
            ✕
          </button>
        </div>

        {/* ── 1. Active Camera Viewfinder or Photo Preview ── */}
        <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center">
          
          {/* Flash animation */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-40 transition-opacity duration-200 pointer-events-none opacity-100" />
          )}

          {!previewUrl ? (
            /* Live Camera Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              {hasCameraPermission === false ? (
                <div className="p-6 text-center space-y-3 text-white">
                  <span className="text-3xl">📷</span>
                  <p className="font-display text-xs text-gold-light">
                    Camera access was not granted. You can still pick a photo from your gallery!
                  </p>
                  <label className="inline-block px-5 py-2 rounded-full bg-gold text-crimson-dark font-display text-xs font-bold cursor-pointer">
                    📁 Pick Photo from Gallery
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-all ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    } ${
                      activeFilter === 'golden'
                        ? 'sepia-[0.35] saturate-[1.4] contrast-[1.1]'
                        : activeFilter === 'cinematic'
                        ? 'contrast-[1.25] saturate-[1.15]'
                        : activeFilter === 'vibrant'
                        ? 'saturate-[1.5]'
                        : ''
                    }`}
                  />

                  {/* Frame Overlay Preview */}
                  {activeFrame === 'royal-gold' && (
                    <div className="absolute inset-3 border-2 border-gold/80 rounded-2xl pointer-events-none flex flex-col justify-end p-2 items-center">
                      <div className="px-3 py-1 rounded-full bg-[#3d0808]/90 border border-gold text-[10px] font-display font-bold text-gold-light">
                        ✨ Mohan &amp; Leepika Wedding 2026 ✨
                      </div>
                    </div>
                  )}
                  {activeFrame === 'toranam' && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                      <div className="text-center text-xs font-bold text-gold-light bg-[#3d0808]/80 py-1 rounded-lg border border-gold/50">
                        🌿 వివాహ మహోత్సవం · Kalyanam Vibes 🌿
                      </div>
                    </div>
                  )}

                  {/* Camera Flip Button (Top Right of viewfinder) */}
                  <button
                    onClick={flipCamera}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-gold/60 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    title="Flip Camera (Selfie / Rear)"
                  >
                    🔄
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Captured Snapshot Preview */
            <div className="relative w-full h-full">
              <img src={previewUrl} alt="Captured snap" className="w-full h-full object-cover" />
              <button
                onClick={retakePhoto}
                className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-gold text-gold-light text-xs font-display font-bold flex items-center gap-1 shadow-lg active:scale-95"
              >
                <span>🔄</span>
                <span>Retake</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 2. Filters & Frames Bar (Before Capturing) ── */}
        {!previewUrl && hasCameraPermission !== false && (
          <div className="px-4 py-2.5 bg-[#250404] border-t border-b border-gold/20 flex items-center justify-between gap-2 overflow-x-auto">
            {/* Filter Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gold-light/70 font-display">Filter:</span>
              {(['normal', 'golden', 'cinematic', 'vibrant'] as PhotoFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-display capitalize transition-all ${
                    activeFilter === f
                      ? 'bg-gold text-crimson-dark font-bold'
                      : 'text-gold-light/80 hover:bg-gold/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Frame Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gold-light/70 font-display">Frame:</span>
              {(['none', 'royal-gold', 'toranam'] as PhotoFrame[]).map((frame) => (
                <button
                  key={frame}
                  onClick={() => setActiveFrame(frame)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-display capitalize transition-all ${
                    activeFrame === frame
                      ? 'bg-gold text-crimson-dark font-bold'
                      : 'text-gold-light/80 hover:bg-gold/10'
                  }`}
                >
                  {frame === 'royal-gold' ? '👑 Gold' : frame === 'toranam' ? '🌿 Toranam' : 'Off'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. Bottom Actions: Shutter Button or Upload Form ── */}
        <div className="p-4 bg-[#1e0303] space-y-3">
          {!previewUrl ? (
            /* Shutter Button & Gallery Upload Shortcut */
            <div className="flex items-center justify-around py-1">
              {/* Gallery upload alternative */}
              <label className="flex flex-col items-center gap-1 text-gold-light/80 hover:text-gold cursor-pointer">
                <span className="text-xl">📁</span>
                <span className="text-[10px] font-display">Gallery</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>

              {/* 🔘 Snapchat Style Circular Shutter Button */}
              <button
                onClick={takeSnapshot}
                className="group relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)] active:scale-90 transition-transform"
                title="Snap Photo"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ffd700] via-white to-[#c9a84c] group-hover:scale-95 transition-transform" />
              </button>

              {/* Flip camera */}
              <button
                onClick={flipCamera}
                className="flex flex-col items-center gap-1 text-gold-light/80 hover:text-gold"
              >
                <span className="text-xl">🔄</span>
                <span className="text-[10px] font-display">Flip</span>
              </button>
            </div>
          ) : (
            /* Caption Form & Post Button */
            <form onSubmit={handleUploadSubmit} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Your Name *"
                  className="rounded-xl px-3 py-2 text-xs bg-black/50 border border-gold/40 text-white placeholder-gold/40 focus:outline-none focus:border-gold"
                />
                <input
                  type="text"
                  value={uploaderCaption}
                  onChange={(e) => setUploaderCaption(e.target.value)}
                  placeholder="Caption / Blessing (e.g. Sangeet!)"
                  className="rounded-xl px-3 py-2 text-xs bg-black/50 border border-gold/40 text-white placeholder-gold/40 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-[#ffd700] via-[#ffe58f] to-[#c9a84c] shadow-lg shadow-gold/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <span>⚡ Compressing &amp; Posting...</span>
                ) : (
                  <>
                    <span>📸 Post to Wedding Album</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
