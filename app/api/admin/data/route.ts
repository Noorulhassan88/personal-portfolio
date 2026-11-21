import { NextResponse } from "next/server";
import {
  updateHomepageSettings,
  updateAboutContent,
  saveSkill,
  deleteSkill,
  saveProject,
  deleteProject,
  saveExperience,
  deleteExperience,
  saveCertification,
  deleteCertification,
  updateContactMessage,
  deleteContactMessage,
  updateAppearanceSettings,
  updateSeoSettings,
  updateWebsiteSettings,
  addMediaItem,
  deleteMediaItem,
} from "@/lib/db";

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
