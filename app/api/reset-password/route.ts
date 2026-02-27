// app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    // 1. Token geçerli mi ve süresi dolmuş mu?
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken || existingToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş bağlantı." },
        { status: 400 },
      );
    }

    // 2. Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcının şifresini güncelle ve token'ı sil
    // Bunu bir transaction ile yapmak en güvenlisidir
    await prisma.$transaction([
      prisma.user.update({
        where: { email: existingToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
      }),
    ]);

    return NextResponse.json({ message: "Şifre başarıyla güncellendi." });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { error: "Şifre güncellenirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
