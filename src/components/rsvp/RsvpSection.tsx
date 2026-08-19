import { useState, useRef, useEffect } from 'react'
import { SectionLabel, GoldDivider, GoldStrip } from '../common/GoldDivider'
import { OrnateCard } from '../common/OrnateCard'

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

export function RsvpSection() {
  const [ref, visible] = useInView()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    guests: '1',
    attendance: 'yes',
    events: 'both',
    dietary: 'traditional',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Save to local storage for offline / quick inspection
    setTimeout(() => {
      const existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]')
      const newEntry = {
        ...form,
        submittedAt: new Date().toISOString(),
      }
      localStorage.setItem('wedding_rsvps', JSON.stringify([...existingRsvps, newEntry]))

      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  const inputCls = `w-full rounded-xl px-4 py-3 font-body text-sm text-[#1c0a0a] bg-white
    border border-gold/40 placeholder-[#7a4a4a]/40
    focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15 transition-all duration-200`

  return (
    <section
      id="rsvp"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 50%, #5c0a0a 0%, #3d0808 60%, #220303 100%)',
      }}
    >
      <div className="absolute inset-0 fan-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 pointer-events-none">
        <GoldStrip />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel title="RSVP" sub="Will You Join Us?" light />

          {submitted ? (
            <OrnateCard className="text-center py-12 px-6 sm:px-10 space-y-5 animate-fadeUp">
              <div className="text-5xl animate-bounce">🌸</div>
              <h3
                className="font-calligraphy text-crimson-dark leading-none font-bold"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 3.2rem)' }}
              >
                Thank You, {form.name}!
              </h3>
              <p className="font-body italic text-[#633a3a] text-sm leading-relaxed max-w-md mx-auto">
                Your response has been registered with joy. Your presence will make our special day truly memorable.
              </p>
              <p className="font-telugu text-gold-dark font-semibold text-sm">
                మీరు వస్తారని కుటుంబ సభ్యులందరం ఆనందంగా ఎదురుచూస్తున్నాము!
              </p>

              <GoldDivider />

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-xs space-y-1 text-[#7a4a4a]">
                <p>
                  <span className="font-semibold text-crimson-dark">Guest Count:</span> {form.guests} {form.guests === '1' ? 'Person' : 'People'}
                </p>
                <p>
                  <span className="font-semibold text-crimson-dark">Events:</span>{' '}
                  {form.events === 'both'
                    ? 'Both Wedding & Reception'
                    : form.events === 'wedding'
                    ? 'Sumuhurtham (Hyderabad)'
                    : 'Grand Reception (Vizag)'}
                </p>
              </div>

              <div className="pt-2">
                <p className="font-calligraphy text-crimson text-3xl leading-none">
                  Mohan Praneeth &amp; Leepika
                </p>
                <p className="font-display italic text-gold-dark text-xs mt-1">
                  22nd August 2026
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-gold-dark hover:text-crimson font-display underline pt-2"
              >
                Edit or Submit Another RSVP
              </button>
            </OrnateCard>
          ) : (
            <OrnateCard>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Koushik & Family"
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className={inputCls}
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Total Guests Attending
                    </label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={form.guests}
                      onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                    >
                      {['1', '2', '3', '4', '5', '6+'].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === '6+' ? 'or more' : n === '1' ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Attendance Status
                    </label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={form.attendance}
                      onChange={(e) => setForm((f) => ({ ...f, attendance: e.target.value }))}
                    >
                      <option value="yes">🌸 Joyfully Accept</option>
                      <option value="maybe">⏳ Tentatively Accept</option>
                      <option value="no">✉️ Regretfully Decline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Ceremonies You're Attending
                    </label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={form.events}
                      onChange={(e) => setForm((f) => ({ ...f, events: e.target.value }))}
                    >
                      <option value="both">Both Wedding &amp; Reception</option>
                      <option value="wedding">Wedding Only (Hyderabad)</option>
                      <option value="reception">Reception Only (Vizag)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                      Meal Preference
                    </label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={form.dietary}
                      onChange={(e) => setForm((f) => ({ ...f, dietary: e.target.value }))}
                    >
                      <option value="traditional">Traditional South Indian Feast</option>
                      <option value="pure-veg">Pure Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-display text-crimson-dark text-[10px] uppercase tracking-widest block mb-1.5 font-semibold">
                    Personal Wishes / Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Your blessings, love and warm wishes for Mohan & Leepika..."
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-display text-parchment text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #3d0808, #8b1a1a, #3d0808)',
                  }}
                >
                  {loading ? 'Submitting...' : 'Confirm My RSVP 🌸'}
                </button>
              </form>
            </OrnateCard>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: '64px' }}
        >
          <path d="M0 32 Q360 64 720 40 Q1080 16 1440 56 L1440 64 L0 64 Z" fill="#220303" />
        </svg>
      </div>
    </section>
  )
}
