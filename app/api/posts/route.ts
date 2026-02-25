import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const author = searchParams.get("author"); // Yeni: Yazar filtresini yakalıyoruz

    const posts = await prisma.post.findMany({
      // Eğer author parametresi varsa filtrele, yoksa hepsini getir
      where: author
        ? {
            author: {
              equals: author,
              mode: "insensitive", // Büyük/küçük harf farkını ortadan kaldırır
            },
          }
        : {},
      orderBy: { createdAt: "desc" },
      include: {
        favoritedBy: email
          ? {
              where: { email: email },
              select: { email: true },
            }
          : false,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error (All Posts):", error);
    return NextResponse.json(
      { error: "Veriler daktilodan çekilemedi." },
      { status: 500 },
    );
  }
}
