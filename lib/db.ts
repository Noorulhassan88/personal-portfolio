import fs from "fs";
import path from "path";
import os from "os";
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
  initialFooterSettings,
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
  FooterSettings,
} from "@/types/portfolio";
import { createServerSupabaseClient } from "./supabase/server";

function getStorageFilePath() {
  try {
    return path.join(process.cwd(), "data", "portfolio_store.json");
  } catch {
    return path.join(os.tmpdir(), "portfolio_store.json");
  }
}

function loadDiskStore(): any | null {
  try {
    const file = getStorageFilePath();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    try {
      const fallback = path.join(os.tmpdir(), "portfolio_store.json");
      if (fs.existsSync(fallback)) {
        return JSON.parse(fs.readFileSync(fallback, "utf-8"));
      }
    } catch {}
  }
  return null;
}

function saveDiskStore(store: LocalStore) {
  try {
    const file = getStorageFilePath();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    try {
      const fallback = path.join(os.tmpdir(), "portfolio_store.json");
      fs.writeFileSync(fallback, JSON.stringify(store, null, 2), "utf-8");
    } catch {}
  }
}

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
  footer: FooterSettings = { ...initialFooterSettings };
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

  constructor() {
    const saved = loadDiskStore();
    if (saved) {
      if (saved.homepage) this.homepage = saved.homepage;
      if (saved.about) this.about = saved.about;
      if (saved.skillCategories) this.skillCategories = saved.skillCategories;
      if (saved.skills) this.skills = saved.skills;
      if (saved.projects) this.projects = saved.projects;
      if (saved.experience) this.experience = saved.experience;
      if (saved.certifications) this.certifications = saved.certifications;
      if (saved.appearance) this.appearance = saved.appearance;
      if (saved.seo) this.seo = saved.seo;
      if (saved.settings) this.settings = saved.settings;
      if (saved.footer) this.footer = saved.footer;
      if (saved.messages) {
        this.messages = saved.messages.filter(
          (m: ContactMessage) =>
            m.id !== "msg-1" &&
            m.id !== "msg-2" &&
            !m.email?.includes("ai-institute.org") &&
            !m.email?.includes("techventures.io")
        );
      }
      if (saved.media) this.media = saved.media;
    }
  }
}

const globalForStore = globalThis as unknown as { localStore?: LocalStore };
export const localStore = globalForStore.localStore || new LocalStore();
if (process.env.NODE_ENV !== "production") globalForStore.localStore = localStore;

function persistChanges() {
  saveDiskStore(localStore);
}

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
  const merged: HomepageSettings = {
    ...localStore.homepage,
    ...settings,
    id: "default-homepage",
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("homepage_settings")
        .upsert(merged)
        .select()
        .single();
      if (!error && data) {
        localStore.homepage = data as HomepageSettings;
        persistChanges();
        return data as HomepageSettings;
      } else if (error) {
        console.error("Supabase homepage update error:", error);
      }
    }
  } catch (err) {
    console.warn("Supabase homepage update fallback:", err);
  }
  localStore.homepage = merged;
  persistChanges();
  return localStore.homepage;
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .single();
      if (!error && data) {
        const row = data as any;
        const result: AboutContent = {
          ...localStore.about,
          ...row,
          header_title:
            row.header_title ||
            row.development_philosophy ||
            localStore.about.header_title ||
            "Bridging Artificial Intelligence with Modern Web Architecture.",
          header_description:
            (row.header_description && !row.header_description.includes("development philosophy"))
              ? row.header_description
              : (row.career_objectives && !row.career_objectives.includes("development philosophy"))
              ? row.career_objectives
              : (localStore.about.header_description && !localStore.about.header_description.includes("development philosophy"))
              ? localStore.about.header_description
              : "Discover my background, education, and technical expertise in building scalable software systems and applied AI.",
          areas_of_specialization:
            row.areas_of_specialization && row.areas_of_specialization.length > 0
              ? row.areas_of_specialization
              : localStore.about.areas_of_specialization,
          technical_interests:
            row.technical_interests && row.technical_interests.length > 0
              ? row.technical_interests
              : localStore.about.technical_interests,
          bio_paragraphs:
            row.bio_paragraphs && row.bio_paragraphs.length > 0
              ? row.bio_paragraphs
              : localStore.about.bio_paragraphs,
          education:
            row.education && row.education.length > 0
              ? row.education
              : localStore.about.education,
        };
        localStore.about = result;
        return result;
      }
    }
  } catch (err) {
    console.warn("Supabase about query fallback:", err);
  }
  return localStore.about;
}

export async function updateAboutContent(
  content: Partial<AboutContent>
): Promise<AboutContent> {
  const merged: AboutContent = {
    ...localStore.about,
    ...content,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const supabasePayload: Record<string, any> = {
        id: merged.id || "default-about",
        full_name: merged.full_name || "Noorul Hassan",
        bio_paragraphs: merged.bio_paragraphs || [],
        education: merged.education || [],
        technical_interests: merged.technical_interests || [],
        areas_of_specialization: merged.areas_of_specialization || [],
        development_philosophy:
          merged.header_title || merged.development_philosophy || "",
        career_objectives:
          merged.header_description || merged.career_objectives || "",
        additional_photos: merged.additional_photos || [],
        updated_at: merged.updated_at,
      };

      const { data, error } = await supabase
        .from("about_content")
        .upsert(supabasePayload)
        .select()
        .single();

      if (!error && data) {
        const row = data as any;
        localStore.about = {
          ...row,
          header_title: merged.header_title || row.development_philosophy,
          header_description: merged.header_description || row.career_objectives,
        };
        persistChanges();
        return localStore.about;
      } else if (error) {
        console.error("Supabase about update error:", error);
      }
    }
  } catch (err) {
    console.warn("Supabase about update fallback:", err);
  }

  localStore.about = merged;
  persistChanges();
  return localStore.about;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) return data as SkillCategory[];
    }
  } catch (err) {
    console.warn("Supabase skill categories fallback:", err);
  }
  return localStore.skillCategories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getSkills(onlyActive = true): Promise<Skill[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from("skills").select("*").order("sort_order", { ascending: true });
      if (onlyActive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Skill[];
    }
  } catch (err) {
    console.warn("Supabase skills fallback:", err);
  }
  const skills = onlyActive
    ? localStore.skills.filter((s) => s.is_active)
    : localStore.skills;
  return skills.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("skills")
        .upsert(skill)
        .select()
        .single();
      if (!error && data) {
        const index = localStore.skills.findIndex((s) => s.id === skill.id);
        if (index >= 0) localStore.skills[index] = data as Skill;
        else localStore.skills.push(data as Skill);
        persistChanges();
        return data as Skill;
      }
    }
  } catch (err) {
    console.warn("Supabase save skill fallback:", err);
  }
  const index = localStore.skills.findIndex((s) => s.id === skill.id);
  if (index >= 0) {
    localStore.skills[index] = skill;
  } else {
    localStore.skills.push(skill);
  }
  persistChanges();
  return skill;
}

export async function deleteSkill(skillId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("skills").delete().eq("id", skillId);
    }
  } catch (err) {
    console.warn("Supabase delete skill fallback:", err);
  }
  localStore.skills = localStore.skills.filter((s) => s.id !== skillId);
  persistChanges();
  return true;
}

export async function saveAllSkills(skills: Skill[]): Promise<Skill[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("skills")
        .upsert(skills)
        .select();
      if (!error && data) {
        localStore.skills = data as Skill[];
        persistChanges();
        return data as Skill[];
      }
    }
  } catch (err) {
    console.warn("Supabase save all skills fallback:", err);
  }
  localStore.skills = [...skills];
  persistChanges();
  return skills;
}

export async function saveSkillCategories(categories: SkillCategory[]): Promise<SkillCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("skill_categories")
        .upsert(categories)
        .select();
      if (!error && data) {
        localStore.skillCategories = data as SkillCategory[];
        persistChanges();
        return data as SkillCategory[];
      }
    }
  } catch (err) {
    console.warn("Supabase save skill categories fallback:", err);
  }
  localStore.skillCategories = [...categories];
  persistChanges();
  return categories;
}

export async function getProjects(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
}): Promise<Project[]> {
  try {
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
      if (!error && data) {
        localStore.projects = data as Project[];
        return data as Project[];
      }
    }
  } catch (err) {
    console.warn("Supabase projects fallback:", err);
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
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error) return (data as Project) || null;
    }
  } catch (err) {
    console.warn("Supabase project slug fallback:", err);
  }
  const found = localStore.projects.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProject(project: Project): Promise<Project> {
  const updatedProject = { ...project, updated_at: new Date().toISOString() };
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .upsert(updatedProject)
        .select()
        .single();
      if (!error && data) {
        const index = localStore.projects.findIndex((p) => p.id === project.id);
        if (index >= 0) localStore.projects[index] = data as Project;
        else localStore.projects.push(data as Project);
        persistChanges();
        return data as Project;
      }
    }
  } catch (err) {
    console.warn("Supabase save project fallback:", err);
  }
  const index = localStore.projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    localStore.projects[index] = updatedProject;
  } else {
    localStore.projects.push(updatedProject);
  }
  persistChanges();
  return updatedProject;
}

export async function saveAllProjects(projects: Project[]): Promise<Project[]> {
  const updatedProjects = projects.map((p, idx) => ({
    ...p,
    sort_order: p.sort_order ?? idx + 1,
    updated_at: new Date().toISOString(),
  }));

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const currentIds = updatedProjects.map((p) => p.id);
      const { data: existing } = await supabase.from("projects").select("id");
      if (existing && existing.length > 0) {
        const toDelete = existing
          .filter((row) => !currentIds.includes(row.id))
          .map((row) => row.id);
        if (toDelete.length > 0) {
          await supabase.from("projects").delete().in("id", toDelete);
        }
      }

      if (updatedProjects.length > 0) {
        const { data, error } = await supabase
          .from("projects")
          .upsert(updatedProjects)
          .select();

        if (!error && data) {
          localStore.projects = data as Project[];
          persistChanges();
          return localStore.projects;
        } else if (error) {
          console.error("Supabase saveAllProjects error:", error);
        }
      } else {
        localStore.projects = [];
        persistChanges();
        return [];
      }
    }
  } catch (err) {
    console.warn("Supabase saveAllProjects fallback:", err);
  }

  localStore.projects = updatedProjects;
  persistChanges();
  return updatedProjects;
}

export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) {
        console.error("Supabase delete project error:", error);
      }
    }
  } catch (err) {
    console.warn("Supabase delete project fallback:", err);
  }
  localStore.projects = localStore.projects.filter((p) => p.id !== projectId);
  persistChanges();
  return true;
}

export async function getExperience(onlyPublished = true): Promise<ExperienceEntry[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) return data as ExperienceEntry[];
    }
  } catch (err) {
    console.warn("Supabase experience fallback:", err);
  }
  return localStore.experience.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveExperience(entry: ExperienceEntry): Promise<ExperienceEntry> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("experience")
        .upsert(entry)
        .select()
        .single();
      if (!error && data) {
        const index = localStore.experience.findIndex((e) => e.id === entry.id);
        if (index >= 0) localStore.experience[index] = data as ExperienceEntry;
        else localStore.experience.push(data as ExperienceEntry);
        persistChanges();
        return data as ExperienceEntry;
      }
    }
  } catch (err) {
    console.warn("Supabase save experience fallback:", err);
  }
  const index = localStore.experience.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    localStore.experience[index] = entry;
  } else {
    localStore.experience.push(entry);
  }
  persistChanges();
  return entry;
}

export async function deleteExperience(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("experience").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase delete experience fallback:", err);
  }
  localStore.experience = localStore.experience.filter((e) => e.id !== id);
  persistChanges();
  return true;
}

export async function saveAllExperience(entries: ExperienceEntry[]): Promise<ExperienceEntry[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("experience")
        .upsert(entries)
        .select();
      if (!error && data) {
        localStore.experience = data as ExperienceEntry[];
        persistChanges();
        return data as ExperienceEntry[];
      }
    }
  } catch (err) {
    console.warn("Supabase saveAllExperience fallback:", err);
  }
  localStore.experience = [...entries];
  persistChanges();
  return entries;
}

export async function getCertifications(onlyPublished = true): Promise<Certification[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from("certifications").select("*").order("sort_order", { ascending: true });
      if (onlyPublished) query = query.eq("is_published", true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Certification[];
    }
  } catch (err) {
    console.warn("Supabase certifications fallback:", err);
  }
  const certs = onlyPublished
    ? localStore.certifications.filter((c) => c.is_published)
    : localStore.certifications;
  return certs.sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveCertification(cert: Certification): Promise<Certification> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("certifications")
        .upsert(cert)
        .select()
        .single();
      if (!error && data) {
        const index = localStore.certifications.findIndex((c) => c.id === cert.id);
        if (index >= 0) localStore.certifications[index] = data as Certification;
        else localStore.certifications.push(data as Certification);
        persistChanges();
        return data as Certification;
      }
    }
  } catch (err) {
    console.warn("Supabase save certification fallback:", err);
  }
  const index = localStore.certifications.findIndex((c) => c.id === cert.id);
  if (index >= 0) {
    localStore.certifications[index] = cert;
  } else {
    localStore.certifications.push(cert);
  }
  persistChanges();
  return cert;
}

export async function deleteCertification(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("certifications").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase delete certification fallback:", err);
  }
  localStore.certifications = localStore.certifications.filter((c) => c.id !== id);
  persistChanges();
  return true;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        localStore.messages = data as ContactMessage[];
        return data as ContactMessage[];
      }
    }
  } catch (err) {
    console.warn("Supabase messages fallback:", err);
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

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert(newMessage)
        .select()
        .single();
      if (!error && data) {
        localStore.messages.unshift(data as ContactMessage);
        persistChanges();
        return data as ContactMessage;
      }
    }
  } catch (err) {
    console.warn("Supabase save message fallback:", err);
  }

  localStore.messages.unshift(newMessage);
  persistChanges();
  return newMessage;
}

export async function updateContactMessage(
  id: string,
  updates: Partial<ContactMessage>
): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from("contact_messages")
        .update(updates)
        .eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase update message fallback:", err);
  }
  const index = localStore.messages.findIndex((m) => m.id === id);
  if (index >= 0) {
    localStore.messages[index] = { ...localStore.messages[index], ...updates };
    persistChanges();
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("contact_messages").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase delete message fallback:", err);
  }
  localStore.messages = localStore.messages.filter((m) => m.id !== id);
  persistChanges();
  return true;
}

export async function getMediaItems(): Promise<MediaItem[]> {
  return localStore.media;
}

export async function addMediaItem(item: MediaItem): Promise<MediaItem> {
  localStore.media.unshift(item);
  persistChanges();
  return item;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  localStore.media = localStore.media.filter((m) => m.id !== id);
  persistChanges();
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
  persistChanges();
  return localStore.appearance;
}

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      // 1. Try dedicated seo_settings table if created
      const { data: seoTableData, error: seoTableError } = await supabase
        .from("seo_settings")
        .select("*")
        .single();
      if (!seoTableError && seoTableData) {
        localStore.seo = { ...localStore.seo, ...seoTableData };
        return localStore.seo;
      }

      // 2. Read from homepage_settings.sections_enabled.seo (native JSONB column)
      const { data: hpData, error: hpError } = await supabase
        .from("homepage_settings")
        .select("sections_enabled")
        .eq("id", "default-homepage")
        .single();
      if (!hpError && hpData?.sections_enabled?.seo) {
        localStore.seo = {
          ...localStore.seo,
          ...hpData.sections_enabled.seo,
        };
        return localStore.seo;
      }
    }
  } catch (err) {
    console.warn("Supabase getSeoSettings fallback:", err);
  }
  return localStore.seo;
}

export async function updateSeoSettings(
  settings: Partial<SeoSettings>
): Promise<SeoSettings> {
  const merged: SeoSettings = {
    ...localStore.seo,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      // 1. Try dedicated seo_settings table
      try {
        await supabase
          .from("seo_settings")
          .upsert({ ...merged, id: "default-seo" });
      } catch {}

      // 2. Persist to homepage_settings.sections_enabled.seo
      const { data: currHp } = await supabase
        .from("homepage_settings")
        .select("sections_enabled")
        .eq("id", "default-homepage")
        .single();

      const currSections = currHp?.sections_enabled || {
        hero: true,
        domains: true,
        featured_projects: true,
        quick_contact: true,
      };

      await supabase
        .from("homepage_settings")
        .update({
          sections_enabled: {
            ...currSections,
            seo: merged,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", "default-homepage");
    }
  } catch (err) {
    console.warn("Supabase updateSeoSettings fallback:", err);
  }

  localStore.seo = merged;
  persistChanges();
  return localStore.seo;
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .single();
      if (!error && data) {
        localStore.settings = { ...localStore.settings, ...data };
        return localStore.settings;
      }
    }
  } catch (err) {
    console.warn("Supabase getWebsiteSettings fallback:", err);
  }
  return localStore.settings;
}

export async function updateWebsiteSettings(
  settings: Partial<WebsiteSettings>
): Promise<WebsiteSettings> {
  const merged: WebsiteSettings = {
    ...localStore.settings,
    ...settings,
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("website_settings")
        .upsert({
          ...merged,
          id: (merged as any).id || "default-settings",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        localStore.settings = data as WebsiteSettings;
        persistChanges();

        // Also synchronize social fields into homepage_settings if provided
        try {
          const hpSync: Record<string, any> = {};
          if (settings.contact_email) hpSync.social_email = settings.contact_email;
          if (settings.github_url) hpSync.social_github = settings.github_url;
          if (settings.linkedin_url) hpSync.social_linkedin = settings.linkedin_url;

          if (Object.keys(hpSync).length > 0) {
            await supabase
              .from("homepage_settings")
              .update(hpSync)
              .eq("id", "default-homepage");
            
            localStore.homepage = { ...localStore.homepage, ...hpSync };
          }
        } catch {}

        return localStore.settings;
      } else if (error) {
        console.error("Supabase updateWebsiteSettings error:", error);
      }
    }
  } catch (err) {
    console.warn("Supabase updateWebsiteSettings fallback:", err);
  }

  localStore.settings = merged;
  persistChanges();
  return localStore.settings;
}

export async function getFooterSettings(): Promise<FooterSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: hp, error } = await supabase
        .from("homepage_settings")
        .select("sections_enabled, social_github, social_linkedin, social_email, name")
        .eq("id", "default-homepage")
        .single();

      if (!error && hp) {
        const sections = hp.sections_enabled as any;
        if (sections && sections.footer_data) {
          localStore.footer = {
            ...localStore.footer,
            ...sections.footer_data,
            github_url: sections.footer_data.github_url || hp.social_github || localStore.footer.github_url,
            linkedin_url: sections.footer_data.linkedin_url || hp.social_linkedin || localStore.footer.linkedin_url,
            email: sections.footer_data.email || hp.social_email || localStore.footer.email,
          };
          return localStore.footer;
        } else {
          localStore.footer = {
            ...localStore.footer,
            github_url: hp.social_github || localStore.footer.github_url,
            linkedin_url: hp.social_linkedin || localStore.footer.linkedin_url,
            email: hp.social_email || localStore.footer.email,
          };
          return localStore.footer;
        }
      }
    }
  } catch (err) {
    console.warn("Supabase getFooterSettings fallback:", err);
  }
  return localStore.footer;
}

export async function updateFooterSettings(
  settings: Partial<FooterSettings>
): Promise<FooterSettings> {
  const merged: FooterSettings = {
    ...localStore.footer,
    ...settings,
    id: "default-footer",
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      // 1. Fetch current sections_enabled to preserve other keys
      const { data: hp } = await supabase
        .from("homepage_settings")
        .select("sections_enabled")
        .eq("id", "default-homepage")
        .single();

      const existingSections = hp?.sections_enabled ? (hp.sections_enabled as any) : {};
      const updatedSections = {
        ...existingSections,
        footer_data: merged,
      };

      const hpUpdatePayload: Record<string, any> = {
        sections_enabled: updatedSections,
        updated_at: new Date().toISOString(),
      };
      if (merged.github_url) hpUpdatePayload.social_github = merged.github_url;
      if (merged.linkedin_url) hpUpdatePayload.social_linkedin = merged.linkedin_url;
      if (merged.email) hpUpdatePayload.social_email = merged.email;

      await supabase
        .from("homepage_settings")
        .update(hpUpdatePayload)
        .eq("id", "default-homepage");

      // 2. Also sync with website_settings
      try {
        const wsPayload: Record<string, any> = {};
        if (merged.github_url) wsPayload.github_url = merged.github_url;
        if (merged.linkedin_url) wsPayload.linkedin_url = merged.linkedin_url;
        if (merged.email) wsPayload.contact_email = merged.email;
        if (merged.bottom_left_text) wsPayload.copyright_text = merged.bottom_left_text;
        if (Object.keys(wsPayload).length > 0) {
          await supabase.from("website_settings").update(wsPayload).eq("id", "default-settings");
        }
      } catch {}

      localStore.footer = merged;
      persistChanges();
      return localStore.footer;
    }
  } catch (err) {
    console.warn("Supabase updateFooterSettings fallback:", err);
  }

  localStore.footer = merged;
  persistChanges();
  return localStore.footer;
}
