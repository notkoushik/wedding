import { useState, useEffect } from 'react'

export function AccessibilityBar() {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const [isExpanded, setIsExpanded] = useState(false)

  // Apply root font scaling for elderly readability
  useEffect(() => {
    const root = document.documentElement
    if (fontSize === 'large') {
      root.style.fontSize = '17.5px'
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '19px'
    } else {
      root.style.fontSize = '16px'
    }
  }, [fontSize])

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (type: 'hyd' | 'vizag') => {
    if (type === 'hyd') {
      // 22 Aug 2026, 11:59 PM to 23 Aug 2026, 04:00 AM IST
      const title = encodeURIComponent('Mohan & Leepika Wedding Sumuhurtham (మోహన్ & లీపిక వివాహం)')
      const details = encodeURIComponent(
        'Sacred Wedding Ceremony of Mohan Praneeth & Leepika at Srinivasa Kalyana Mandapam, Dilsukhnagar, Hyderabad.'
      )
      const location = encodeURIComponent('Srinivasa Kalyana Mandapam, Dilsukhnagar, Hyderabad, Telangana')
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260822T182900Z/20260822T223000Z&details=${details}&location=${location}`
    } else {
      // 29 Aug 2026, 07:00 PM IST
      const title = encodeURIComponent('Mohan & Leepika Grand Reception (వివాహ రిసెప్షన్)')
      const details = encodeURIComponent(
        'Grand Wedding Reception of Mohan Praneeth & Leepika at Royal Palace Function Hall, Visakhapatnam.'
      )
      const location = encodeURIComponent('Royal Palace Function Hall, Beach Road, Visakhapatnam, Andhra Pradesh')
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260829T133000Z/20260829T173000Z&details=${details}&location=${location}`
    }
  }

  // 1-Tap WhatsApp Share Invitation
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      '👑 You are cordially invited to the Wedding of Mohan Praneeth & Leepika on 22nd August 2026 in Hyderabad! ✨\n\nView the Royal Digital Shubhalekha, Muhurtham Timings, Photo Booth & Live Wishes here:\n' +
        window.location.href
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div className="fixed top-20 right-3 sm:right-5 z-40">
      <div className="relative">
        {/* Trigger Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-full bg-[#3d0808]/90 border border-gold/70 text-gold-light text-xs font-display font-bold shadow-xl backdrop-blur-md hover:bg-crimson hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          title="Accessibility & Quick Tools (అందుబాటు సాధనాలు)"
        >
          <span className="text-sm">👁️</span>
          <span className="hidden sm:inline">Elder Clarity &amp; Tools</span>
          <span className="text-[10px] text-gold-bright font-telugu font-normal">(సహాయకం)</span>
        </button>

        {/* Dropdown Menu */}
        {isExpanded && (
          <div className="absolute right-0 mt-2 w-64 p-3.5 rounded-2xl bg-[#240303]/95 border-2 border-gold/80 shadow-2xl text-white backdrop-blur-xl space-y-3 animate-fade-in-down z-50">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/20 pb-2">
              <span className="font-display font-bold text-gold-light text-xs uppercase tracking-wider">
                Accessibility &amp; Tools
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-5 h-5 rounded-full bg-crimson text-white text-[10px] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Font Size Zoom for Elders */}
            <div>
              <p className="font-telugu text-[11px] text-gold-light/80 mb-1.5">
                అక్షరాల పరిమాణం (Text Zoom):
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'normal' as const, label: 'A (Normal)' },
                  { id: 'large' as const, label: 'A+ (Large)' },
                  { id: 'xlarge' as const, label: 'A++ (Extra)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f.id)}
                    className={`py-1 rounded-lg text-[10px] font-display font-bold transition-all ${
                      fontSize === f.id
                        ? 'bg-gold text-[#3a0505] shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Tap Calendar Reminders */}
            <div className="border-t border-gold/15 pt-2 space-y-1.5">
              <p className="font-display text-[11px] text-gold-light font-bold">
                📅 Add to Google Calendar:
              </p>
              <div className="flex flex-col gap-1">
                <a
                  href={getGoogleCalendarUrl('hyd')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold-light text-[10px] font-display font-semibold flex items-center justify-between transition-all"
                >
                  <span>🪔 Sumuhurtham (Hyd · 22 Aug)</span>
                  <span>+ Add</span>
                </a>
                <a
                  href={getGoogleCalendarUrl('vizag')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold-light text-[10px] font-display font-semibold flex items-center justify-between transition-all"
                >
                  <span>✨ Reception (Vizag · 29 Aug)</span>
                  <span>+ Add</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Share */}
            <div className="border-t border-gold/15 pt-2">
              <button
                onClick={shareOnWhatsApp}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>💬</span>
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
