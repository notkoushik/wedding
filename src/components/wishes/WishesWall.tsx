import { useState, useRef, useEffect } from 'react'
import { SectionLabel, GoldDivider } from '../common/GoldDivider'
import { OrnateCard } from '../common/OrnateCard'

interface Wish {
  id: string
  name: string
  relation: string
  message: string
  timeAgo: string
  likes: number
}

const INITIAL_WISHES: Wish[] = [
  {
    id: '1',
    name: 'Suresh & Lakshmi Turupada',
    relation: 'Uncle & Aunt',
    message: 'Wishing Mohan Praneeth & Leepika a lifetime of joy, harmony, and prosperity! శ్రీరామచంద్రుని ఆశీస్సులు ఎల్లప్పుడూ మీకు తోడుండాలి.',
    timeAgo: 'Just now',
    likes: 24,
  },
  {
    id: '2',
    name: 'Rajesh Guntreddi',
    relation: 'Cousin',
    message: 'Hearty congratulations to Mohan bro and Leepika vadina! Excited to celebrate the grand sangeet and wedding with everyone!',
    timeAgo: '2 hours ago',
    likes: 18,
  },
  {
    id: '3',
    name: 'Kavitha & Sunil Kumar Bangari',
    relation: 'Family Friends',
    message: 'May your union be blessed with eternal happiness and mutual understanding. Can’t wait for 22nd August!',
    timeAgo: 'Yesterday',
    likes: 15,
  },
]

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

export function WishesWall() {
  const [ref, visible] = useInView()
  const [wishes, setWishes] = useState<Wish[]>(() => {
    const saved = localStorage.getItem('wedding_wishes')
    return saved ? JSON.parse(saved) : INITIAL_WISHES
  })
  const [form, setForm] = useState({ name: '', relation: '', message: '' })
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const handleLike = (id: string) => {
    if (likedIds.has(id)) return
    setLikedIds((prev) => new Set(prev).add(id))
    setWishes((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
      localStorage.setItem('wedding_wishes', JSON.stringify(updated))
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    const newWish: Wish = {
      id: Date.now().toString(),
      name: form.name.trim(),
      relation: form.relation.trim() || 'Well Wisher',
      message: form.message.trim(),
      timeAgo: 'Just now',
      likes: 1,
    }

    const updated = [newWish, ...wishes]
    setWishes(updated)
    localStorage.setItem('wedding_wishes', JSON.stringify(updated))
    setForm({ name: '', relation: '', message: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const inputCls = `w-full rounded-xl px-4 py-3 font-body text-sm text-[#1c0a0a] bg-white
    border border-gold/40 placeholder-[#7a4a4a]/45
    focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15 transition-all`

  return (
    <section
      id="wishes"
      className="relative bg-[#fefbf3] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 fan-pattern opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionLabel title="Blessings & Wishes" sub="Guestbook" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Submit a Blessing Form */}
            <div className="lg:col-span-5">
              <OrnateCard>
                <h3 className="font-display font-semibold text-crimson-dark text-base text-center mb-1">
                  Send Your Blessings
                </h3>
                <p className="font-body text-xs italic text-[#7a4a4a] text-center mb-4">
                  Leave a personal wish for Mohan &amp; Leepika
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh & Family"
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                      Relationship / Family
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Groom's Friend / Relative"
                      className={inputCls}
                      value={form.relation}
                      onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="font-display text-crimson-dark text-[10px] uppercase tracking-wider block mb-1">
                      Your Message / ఆశీస్సులు *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="May Lord Venkateswara bless you both with a blissful life..."
                      className={`${inputCls} resize-none`}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-display text-xs uppercase tracking-[0.2em] font-semibold text-parchment transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #3d0808, #8b1a1a, #3d0808)',
                    }}
                  >
                    Post Blessing 🌸
                  </button>

                  {submitted && (
                    <p className="text-xs text-green-700 font-display text-center animate-fadeUp">
                      ✨ Thank you! Your blessing has been posted on the wall.
                    </p>
                  )}
                </form>
              </OrnateCard>
            </div>

            {/* Right: Live Wall of Blessings */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="font-display text-xs text-gold-dark uppercase tracking-widest font-semibold">
                  Recent Blessings ({wishes.length})
                </span>
                <span className="text-xs text-crimson font-telugu">
                  శుభాకాంక్షలు &amp; దీవెనలు
                </span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="bg-white rounded-2xl p-5 border border-gold/35 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-display font-semibold text-crimson-dark text-sm">
                          {w.name}
                        </h4>
                        <span className="inline-block text-[10px] text-gold-dark font-medium bg-gold/10 px-2 py-0.5 rounded-full mt-0.5">
                          {w.relation}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLike(w.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                          likedIds.has(w.id)
                            ? 'bg-crimson/10 text-crimson font-bold'
                            : 'bg-gold/10 text-gold-dark hover:bg-gold/20'
                        }`}
                      >
                        <span>❤️</span>
                        <span>{w.likes}</span>
                      </button>
                    </div>

                    <p className="font-body italic text-[#4a2828] text-xs sm:text-sm leading-relaxed">
                      "{w.message}"
                    </p>

                    <div className="mt-3 pt-2 border-t border-gold/15 flex items-center justify-between text-[10px] text-[#7a4a4a]/60 font-display">
                      <span>{w.timeAgo}</span>
                      <span>✦ Sacred Blessing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
