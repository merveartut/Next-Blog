import { supabase } from "@/lib/supabase"; // Az önce oluşturduğun dosya
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Dosya eksik" },
        { status: 400 },
      );
    }

    // Dosya adını benzersiz yapalım (Daktilo vuruşu gibi net)
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 1. Supabase Storage'a (blog-images bucket'ına) yüklüyoruz
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    // 2. Görselin Public URL'ini alıyoruz
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(filePath);

    // CKEditor'ün beklediği formatta dönüyoruz
    return NextResponse.json({
      success: true,
      file: { url: publicUrl },
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
