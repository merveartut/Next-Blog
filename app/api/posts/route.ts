// app/api/posts/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Veritabanından tüm postları çekiyoruz
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // En yeni yazılar en üstte
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true, // İçerikten ilk resmi veya özeti ayıklamak için
        imageUrl: true,
        author: true,
        createdAt: true,
        categories: true,
        favoriteCount: true,
      },
    });

    // Başarılıysa postları döndür
    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error (All Posts):", error);
    return NextResponse.json(
      { error: "Veriler daktilodan çekilemedi." },
      { status: 500 },
    );
  }
}
