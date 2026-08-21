import React, { useState, useEffect } from 'react'
import {
  fetchPhotoComments,
  addPhotoComment,
  type PhotoComment,
  type GuestPhotoItem,
  formatTimeAgo,
} from '../../lib/supabase'

interface PhotoCommentsModalProps {
  photo: GuestPhotoItem | null
  isOpen: boolean
  onClose: () => void
  onCommentAdded?: () => void
}

export function PhotoCommentsModal({
  photo,
  isOpen,
  onClose,
  onCommentAdded,
}: PhotoCommentsModalProps) {
  const [comments, setComments] = useState<PhotoComment[]>([])
  const [name, setName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('wedding_guest_name') || ''
    if (savedName) setName(savedName)
  }, [])

  // Load comments for current photo
  const loadComments = async () => {
    if (!photo) return
    setIsLoading(true)
    const list = await fetchPhotoComments(photo.id)
    setComments(list)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isOpen && photo) {
      loadComments()
    }
  }, [isOpen, photo?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo || !commentText.trim()) return

    const authorName = name.trim() || 'Well Wisher'
    localStorage.setItem('wedding_guest_name', authorName)

    setIsSubmitting(true)
    const newComment = await addPhotoComment(photo.id, authorName, commentText.trim())
    setComments((prev) => [...prev, newComment])
    setCommentText('')
    setIsSubmitting(false)

    if (onCommentAdded) {
      onCommentAdded()
    }
  }

  if (!isOpen || !photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fffdf9] rounded-3xl overflow-hidden border-2 border-gold/70 shadow-2xl flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#3d0808] via-[#5c0a0a] to-[#3d0808] p-4 text-white flex items-center justify-between border-b-2 border-gold/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gold/60 bg-black shrink-0">
              <img
                src={photo.photo_url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-gold-light text-sm sm:text-base leading-tight">
                {photo.name}'s Photo
              </h3>
              <p className="text-[11px] text-parchment/75 italic">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'} &amp; Blessings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-crimson text-white font-bold flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#faf6ed] min-h-[160px] max-h-[45vh]">
          {isLoading ? (
            <div className="text-center py-8 text-gold-dark text-xs font-display animate-pulse">
              Loading blessings &amp; comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 px-4 space-y-2">
              <span className="text-3xl">💬</span>
              <p className="font-display text-sm text-[#5c0a0a] font-bold">
                Be the first to leave a blessing!
              </p>
              <p className="font-display text-xs text-[#7a4a4a] italic">
                Share a sweet memory or compliment on this moment.
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gold/25 shadow-sm space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold to-gold-light flex items-center justify-center text-[10px] font-bold text-[#3a0505] shadow-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-display font-bold text-xs sm:text-sm text-crimson">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-display text-gold-dark/70">
                    {formatTimeAgo(new Date(c.created_at))}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d0808] pl-8 leading-relaxed">
                  {c.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gold/30 space-y-2.5"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-1/3 px-3 py-2 rounded-xl text-xs bg-[#fdfaf2] border border-gold/40 text-[#3d0808] focus:outline-none focus:border-crimson"
              required
            />
            <input
              type="text"
              placeholder="Write a sweet comment or blessing..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#fdfaf2] border border-gold/40 text-[#3d0808] focus:outline-none focus:border-crimson"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#7a4a4a]">
              <span>✨</span>
              <span>Visible to all wedding guests</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-5 py-2 rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#3a0505] bg-gradient-to-r from-gold via-gold-bright to-gold hover:brightness-110 shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>💬</span>
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
