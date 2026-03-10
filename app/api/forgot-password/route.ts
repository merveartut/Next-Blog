///home/merve/Next-Blog/app/api/forgot-password/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const apiKey = process.env.MY_RESEND_KEY;
  if (!apiKey)
    return NextResponse.json({ error: "Config missing" }, { status: 500 });

  const resend = new Resend(apiKey);
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 saat

    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({ data: { email, token, expires } });

    const resetLink = `https://www.thebelog.com/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Be Log <onboarding@resend.dev>", // Domain onayı sonrası noreply@thebelog.com yaparsın
      to: email,
      subject: "Reset your password - Be Log.",
      html: `<p>BeLog şifreni unutmuşsun. Şifreni sıfırlamak için buraya tıkla: <a href="${resetLink}">Şifremi Sıfırla</a></p>`,
    });

    return NextResponse.json({ message: "Reset email sent" });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
