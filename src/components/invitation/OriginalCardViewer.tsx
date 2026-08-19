import cardImg from '../../../Card/a45d3dae-4b4b-4761-ace0-49c629b52d58.png'

interface OriginalCardViewerProps {
  onZoom?: () => void
}

export function OriginalCardViewer({ onZoom }: OriginalCardViewerProps) {
  return (
    <div
      className="relative rounded-[26px] p-2 transition-all duration-400 group cursor-pointer hover:-translate-y-1 h-full flex flex-col justify-center"
      style={{
        background:
          'linear-gradient(135deg, #ffd700 0%, #fff2a6 25%, #c9a84c 50%, #ffd700 75%, #9b7b1b 100%)',
        boxShadow:
          '0 0 24px rgba(255, 215, 0, 0.45), 0 12px 35px rgba(92, 10, 10, 0.18)',
        border: '2px solid rgba(255, 255, 255, 0.95)',
      }}
      onClick={onZoom}
    >
      {/* Shining Gold Edge Glow */}
      <div className="absolute inset-0 rounded-[26px] animate-pulse pointer-events-none opacity-25 bg-gradient-to-r from-gold-bright via-white to-gold-bright" />

      {/* Inner Card Frame Synced to Background */}
      <div className="relative rounded-[20px] overflow-hidden bg-[#fffdf5] border border-gold/40 shadow-inner flex items-center justify-center p-1">
        <img
          src={cardImg}
          alt="Mohan Praneeth & Leepika Official Wedding Invitation Card"
          className="w-full h-auto object-contain rounded-[16px] transition-transform duration-300 ease-out"
        />
      </div>
    </div>
  )
}
