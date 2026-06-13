// ─── Kayıt API ───

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Doğrulama
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Tüm alanları doldurun" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const passwordHash = await hash(password, 12);

    // Kullanıcı oluştur
    const user = await db.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Kayıt hatası";
    console.error("Register error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
