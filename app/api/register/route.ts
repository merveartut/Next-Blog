import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Şifreleri güvenli saklamak için: npm i bcrypt

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Şifre en az 8 karakter olmalı, büyük harf, küçük harf ve rakam içermelidir.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Kayıt Hatası Detayı:", error); // Terminalde hatayı görmek için şart!

    // Eğer Prisma email çakışması diyorsa (P2002 kodu)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanımda." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Kayıt sırasında teknik bir hata oluştu." },
      { status: 500 },
    );
  }
}
