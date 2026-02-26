// /app/api/posts/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID bulunamadı" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Yazı imha edildi." });
  } catch (error) {
    console.error("Silme Hatası:", error);
    return NextResponse.json(
      { error: "Yazı silinirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
