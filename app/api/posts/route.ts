///home/merve/Next-Blog/app/api/posts/route.ts

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

    // 💡 KRİTİK NOKTA: İçeriği Web/Mobil uyumlu hale getir
    let finalizedContent = content;

    // Eğer içerik bir string ise (HTML gelmişse) ve JSON değilse
    // Web tarafındaki EditorJS'in hata vermemesi için onu JSON kılıfına sokuyoruz.
    const isJson = (str: string) => {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (typeof content === "string" && !isJson(content)) {
      // Saf HTML'i EditorJS'in anlayacağı bir 'paragraph' bloğuna çeviriyoruz
      finalizedContent = JSON.stringify({
        time: Date.now(),
        blocks: [
          {
            id: "mobile_entry_" + Date.now(),
            type: "paragraph",
            data: { text: content }, // Saf HTML EditorJS paragraflarında çalışır
          },
        ],
        version: "2.28.2",
      });
    }

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
        content: finalizedContent, // Dönüştürülmüş veya orijinal JSON içerik
        imageUrl,
      },
      create: {
        title,
        slug: generatedSlug,
        categories,
        content: finalizedContent,
        imageUrl,
        author,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("API Error (POST):", error);
    return NextResponse.json(
      { success: false, error: "Daktilo hatası" },
      { status: 500 },
    );
  }
}
