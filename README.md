# Noorul Hassan — Full Stack Developer & AI Engineer Portfolio & Admin CMS

A production-ready personal portfolio website and integrated Content Management System (CMS) engineered for **Noorul Hassan**, a Full Stack Developer & AI Engineer.

Built with Next.js App Router, React 19, TypeScript, Tailwind CSS, and Supabase (PostgreSQL, Storage, Auth, and Row-Level Security).

---

## 🌟 Key Features

### Part A: Public-Facing Multi-Page Portfolio
- **Homepage (`/`)**: High-impact two-column layout featuring Noorul's introduction, hero copy, action buttons, dynamic profile photo container, core focus domain highlights, and featured projects preview.
- **About Me (`/about`)**: Editorial layout containing professional biography, academic foundation at B.S. Abdur Rahman Crescent Institute of Science and Technology, technical interests, development philosophy, and areas of specialization.
- **Technical Skills (`/skills`)**: Categorized technical stacks (Frontend, Backend, AI & Machine Learning, Database, Tools) with modern badges and technology icons.
- **Projects Showcase (`/projects`)**: Filterable project gallery with real-time domain filtering (All, Full Stack, AI/ML, Generative AI, Web Development) and instant keyword search. Initial curated projects:
  1. **CalQuity**: Multi-provider embedding evaluation (Cohere vs. Voyage) benchmarking FAISS vs. Supabase PGVector hybrid retrieval.
  2. **RAG Chatbot with Voice and Emotion Detection**: Conversational assistant with SpeechRecognition, facial emotion detection (DeepFace), and GPT-4o mini streaming.
  3. **Heart Disease Prediction**: Random Forest machine learning classification model with 98% validation accuracy.
  4. **Stock Price Prediction**: LSTM-based recurrent neural network time-series forecasting.
  5. **MNIST Digit Recognition**: Convolutional Neural Network (CNN) handwritten digit recognition.
- **Individual Project Detail Pages (`/projects/[slug]`)**: Dynamic deep-dive pages detailing problem statement, proposed solution, system architecture, tech stack, key features, challenges & engineering solutions, and empirical metrics.
- **Experience Timeline (`/experience`)**: Chronological timeline of internships, research contributions, and technical training.
- **Certifications (`/certifications`)**: Verified credentials in Deep Learning, Full Stack Engineering, and Machine Learning with issuer verification links.
- **Contact (`/contact`)**: Validated contact form that saves inquiries directly into Supabase PostgreSQL, paired with direct email and social links.

### Part B: Secure Administrator CMS
- **Overview (`/admin/dashboard`)**: Live metrics (published projects, total skills, certifications, timeline entries, inbox inquiries), quick action links, and recent message feed.
- **Hero & Profile Editor (`/admin/homepage`)**: Live customization of name, designations, hero text, CTA buttons, social profiles, and profile photo cropping/positioning controls.
- **About Me Editor (`/admin/about`)**: Paragraph-by-paragraph biography management, education credentials, and philosophy.
- **Projects Manager (`/admin/projects`)**: Full CRUD (Create, Read, Update, Delete, Duplicate) with draft/publish toggles, featured flags, and rich metadata fields.
- **Skills Manager (`/admin/skills`)**: Manage technical skills, categories, icons, and display toggles.
- **Experience Manager (`/admin/experience`)**: Add and edit internships, responsibilities, and dates.
- **Certifications Manager (`/admin/certifications`)**: Add and edit verified certificates and credential links.
- **Resume Manager (`/admin/resume`)**: Upload and replace PDF resume, preview files, and toggle public downloads.
- **Inbound Messages Inbox (`/admin/messages`)**: Read, filter (All, Unread, Archived), mark as read/unread, delete, and reply via mailto.
- **Media Library (`/admin/media`)**: Centralized asset repository with copy-to-clipboard URLs and file type categorization.
- **Appearance Settings (`/admin/appearance`)**: Accent color palettes (Blue, Indigo, Emerald, Violet, Slate, Amber), theme presets, and footer customization.
- **SEO & Social Graph (`/admin/seo`)**: Manage global title, meta descriptions, Open Graph images, and route-specific tags.
- **System Settings (`/admin/settings`)**: Site name, contact email, social channels, and maintenance mode toggle.

---

## 🏗️ Technology Architecture

- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, `@tailwindcss/postcss`
- **Icons**: Lucide React & Custom SVG Social Icons
- **Database & Auth**: Supabase PostgreSQL, Row-Level Security (RLS), Supabase Storage
- **Dual-Mode Data Access (`lib/db.ts`)**: Connects to Supabase when environment variables are supplied, with built-in instant local persistent fallback for seamless development.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd protfolio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Supabase Database Migration
Execute the SQL script located at:
```
supabase/migrations/20240101_initial_schema.sql
```
in the **Supabase Dashboard -> SQL Editor**. This creates all tables, indexes, Row Level Security (RLS) policies, and storage bucket definitions.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio.

### 5. Access Administrator CMS
Visit [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) (or `/admin/login`).

---

## 📦 Production Build

```bash
npm run build
npm run start
```
