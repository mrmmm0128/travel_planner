-- 1. profiles テーブル (Supabaseの認証システム auth.users と紐づく想定)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. itineraries テーブル (しおりメタデータ)
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false NOT NULL,
  location TEXT, -- 例：'北海道', '関東', '関西', '沖縄', 'その他'
  purpose TEXT,  -- 例：'一人旅', '女子旅', '家族旅行', 'デート', '友達と'
  budget TEXT,   -- 例：'1万円未満', '1〜3万円', '3〜5万円', '5万円以上'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. itinerary_days テーブル (日程：Day1, Day2...)
CREATE TABLE public.itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL, -- 1, 2, 3...
  date DATE, -- 実際の日付（任意）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. events テーブル (各日程の予定)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  time TIME,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- 例：'transit', 'meal', 'activity'
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0, -- 表示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. itinerary_members テーブル (プライベート共有のメンバー)
CREATE TABLE public.itinerary_members (
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('editor', 'viewer')), -- 編集者か閲覧者か
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (itinerary_id, user_id)
);

-- 6. likes テーブル (いいね)
CREATE TABLE public.likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, itinerary_id)
);

-- 7. comments テーブル (コメント)
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- RLS (Row Level Security) の有効化
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 簡易的なRLSポリシー例（必要に応じてカスタマイズ）
-- ==========================================

-- profiles: 全員閲覧可、更新は本人のみ
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- itineraries: 全体公開のものは誰でも閲覧可
CREATE POLICY "Public itineraries are viewable by everyone." ON public.itineraries FOR SELECT USING (is_public = true);
-- itineraries: 作成者または招待メンバーは閲覧可
CREATE POLICY "Owner and members can view private itineraries." ON public.itineraries FOR SELECT USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM public.itinerary_members WHERE itinerary_id = itineraries.id AND user_id = auth.uid())
);
-- itineraries: 作成者のみすべてのアクションが可能
CREATE POLICY "Owner can do everything." ON public.itineraries FOR ALL USING (auth.uid() = owner_id);

-- itinerary_days / events: しおり自体が閲覧可能なら紐づく日程・予定も閲覧可
CREATE POLICY "Viewable if itinerary is viewable" ON public.itinerary_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_days.itinerary_id)
);
CREATE POLICY "Viewable if day is viewable" ON public.events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itinerary_days WHERE id = events.day_id)
);

-- likes / comments: 全員閲覧可、作成はログインユーザーのみ、削除は本人のみ
CREATE POLICY "Likes viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
