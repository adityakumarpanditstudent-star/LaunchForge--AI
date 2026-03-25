-- 1. Create templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SaaS', 'Startup', 'E-commerce', 'Personal Brand', 'Agency', 'App')),
  content_json JSONB NOT NULL,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS and add policy (ignore error if already exists)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'templates' AND policyname = 'Templates are viewable by everyone') THEN
        CREATE POLICY "Templates are viewable by everyone" ON public.templates FOR SELECT USING (true);
    END IF;
END $$;

-- 3. Clear existing templates
DELETE FROM public.templates;

-- 4. Insert 6 realistic templates
INSERT INTO public.templates (name, category, content_json)
VALUES 
(
  'Nexus SaaS', 
  'SaaS', 
  '{
    "hero": {
      "headline": "Supercharge Your Workflow with AI",
      "subheadline": "The ultimate automation platform for modern teams. Eliminate busywork and focus on what matters most.",
      "cta": "Start Free Trial"
    },
    "features": [
      {"title": "Intelligent Automation", "description": "Let AI handle your repetitive tasks with 99% accuracy and zero downtime.", "icon": "zap"},
      {"title": "Advanced Analytics", "description": "Deep insights into your team performance and project health in real-time.", "icon": "bar-chart"},
      {"title": "Global Integrations", "description": "Connect with 500+ apps including Slack, Jira, and GitHub effortlessly.", "icon": "layers"}
    ],
    "testimonials": [
      {"quote": "Nexus AI saved us 20 hours a week per employee. It is a game-changer.", "author": "Sarah Chen", "role": "CTO at TechFlow"},
      {"quote": "The most intuitive SaaS landing page we have ever used. Highly recommended.", "author": "Mark R.", "role": "Product Lead at Innovate"}
    ],
    "cta_section": {
      "title": "Ready to scale your team?",
      "subtitle": "Join 5,000+ companies building the future with Nexus.",
      "button": "Get Started Now"
    }
  }'
),
(
  'Nova Startup', 
  'Startup', 
  '{
    "hero": {
      "headline": "Build the Future, Today",
      "subheadline": "Nova provides the tools and vision to turn your next big idea into a world-class company.",
      "cta": "Join the Beta"
    },
    "features": [
      {"title": "Rapid Prototyping", "description": "Go from concept to MVP in days, not months, with our pre-built modules.", "icon": "rocket"},
      {"title": "Founder Network", "description": "Get exclusive access to a community of successful entrepreneurs and investors.", "icon": "users"},
      {"title": "Scale Ready", "description": "Our infrastructure grows with you, from your first user to your first million.", "icon": "trending-up"}
    ],
    "testimonials": [
      {"quote": "Nova gave us the foundation to raise our Seed round in record time.", "author": "James Wilson", "role": "Founder of Solarly"},
      {"quote": "Everything a startup needs to launch and grow effectively.", "author": "Elena G.", "role": "COO at Pulse"}
    ],
    "cta_section": {
      "title": "Your journey starts here.",
      "subtitle": "Limited beta spots available for early-stage founders.",
      "button": "Apply for Access"
    }
  }'
),
(
  'Vogue Style', 
  'E-commerce', 
  '{
    "hero": {
      "headline": "Upgrade Your Style with Premium Products",
      "subheadline": "Discover a curated collection of high-end fashion and lifestyle essentials designed for the modern individual.",
      "cta": "Shop Now"
    },
    "features": [
      {"title": "Premium Quality", "description": "Hand-picked materials sourced from the finest suppliers across the globe.", "icon": "star"},
      {"title": "Fast Shipping", "description": "Free express shipping on all orders over ₹999. Delivered to your doorstep.", "icon": "truck"},
      {"title": "Easy Returns", "description": "Not satisfied? Return any item within 30 days for a full, no-questions-asked refund.", "icon": "refresh-cw"}
    ],
    "testimonials": [
      {"quote": "The quality of these products is unmatched. I love my new wardrobe!", "author": "Anita Desai", "role": "Fashion Influencer"},
      {"quote": "Seamless shopping experience and lightning-fast delivery.", "author": "Rahul K.", "role": "Verified Buyer"}
    ],
    "cta_section": {
      "title": "Exclusive Season Sale",
      "subtitle": "Get up to 40% off on our new arrivals for a limited time.",
      "button": "View Collection"
    }
  }'
),
(
  'Personal Pro', 
  'Personal Brand', 
  '{
    "hero": {
      "headline": "Hi, I am David – I Help You Grow",
      "subheadline": "Strategic consulting and mentorship for creators who want to build a lasting legacy and 7-figure business.",
      "cta": "Work With Me"
    },
    "features": [
      {"title": "Brand Strategy", "description": "Define your unique voice and position yourself as an authority in your niche.", "icon": "target"},
      {"title": "Content Engine", "description": "Master the art of storytelling and build a loyal audience across all platforms.", "icon": "edit-3"},
      {"title": "Monetization", "description": "Turn your passion into profit with proven systems for high-ticket coaching.", "icon": "dollar-sign"}
    ],
    "testimonials": [
      {"quote": "David’s systems completely changed how I approach my personal brand.", "author": "Chris Do", "role": "Creator of The Futur"},
      {"quote": "From 0 to 100k followers in 6 months. The results speak for themselves.", "author": "Sophie L.", "role": "Digital Artist"}
    ],
    "cta_section": {
      "title": "Ready to level up?",
      "subtitle": "Book a free 15-minute discovery call to see if we are a good fit.",
      "button": "Book My Call"
    }
  }'
),
(
  'Apex Agency', 
  'Agency', 
  '{
    "hero": {
      "headline": "We Build Brands That Convert",
      "subheadline": "A full-service creative agency specializing in high-performance design, development, and digital marketing.",
      "cta": "Book a Call"
    },
    "features": [
      {"title": "UX/UI Design", "description": "We create beautiful, functional interfaces that users love and competitors envy.", "icon": "layout"},
      {"title": "Custom Dev", "description": "Clean, scalable code built with the latest technologies like Next.js and Tailwind.", "icon": "code"},
      {"title": "Growth Marketing", "description": "Data-driven campaigns that drive traffic, leads, and sales to your business.", "icon": "pie-chart"}
    ],
    "testimonials": [
      {"quote": "Apex is hands down the best agency we have worked with. They just get it.", "author": "Michael Scott", "role": "Regional Manager at Dunder Mifflin"},
      {"quote": "Our conversion rate tripled within two months of working with them.", "author": "Pam B.", "role": "Marketing Director"}
    ],
    "cta_section": {
      "title": "Let’s build something great.",
      "subtitle": "We are currently accepting new projects for Q3 2026.",
      "button": "Start Your Project"
    }
  }'
),
(
  'Zenith App', 
  'App', 
  '{
    "hero": {
      "headline": "Your Life, Simplified",
      "subheadline": "Zenith is the only app you need to manage your health, wealth, and happiness in one beautiful place.",
      "cta": "Download Now"
    },
    "features": [
      {"title": "All-in-One", "description": "No more switching between 10 different apps. Everything you need is right here.", "icon": "smartphone"},
      {"title": "Smart Sync", "description": "Your data is always up-to-date across your phone, tablet, and desktop.", "icon": "cloud"},
      {"title": "Privacy First", "description": "We use bank-grade encryption to ensure your personal data stays yours.", "icon": "lock"}
    ],
    "testimonials": [
      {"quote": "Zenith has literally changed my daily routine for the better.", "author": "Kevin Rose", "role": "Tech Investor"},
      {"quote": "The cleanest UI I have ever seen in a mobile application.", "author": "Marques B.", "role": "Tech Reviewer"}
    ],
    "cta_section": {
      "title": "Available on all platforms.",
      "subtitle": "Get Zenith for free today on iOS and Android.",
      "button": "Get the App"
    }
  }'
);
