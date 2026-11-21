-- ==============================================================================
-- SUPABASE SCHEMA MIGRATION: NOORUL HASSAN PORTFOLIO & CMS
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HOMEPAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_settings (
  id TEXT PRIMARY KEY DEFAULT 'default-homepage',
  name TEXT NOT NULL DEFAULT 'Noorul Hassan',
  designation TEXT NOT NULL DEFAULT 'Full Stack Developer | AI Engineer',
  hero_intro TEXT NOT NULL DEFAULT 'HELLO, I''M NOORUL HASSAN',
  hero_heading TEXT NOT NULL DEFAULT 'Building Intelligent Products & Digital Experiences.',
  description TEXT NOT NULL DEFAULT 'I''m passionate about developing modern web applications and intelligent AI-powered solutions that solve real-world problems.',
  profile_photo_url TEXT DEFAULT '/profile.png',
  profile_photo_position JSONB DEFAULT '{"x": 50, "y": 50, "scale": 1}'::jsonb,
  button_explore_label TEXT DEFAULT 'Explore My Work',
  button_explore_link TEXT DEFAULT '/projects',
  button_about_label TEXT DEFAULT 'About Me',
  button_about_link TEXT DEFAULT '/about',
  button_resume_label TEXT DEFAULT 'Download Resume',
  resume_url TEXT DEFAULT '/resume.pdf',
  resume_enabled BOOLEAN DEFAULT true,
  social_github TEXT DEFAULT 'https://github.com',
  social_linkedin TEXT DEFAULT 'https://linkedin.com',
  social_email TEXT DEFAULT 'noorulhassan.ai@gmail.com',
  featured_tags TEXT[] DEFAULT ARRAY['Full Stack Development', 'AI Engineering', 'Generative AI', 'Machine Learning'],
  featured_project_ids TEXT[] DEFAULT ARRAY['calquity', 'rag-chatbot-voice-emotion', 'heart-disease-prediction'],
  sections_enabled JSONB DEFAULT '{"hero": true, "domains": true, "featured_projects": true, "quick_contact": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'default-about',
  full_name TEXT NOT NULL DEFAULT 'Noorul Hassan',
  bio_paragraphs TEXT[] NOT NULL DEFAULT ARRAY[
    'I''m a Full Stack Developer and AI Engineer passionate about building scalable applications, intelligent systems and innovative digital experiences using modern web technologies and artificial intelligence.',
    'With a strong foundation in Artificial Intelligence and Data Science, I bridge the gap between machine learning research and production web engineering. I design end-to-end architectures that integrate cutting-edge LLMs, retrieval-augmented generation pipelines, and high-performance vector stores with clean, responsive user interfaces.',
    'My focus centers on delivering resilient backend services, intuitive frontend interfaces, and applied AI systems that solve genuine problems with measurable impact.'
  ],
  education JSONB NOT NULL DEFAULT '[{
    "id": "edu-crescent",
    "degree": "B.Tech in Artificial Intelligence and Data Science",
    "field": "Artificial Intelligence and Data Science",
    "institution": "B.S. Abdur Rahman Crescent Institute of Science and Technology",
    "start_year": "2021",
    "end_year": "2025",
    "grade": "First Class with Distinction",
    "description": "Comprehensive curriculum emphasizing deep learning, neural networks, machine learning algorithms, database architecture, distributed systems, and modern software engineering.",
    "highlights": [
      "Specialized in deep learning architectures and vector information retrieval",
      "Conducted research comparing multi-provider embedding models and hybrid PGVector retrieval",
      "Lead technical projects combining full-stack web platforms with conversational AI models"
    ]
  }]'::jsonb,
  technical_interests TEXT[] DEFAULT ARRAY[
    'Full Stack Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Large Language Models',
    'Retrieval-Augmented Generation',
    'Backend Engineering',
    'Modern Web Applications'
  ],
  header_title TEXT DEFAULT 'Bridging Artificial Intelligence with Modern Web Architecture.',
  header_description TEXT DEFAULT 'Discover my background, education, and technical expertise in building scalable software systems and applied AI.',
  development_philosophy TEXT DEFAULT 'I believe software should be purposeful, scalable, and meticulously crafted. Code should be clean and maintainable, architecture should anticipate real-world constraints, and AI should augment human capability with transparency, precision, and speed.',
  career_objectives TEXT DEFAULT 'To architect and deploy cutting-edge AI-native applications and robust full-stack platforms that drive meaningful business transformation and delightful user experiences on a global scale.',
  areas_of_specialization JSONB DEFAULT '[
    {"title": "Full Stack Architecture", "description": "Designing modular, high-throughput web applications using Next.js, React, Node.js, and relational database systems.", "icon": "Layers"},
    {"title": "Generative AI & LLM Systems", "description": "Developing RAG pipelines, prompt architectures, vector embeddings, and multi-modal conversational agents.", "icon": "Cpu"},
    {"title": "Machine Learning Engineering", "description": "Training, evaluating, and serving predictive ML models (Random Forests, LSTMs, CNNs) with low latency.", "icon": "Binary"},
    {"title": "Vector Search & Retrieval", "description": "Implementing hybrid semantic search with FAISS, PGVector, and top-tier embedding benchmarks.", "icon": "Database"}
  ]'::jsonb,
  additional_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKILL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  category_name TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Full Stack', 'AI/ML', 'Generative AI', 'Web Development')),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  thumbnail_url TEXT NOT NULL,
  screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
  architecture_diagram_url TEXT,
  architecture_notes TEXT,
  github_url TEXT,
  live_demo_url TEXT,
  video_url TEXT,
  problem_statement TEXT NOT NULL,
  solution TEXT NOT NULL,
  key_features TEXT[] DEFAULT ARRAY[]::TEXT[],
  technical_implementation TEXT NOT NULL,
  challenges_solutions JSONB DEFAULT '[]'::jsonb,
  results_metrics TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  designation TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Internship', 'Work Experience', 'Technical Training', 'Professional Contribution')),
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiration_date TEXT,
  credential_id TEXT,
  verification_url TEXT,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size INT NOT NULL,
  bucket TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'default-settings',
  site_name TEXT DEFAULT 'Noorul Hassan Portfolio',
  contact_email TEXT DEFAULT 'noorulhassan.ai@gmail.com',
  github_url TEXT DEFAULT 'https://github.com',
  linkedin_url TEXT DEFAULT 'https://linkedin.com',
  twitter_url TEXT DEFAULT 'https://twitter.com',
  copyright_text TEXT DEFAULT '© 2026 Noorul Hassan. All rights reserved.',
  contact_form_enabled BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'default-seo',
  global_title TEXT NOT NULL DEFAULT 'Noorul Hassan | Full Stack Developer & AI Engineer',
  global_description TEXT NOT NULL DEFAULT 'Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer specializing in modern web applications, LLMs, RAG, and intelligent systems.',
  og_image_url TEXT DEFAULT '/profile.png',
  page_meta JSONB DEFAULT '{"/": {"title": "Noorul Hassan | Full Stack Developer & AI Engineer", "description": "Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer."}}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Public READ policies (for visitors)
CREATE POLICY "Public can view homepage_settings" ON public.homepage_settings FOR SELECT USING (true);
CREATE POLICY "Public can view about_content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public can view skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public can view active skills" ON public.skills FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public can view published certifications" ON public.certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view website_settings" ON public.website_settings FOR SELECT USING (true);

-- Public INSERT for contact form
CREATE POLICY "Public can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin FULL ACCESS policies
CREATE POLICY "Admin full access on homepage_settings" ON public.homepage_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on about_content" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on skill_categories" ON public.skill_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on media_library" ON public.media_library FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on website_settings" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
-- Buckets to create in Supabase Dashboard -> Storage:
-- 1. 'profile-images' (Public)
-- 2. 'project-images' (Public)
-- 3. 'certificates' (Public)
-- 4. 'resume' (Public)
-- 5. 'website-assets' (Public)
