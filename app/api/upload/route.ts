import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isPdf =
      file.name.toLowerCase().endsWith(".pdf") ||
      file.type === "application/pdf";

    // Try saving to public/uploads directory (works locally / Node server)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(file.name) || (isPdf ? ".pdf" : ".jpg");
      const filename = isPdf ? `resume_${Date.now()}.pdf` : `photo_${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      if (isPdf) {
        try {
          fs.writeFileSync(path.join(process.cwd(), "public", "resume.pdf"), buffer);
        } catch (e) {
          console.warn("Could not overwrite public/resume.pdf:", e);
        }
      }

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch {
      // Fallback for Vercel Serverless (read-only filesystem): use Base64 Data URL
      const base64 = buffer.toString("base64");
      const mime = file.type || (isPdf ? "application/pdf" : "image/jpeg");
      const dataUrl = `data:${mime};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
