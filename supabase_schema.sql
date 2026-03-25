-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'premium')),
  trial_active BOOLEAN DEFAULT TRUE,
  trial_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_requested TEXT NOT NULL CHECK (plan_requested IN ('pro', 'premium')),
  amount INTEGER NOT NULL,
  utr_number TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payment Policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Realtime subscriptions for payments
ALTER PUBLICATION supabase_realtime ADD TABLE payments;

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SaaS', 'Startup', 'E-commerce', 'Personal Brand', 'Agency', 'App')),
  content_json JSONB NOT NULL,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on templates table
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Template Policies
CREATE POLICY "Templates are viewable by everyone" ON public.templates
  FOR SELECT USING (true);
