import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
// npm install resend
import { Resend } from "resend";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY in environment variables");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  try {
    const { email } = await req.json();

    // 1. Kullanıcı var mı kontrol et
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. 1 saat geçerli bir token oluştur
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000);

    // Eski tokenları temizle ve yenisini kaydet
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    // 3. E-postayı gönder
    const resetLink = `https://www.thebelog.com/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Be Log <noreply@thebelog.com>",
      to: email,
      subject: "Reset your password - Be Log.",
      html: `<p>Daktilo anahtarını kaybetmişsin. Şifreni sıfırlamak için buraya tıkla: <a href="${resetLink}">Şifremi Sıfırla</a></p>`,
    });

    return NextResponse.json({ message: "Reset email sent" });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
