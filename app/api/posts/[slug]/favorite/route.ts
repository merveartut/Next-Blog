import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Kullanıcı bu postu zaten favorilemiş mi?
    const existingPost = await prisma.post.findFirst({
      where: {
        slug: slug,
        favoritedBy: {
          some: { email: session.user.email },
        },
      },
    });

    const isFavorited = !!existingPost;

    // 2. Eğer zaten favoriliyse ÇIKAR, değilse EKLE
    const updatedPost = await prisma.post.update({
      where: { slug: slug },
      data: {
        favoriteCount: isFavorited ? { decrement: 1 } : { increment: 1 },
        favoritedBy: isFavorited
          ? { disconnect: { email: session.user.email } } // Bağlantıyı kopar
          : { connect: { email: session.user.email } }, // Bağlantıyı kur
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Favori işlemi hatası:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}
