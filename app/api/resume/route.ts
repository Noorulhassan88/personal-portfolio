import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getHomepageSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";
    const disposition = isDownload ? "attachment" : "inline";

    const settings = await getHomepageSettings();
    const resumeUrl = settings.resume_url;

    // 1. If resumeUrl is a base64 data URL: data:application/pdf;base64,...
    if (resumeUrl && resumeUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = resumeUrl.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="Noorul_Hassan_Resume.pdf"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // 2. If it's a relative path in public/ (e.g. /uploads/resume_123.pdf or /resume.pdf)
    if (resumeUrl && resumeUrl.startsWith("/")) {
      const relativeClean = resumeUrl.replace(/^\//, "");
      const localFilePath = path.join(process.cwd(), "public", relativeClean);
      if (fs.existsSync(localFilePath)) {
        const buffer = fs.readFileSync(localFilePath);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `${disposition}; filename="Noorul_Hassan_Resume.pdf"`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Accept-Ranges": "bytes",
          },
        });
      }
    }

    // 3. Fallback to public/resume.pdf
    const defaultPdf = path.join(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(defaultPdf)) {
      const buffer = fs.readFileSync(defaultPdf);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="Noorul_Hassan_Resume.pdf"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // 4. Remote HTTP URL
    if (resumeUrl && (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://"))) {
      return NextResponse.redirect(resumeUrl);
    }

    return new NextResponse("Resume file not found.", { status: 404 });
  } catch (err) {
    console.error("Resume route error:", err);
    return new NextResponse("Failed to load resume.", { status: 500 });
  }
}
