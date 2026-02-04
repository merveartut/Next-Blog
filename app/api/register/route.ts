import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Şifreleri güvenli saklamak için: npm i bcrypt

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Şifreyi şifrele (Güvenlik için şart!)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
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
  } catch (error) {
    return NextResponse.json(
      { error: "User already exists or database error" },
      { status: 400 },
    );
  }
}
