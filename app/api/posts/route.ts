// app/api/posts/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Veritabanından tüm postları çekiyoruz
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        // Eğer email varsa, o kullanıcının favorileyip favorilemediğini kontrol et
        favoritedBy: email
          ? {
              where: { email: email },
              select: { email: true },
            }
          : false,
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
