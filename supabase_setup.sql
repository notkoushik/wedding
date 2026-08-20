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

-- 3. Enable Row Level Security (RLS) & Public Policies for Wedding Guests
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and insert wishes
CREATE POLICY "Allow public read wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Allow public insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update wish likes" ON public.wishes FOR UPDATE USING (true);

-- Allow anyone to insert and read RSVPs
CREATE POLICY "Allow public insert rsvps" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read rsvps" ON public.rsvps FOR SELECT USING (true);

-- 4. Helper Function for atomic wish like increments
CREATE OR REPLACE FUNCTION increment_wish_likes(wish_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.wishes
    SET likes = likes + 1
    WHERE id = wish_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Setup Storage Bucket for Audio Voice Notes, Videos, and Photos
-- (Go to Storage in Supabase -> Create bucket named: "wedding-media" with Public Access = ON)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read wedding-media" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-media');
CREATE POLICY "Allow public upload wedding-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-media');
