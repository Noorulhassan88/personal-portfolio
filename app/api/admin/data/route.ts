import { NextResponse } from "next/server";
import {
  getHomepageSettings,
  updateHomepageSettings,
  getAboutContent,
  updateAboutContent,
  getSkillCategories,
  getSkills,
  saveSkill,
  saveAllSkills,
  saveSkillCategories,
  deleteSkill,
  getProjects,
  saveProject,
  deleteProject,
  getExperience,
  saveExperience,
  saveAllExperience,
  deleteExperience,
  getCertifications,
  saveCertification,
  deleteCertification,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
  getAppearanceSettings,
  updateAppearanceSettings,
  getSeoSettings,
  updateSeoSettings,
  getWebsiteSettings,
  updateWebsiteSettings,
  getMediaItems,
  addMediaItem,
  deleteMediaItem,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section === "homepage") {
      const data = await getHomepageSettings();
      return NextResponse.json({ success: true, data });
    }
    if (section === "about") {
      const data = await getAboutContent();
      return NextResponse.json({ success: true, data });
    }
    if (section === "skills") {
      const [skills, categories] = await Promise.all([
        getSkills(false),
        getSkillCategories(),
      ]);
      return NextResponse.json({ success: true, data: { skills, categories } });
    }
    if (section === "projects") {
      const data = await getProjects();
      return NextResponse.json({ success: true, data });
    }
    if (section === "experience") {
      const data = await getExperience(false);
      return NextResponse.json({ success: true, data });
    }
    if (section === "certifications") {
      const data = await getCertifications(false);
      return NextResponse.json({ success: true, data });
    }
    if (section === "appearance") {
      const data = await getAppearanceSettings();
      return NextResponse.json({ success: true, data });
    }
    if (section === "seo") {
      const data = await getSeoSettings();
      return NextResponse.json({ success: true, data });
    }
    if (section === "settings") {
      const data = await getWebsiteSettings();
      return NextResponse.json({ success: true, data });
    }
    if (section === "media") {
      const data = await getMediaItems();
      return NextResponse.json({ success: true, data });
    }
    if (section === "messages") {
      const data = await getContactMessages();
      return NextResponse.json({ success: true, data });
    }

    const [
      homepage,
      about,
      categories,
      skills,
      projects,
      experience,
      certifications,
      appearance,
      seo,
      settings,
      media,
      messages,
    ] = await Promise.all([
      getHomepageSettings(),
      getAboutContent(),
      getSkillCategories(),
      getSkills(false),
      getProjects(),
      getExperience(false),
      getCertifications(false),
      getAppearanceSettings(),
      getSeoSettings(),
      getWebsiteSettings(),
      getMediaItems(),
      getContactMessages(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        homepage,
        about,
        skillCategories: categories,
        skills,
        projects,
        experience,
        certifications,
        appearance,
        seo,
        settings,
        media,
        messages,
      },
    });
  } catch (error) {
    console.error("Admin API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    switch (action) {
      case "updateHomepage": {
        const result = await updateHomepageSettings(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "updateAbout": {
        const result = await updateAboutContent(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "saveSkill": {
        const result = await saveSkill(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "saveAllSkills": {
        const { skills, categories } = payload;
        let savedSkills = null;
        let savedCategories = null;
        if (skills) savedSkills = await saveAllSkills(skills);
        if (categories) savedCategories = await saveSkillCategories(categories);
        return NextResponse.json({ success: true, data: { skills: savedSkills, categories: savedCategories } });
      }

      case "deleteSkill": {
        await deleteSkill(payload.id);
        return NextResponse.json({ success: true });
      }

      case "saveProject": {
        const result = await saveProject(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "deleteProject": {
        await deleteProject(payload.id);
        return NextResponse.json({ success: true });
      }

      case "saveExperience": {
        const result = await saveExperience(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "saveAllExperience": {
        const result = await saveAllExperience(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "deleteExperience": {
        await deleteExperience(payload.id);
        return NextResponse.json({ success: true });
      }

      case "saveCertification": {
        const result = await saveCertification(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "deleteCertification": {
        await deleteCertification(payload.id);
        return NextResponse.json({ success: true });
      }

      case "updateMessage": {
        await updateContactMessage(payload.id, payload.updates);
        return NextResponse.json({ success: true });
      }

      case "deleteMessage": {
        await deleteContactMessage(payload.id);
        return NextResponse.json({ success: true });
      }

      case "updateAppearance": {
        const result = await updateAppearanceSettings(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "updateSeo": {
        const result = await updateSeoSettings(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "updateSettings": {
        const result = await updateWebsiteSettings(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "addMedia": {
        const result = await addMediaItem(payload);
        return NextResponse.json({ success: true, data: result });
      }

      case "deleteMedia": {
        await deleteMediaItem(payload.id);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Server error occurred while executing admin action." },
      { status: 500 }
    );
  }
}
