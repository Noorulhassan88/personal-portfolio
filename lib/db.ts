import {
  initialHomepageSettings,
  initialAboutContent,
  initialSkillCategories,
  initialSkills,
  initialProjects,
  initialExperience,
  initialCertifications,
  initialAppearanceSettings,
  initialSeoSettings,
  initialWebsiteSettings,
  initialContactMessages,
} from "@/data/initialData";
import {
  HomepageSettings,
  AboutContent,
  SkillCategory,
  Skill,
  Project,
  ExperienceEntry,
  Certification,
  ContactMessage,
  AppearanceSettings,
  SeoSettings,
  WebsiteSettings,
  MediaItem,
} from "@/types/portfolio";
import { createServerSupabaseClient } from "./supabase/server";

// In-memory persistent fallback store during runtime / offline development
class LocalStore {
  homepage: HomepageSettings = { ...initialHomepageSettings };
  about: AboutContent = { ...initialAboutContent };
  skillCategories: SkillCategory[] = [...initialSkillCategories];
  skills: Skill[] = [...initialSkills];
  projects: Project[] = [...initialProjects];
  experience: ExperienceEntry[] = [...initialExperience];
  certifications: Certification[] = [...initialCertifications];
  appearance: AppearanceSettings = { ...initialAppearanceSettings };
  seo: SeoSettings = { ...initialSeoSettings };
  settings: WebsiteSettings = { ...initialWebsiteSettings };
  messages: ContactMessage[] = [...initialContactMessages];
  media: MediaItem[] = [
    {
      id: "media-1",
      name: "profile.png",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      file_type: "image",
      size: 450200,
      bucket: "profile-images",
      created_at: new Date().toISOString(),
    },
    {
      id: "media-2",
      name: "calquity-cover.jpg",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      file_type: "image",
      size: 890100,
      bucket: "project-images",
      created_at: new Date().toISOString(),
    },
    {
      id: "media-3",
      name: "noorul-hassan-resume.pdf",
      url: "/resume.pdf",
      file_type: "pdf",
      size: 142050,
      bucket: "resume",
      created_at: new Date().toISOString(),
    },
  ];
}

const globalForStore = globalThis as unknown as { localStore?: LocalStore };
export const localStore = globalForStore.localStore || new LocalStore();
if (process.env.NODE_ENV !== "production") globalForStore.localStore = localStore;

// Unified Data Access Layer
export async function getHomepageSettings(): Promise<HomepageSettings> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*")
      .single();
    if (!error && data) return data as HomepageSettings;
  }
  return localStore.homepage;
}

export async function updateHomepageSettings(
  settings: Partial<HomepageSettings>
): Promise<HomepageSettings> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("homepage_settings")
      .upsert({ ...settings, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (!error && data) return data as HomepageSettings;
  }
  localStore.homepage = {
    ...localStore.homepage,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return localStore.homepage;
}

export async function getAboutContent(): Promise<AboutContent> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .single();
    if (!error && data) return data as AboutContent;
  }
  return localStore.about;
}

export async function updateAboutContent(
  content: Partial<AboutContent>
): Promise<AboutContent> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("about_content")
      .upsert({ ...content, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (!error && data) return data as AboutContent;
  }
  localStore.about = {
    ...localStore.about,
    ...content,
    updated_at: new Date().toISOString(),
  };
  return localStore.about;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) return data as SkillCategory[];
  }
  return localStore.skillCategories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getSkills(onlyActive = true): Promise<Skill[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("skills").select("*").order("sort_order", { ascending: true });
    if (onlyActive) {
      query = query.eq("is_active", true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Skill[];
  }
  const skills = onlyActive
    ? localStore.skills.filter((s) => s.is_active)
    : localStore.skills;
  return skills.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("skills")
      .upsert(skill)
      .select()
      .single();
    if (!error && data) return data as Skill;
  }
  const index = localStore.skills.findIndex((s) => s.id === skill.id);
  if (index >= 0) {
    localStore.skills[index] = skill;
  } else {
    localStore.skills.push(skill);
  }
  return skill;
}

export async function deleteSkill(skillId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("skills").delete().eq("id", skillId);
    if (!error) return true;
  }
  localStore.skills = localStore.skills.filter((s) => s.id !== skillId);
  return true;
}

export async function getProjects(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
}): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (options?.publishedOnly) {
      query = query.eq("is_published", true);
    }
    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }
    if (options?.category && options.category !== "All") {
      query = query.eq("category", options.category);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Project[];
  }

  let projects = [...localStore.projects];
  if (options?.publishedOnly) {
    projects = projects.filter((p) => p.is_published);
  }
  if (options?.featuredOnly) {
    projects = projects.filter((p) => p.is_featured);
  }
  if (options?.category && options.category !== "All") {
    projects = projects.filter((p) => p.category === options.category);
  }
  return projects.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data as Project;
  }
  const found = localStore.projects.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProject(project: Project): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .upsert({ ...project, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (!error && data) return data as Project;
  }
  const index = localStore.projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    localStore.projects[index] = { ...project, updated_at: new Date().toISOString() };
  } else {
    localStore.projects.push({ ...project, updated_at: new Date().toISOString() });
  }
  return project;
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (!error) return true;
  }
  localStore.projects = localStore.projects.filter((p) => p.id !== projectId);
  return true;
}

export async function getExperience(onlyPublished = true): Promise<ExperienceEntry[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) return data as ExperienceEntry[];
  }
  return localStore.experience.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveExperience(entry: ExperienceEntry): Promise<ExperienceEntry> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("experience")
      .upsert(entry)
      .select()
      .single();
    if (!error && data) return data as ExperienceEntry;
  }
  const index = localStore.experience.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    localStore.experience[index] = entry;
  } else {
    localStore.experience.push(entry);
  }
  return entry;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (!error) return true;
  }
  localStore.experience = localStore.experience.filter((e) => e.id !== id);
  return true;
}

export async function getCertifications(onlyPublished = true): Promise<Certification[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("certifications").select("*").order("sort_order", { ascending: true });
    if (onlyPublished) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Certification[];
  }
  const certs = onlyPublished
    ? localStore.certifications.filter((c) => c.is_published)
    : localStore.certifications;
  return certs.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveCertification(cert: Certification): Promise<Certification> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("certifications")
      .upsert(cert)
      .select()
      .single();
    if (!error && data) return data as Certification;
  }
  const index = localStore.certifications.findIndex((c) => c.id === cert.id);
  if (index >= 0) {
    localStore.certifications[index] = cert;
  } else {
    localStore.certifications.push(cert);
  }
  return cert;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (!error) return true;
  }
  localStore.certifications = localStore.certifications.filter((c) => c.id !== id);
  return true;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as ContactMessage[];
  }
  return [...localStore.messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function saveContactMessage(
  message: Omit<ContactMessage, "id" | "is_read" | "is_archived" | "created_at">
): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...message,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert(newMessage)
      .select()
      .single();
    if (!error && data) return data as ContactMessage;
  }

  localStore.messages.unshift(newMessage);
  return newMessage;
}

export async function updateContactMessage(
  id: string,
  updates: Partial<ContactMessage>
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("contact_messages")
      .update(updates)
      .eq("id", id);
    if (!error) return true;
  }
  const index = localStore.messages.findIndex((m) => m.id === id);
  if (index >= 0) {
    localStore.messages[index] = { ...localStore.messages[index], ...updates };
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) return true;
  }
  localStore.messages = localStore.messages.filter((m) => m.id !== id);
  return true;
}

export async function getMediaItems(): Promise<MediaItem[]> {
  return localStore.media;
}

export async function addMediaItem(item: MediaItem): Promise<MediaItem> {
  localStore.media.unshift(item);
  return item;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  localStore.media = localStore.media.filter((m) => m.id !== id);
  return true;
}

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  return localStore.appearance;
}

export async function updateAppearanceSettings(
  settings: Partial<AppearanceSettings>
): Promise<AppearanceSettings> {
  localStore.appearance = {
    ...localStore.appearance,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return localStore.appearance;
}

export async function getSeoSettings(): Promise<SeoSettings> {
  return localStore.seo;
}

export async function updateSeoSettings(
  settings: Partial<SeoSettings>
): Promise<SeoSettings> {
  localStore.seo = {
    ...localStore.seo,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return localStore.seo;
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  return localStore.settings;
}

export async function updateWebsiteSettings(
  settings: Partial<WebsiteSettings>
): Promise<WebsiteSettings> {
  localStore.settings = {
    ...localStore.settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return localStore.settings;
}
