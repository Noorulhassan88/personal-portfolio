export interface HomepageSettings {
  id: string;
  name: string;
  designation: string;
  hero_intro: string;
  hero_heading: string;
  description: string;
  profile_photo_url: string;
  profile_photo_position?: { x: number; y: number; scale: number };
  button_explore_label: string;
  button_explore_link: string;
  button_about_label: string;
  button_about_link: string;
  button_resume_label: string;
  resume_url: string;
  resume_enabled: boolean;
  social_github: string;
  social_linkedin: string;
  social_email: string;
  featured_tags: string[];
  featured_project_ids: string[];
  sections_enabled: {
    hero: boolean;
    domains: boolean;
    featured_projects: boolean;
    quick_contact: boolean;
  };
  updated_at?: string;
}

export interface AboutContent {
  id: string;
  full_name: string;
  header_title?: string;
  header_description?: string;
  photo_url?: string;
  bio_paragraphs: string[];
  education: EducationEntry[];
  technical_interests: string[];
  development_philosophy?: string;
  career_objectives?: string;
  areas_of_specialization: {
    title: string;
    description: string;
    icon: string;
  }[];
  additional_photos?: string[];
  updated_at?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  start_year: string;
  end_year: string;
  grade?: string;
  description?: string;
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: "Full Stack" | "AI/ML" | "Generative AI" | "Web Development" | string;
  short_description: string;
  full_description: string;
  technologies: string[];
  thumbnail_url: string;
  screenshots: string[];
  architecture_diagram_url?: string;
  architecture_notes?: string;
  github_url?: string;
  live_demo_url?: string;
  video_url?: string;
  problem_statement?: string;
  solution?: string;
  key_features: string[];
  technical_implementation: string;
  challenges_solutions: {
    challenge: string;
    solution: string;
  }[];
  results_metrics: string[];
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  designation: string;
  type: "Internship" | "Work Experience" | "Technical Training" | "Professional Contribution";
  location?: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string[];
  technologies: string[];
  sort_order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  verification_url?: string;
  image_url?: string;
  is_published: boolean;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  file_type: "image" | "pdf" | "other";
  size: number;
  bucket: string;
  created_at: string;
}

export interface AppearanceSettings {
  id: string;
  accent_color: string; // e.g. '#2563eb'
  accent_name: "blue" | "indigo" | "emerald" | "violet" | "slate" | "amber";
  bg_preset: "clean-white" | "warm-white" | "soft-zinc";
  font_preset: "modern-sans" | "editorial" | "technical";
  logo_text: string;
  footer_text: string;
  nav_blur: boolean;
  updated_at?: string;
}

export interface SeoSettings {
  id: string;
  global_title: string;
  global_description: string;
  og_image_url: string;
  site_url: string;
  page_meta: Record<
    string,
    {
      title: string;
      description: string;
      keywords?: string[];
    }
  >;
  updated_at?: string;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  contact_email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url?: string;
  copyright_text: string;
  contact_form_enabled: boolean;
  maintenance_mode: boolean;
  analytics_enabled: boolean;
  updated_at?: string;
}

export interface FooterSettings {
  id: string;
  brand_monogram: string;
  brand_name: string;
  bio_description: string;
  status_text: string;
  status_enabled: boolean;
  nav_title: string;
  connect_title: string;
  github_url: string;
  linkedin_url: string;
  email: string;
  bottom_left_text: string;
  cta_text: string;
  cta_link: string;
  updated_at?: string;
}
