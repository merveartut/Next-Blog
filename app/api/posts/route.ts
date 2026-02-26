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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, categories, content, author, imageUrl, slug } = body;

    // Next.js projesindeki slug üretim mantığının aynısı
    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const post = await prisma.post.upsert({
      where: { slug: generatedSlug },
      update: {
        title,
        categories,
        content,
        imageUrl,
      },
      create: {
        title,
        slug: generatedSlug,
        categories,
        content,
        imageUrl,
        author,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 },
    );
  }
}
