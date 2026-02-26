import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }, // Promise olarak kalsın
) {
  try {
    const { slug } = await params; // 💡 Await ederek çözüyoruz

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const post = await prisma.post.findUnique({
      where: { slug: slug },
      include: {
        favoritedBy: email
          ? {
              where: { email: email },
              select: { email: true },
            }
          : false,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("API Error (GET):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }, // 💡 Burayı da Promise yaptık
) {
  try {
    const { slug: identifier } = await params; // 💡 Await ederek identifier'ı aldık

    // Prisma'da ID veya Slug'a göre silme işlemi
    // Not: ID genellikle UUID/CUID olduğu için 20 karakterden uzun olur.
    await prisma.post.delete({
      where: identifier.length > 20 ? { id: identifier } : { slug: identifier },
    });

    return NextResponse.json({ success: true, message: "Yazı imha edildi." });
  } catch (error) {
    console.error("Silme Hatası (DELETE):", error);
    return NextResponse.json(
      { error: "Silme başarısız veya yazı zaten yok." },
      { status: 500 },
    );
  }
}
