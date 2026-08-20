import { createClient } from '@supabase/supabase-js'
import type { WishItem } from '../types/wedding'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface RsvpRecord {
  id?: string
  name: string
  phone: string
  guests: string
  attendance: string
  events: string
  dietary: string
  message?: string
  created_at?: string
}

// ── 1. Storage Upload Helper (Voice Notes, Videos, Photos) ──
export async function uploadWeddingMedia(
  file: Blob | File,
  folder: 'audio' | 'video' | 'photos',
  fileExtension: string
): Promise<string | null> {
  if (!supabase) return null

  try {
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`
    const { error } = await supabase.storage
      .from('wedding-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.warn('Supabase storage upload error:', error.message)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from('wedding-media')
      .getPublicUrl(fileName)

    return publicUrlData.publicUrl
  } catch (err) {
    console.warn('Failed to upload media to Supabase:', err)
    return null
  }
}

// ── 2. Wishes Database Helpers ──
export async function fetchLiveWishes(fallbackWishes: WishItem[]): Promise<WishItem[]> {
  if (!supabase) return fallbackWishes

  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return fallbackWishes
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      relation: item.relation || 'Well Wisher',
      location: item.location || undefined,
      message: item.message,
      audioUrl: item.audio_url || undefined,
      audioDuration: item.audio_duration || undefined,
      videoUrl: item.video_url || undefined,
      photoUrl: item.photo_url || undefined,
      timeAgo: formatTimeAgo(new Date(item.created_at || Date.now())),
      likes: item.likes || 0,
    }))
  } catch (err) {
    console.warn('Error fetching wishes from Supabase:', err)
    return fallbackWishes
  }
}

export async function submitLiveWish(wish: Omit<WishItem, 'id' | 'timeAgo'>): Promise<WishItem | null> {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('wishes')
      .insert([
        {
          name: wish.name,
          relation: wish.relation,
          location: wish.location || null,
          message: wish.message,
          audio_url: wish.audioUrl || null,
          audio_duration: wish.audioDuration || null,
          video_url: wish.videoUrl || null,
          photo_url: wish.photoUrl || null,
          likes: wish.likes || 1,
        },
      ])
      .select()
      .single()

    if (error || !data) {
      console.warn('Error saving wish to Supabase:', error?.message)
      return null
    }

    return {
      id: data.id,
      name: data.name,
      relation: data.relation,
      location: data.location || undefined,
      message: data.message,
      audioUrl: data.audio_url || undefined,
      audioDuration: data.audio_duration || undefined,
      videoUrl: data.video_url || undefined,
      photoUrl: data.photo_url || undefined,
      timeAgo: 'Just now',
      likes: data.likes || 1,
    }
  } catch (err) {
    console.warn('Error inserting wish:', err)
    return null
  }
}

export async function likeLiveWish(wishId: string): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.rpc('increment_wish_likes', { wish_id: wishId })
    if (error) {
      // Fallback update if RPC function is not created
      const { data } = await supabase.from('wishes').select('likes').eq('id', wishId).single()
      if (data) {
        await supabase.from('wishes').update({ likes: (data.likes || 0) + 1 }).eq('id', wishId)
      }
    }
    return true
  } catch (err) {
    return false
  }
}

// ── 3. RSVP Database Helpers ──
export async function submitLiveRsvp(rsvp: RsvpRecord): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.from('rsvps').insert([rsvp])
    if (error) {
      console.warn('Error saving RSVP to Supabase:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn('Error submitting RSVP:', err)
    return false
  }
}

export async function fetchLiveRsvps(): Promise<RsvpRecord[]> {
  if (!supabase) {
    return JSON.parse(localStorage.getItem('wedding_rsvps') || '[]')
  }

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return JSON.parse(localStorage.getItem('wedding_rsvps') || '[]')
    }

    return data
  } catch (err) {
    return JSON.parse(localStorage.getItem('wedding_rsvps') || '[]')
  }
}

export async function deleteLiveRsvp(id: string): Promise<boolean> {
  if (!supabase) return true
  try {
    const { error } = await supabase.from('rsvps').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function deleteLiveWish(id: string): Promise<boolean> {
  if (!supabase) return true
  try {
    const { error } = await supabase.from('wishes').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

// Helper: Time ago formatter
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
