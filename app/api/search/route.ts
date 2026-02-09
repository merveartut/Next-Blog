import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json([]);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { categories: { hasSome: [q] } },
        { title: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 5, // Sadece en alakalı 5 sonucu getir
    select: {
      title: true,
      slug: true,
      categories: true,
      id: true,
      createdAt: true,
      author: true,
    },
  });

  return NextResponse.json(posts);
}
