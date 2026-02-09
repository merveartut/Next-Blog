import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ success: 0 }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kayıt dizinini ayarla (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Editor.js'in beklediği formatta cevap dön
    return NextResponse.json({
      success: 1,
      file: {
        url: `/uploads/${filename}`,
      },
    });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json({ success: 0 });
  }
}
