-- ═══════════════════════════════════════════════════════════════════════════
-- 👑 Royal Telugu Wedding Database Schema (Mohan Praneeth & Leepika)
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Wishes & Media Table
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    relation TEXT,
    location TEXT,
    message TEXT NOT NULL,
    audio_url TEXT,
    audio_duration INT,
    video_url TEXT,
    photo_url TEXT,
    likes INT DEFAULT 1
);

-- 2. Create RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    guests TEXT NOT NULL,
    attendance TEXT NOT NULL,
    events TEXT NOT NULL,
    dietary TEXT NOT NULL,
    message TEXT
);

-- 3. Create Live Guest Photo Stream Table
CREATE TABLE IF NOT EXISTS public.guest_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    caption TEXT,
    photo_url TEXT NOT NULL,
    likes INT DEFAULT 1,
    is_hidden BOOLEAN DEFAULT false
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;

-- 5. Safe Policies for Wishes (Drop first if exists, then create)
DROP POLICY IF EXISTS "Allow public read wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow public insert wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow public update wish likes" ON public.wishes;
DROP POLICY IF EXISTS "Allow public delete wishes" ON public.wishes;

CREATE POLICY "Allow public read wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Allow public insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update wish likes" ON public.wishes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete wishes" ON public.wishes FOR DELETE USING (true);

-- 6. Safe Policies for RSVPs
DROP POLICY IF EXISTS "Allow public insert rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public read rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public delete rsvps" ON public.rsvps;

CREATE POLICY "Allow public insert rsvps" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read rsvps" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public delete rsvps" ON public.rsvps FOR DELETE USING (true);

-- 7. Safe Policies for Guest Photos
DROP POLICY IF EXISTS "Allow public read guest_photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Allow public insert guest_photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Allow public update guest_photos" ON public.guest_photos;
DROP POLICY IF EXISTS "Allow public update guest_photos likes" ON public.guest_photos;
DROP POLICY IF EXISTS "Allow public delete guest_photos" ON public.guest_photos;

CREATE POLICY "Allow public read guest_photos" ON public.guest_photos FOR SELECT USING (true);
CREATE POLICY "Allow public insert guest_photos" ON public.guest_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update guest_photos" ON public.guest_photos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete guest_photos" ON public.guest_photos FOR DELETE USING (true);

-- 8. Helper Function for atomic wish like increments
CREATE OR REPLACE FUNCTION increment_wish_likes(wish_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.wishes
    SET likes = likes + 1
    WHERE id = wish_id;
END;
$$ LANGUAGE plpgsql;

-- 9. Setup Storage Bucket for Audio Voice Notes, Videos, and Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read wedding-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload wedding-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete wedding-media" ON storage.objects;

CREATE POLICY "Allow public read wedding-media" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-media');
CREATE POLICY "Allow public upload wedding-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-media');
CREATE POLICY "Allow public delete wedding-media" ON storage.objects FOR DELETE USING (bucket_id = 'wedding-media');

-- 10. Create Dynamic Photo Comments Table
CREATE TABLE IF NOT EXISTS public.photo_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    photo_id TEXT NOT NULL,
    name TEXT NOT NULL,
    comment TEXT NOT NULL
);

ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read photo_comments" ON public.photo_comments;
DROP POLICY IF EXISTS "Allow public insert photo_comments" ON public.photo_comments;
DROP POLICY IF EXISTS "Allow public delete photo_comments" ON public.photo_comments;

CREATE POLICY "Allow public read photo_comments" ON public.photo_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert photo_comments" ON public.photo_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete photo_comments" ON public.photo_comments FOR DELETE USING (true);

