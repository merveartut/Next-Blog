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

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken || existingToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş bağlantı." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
