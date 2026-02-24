///home/merve/Next-Blog/app/api/posts/[slug]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }, // Promise olarak tanımla
) {
  try {
    const { slug } = await params; // await ederek çöz

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
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
