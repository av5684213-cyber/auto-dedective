// ─── Abonelik Aktivasyon API ───
// NOT: Gerçek ödeme yapmaz. Manuel/aktivasyon noktasıdır.

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Zaten premium ise
    if (user.plan === "PREMIUM" && user.planRenewsAt && new Date(user.planRenewsAt) > new Date()) {
      return NextResponse.json({ success: false, error: "Zaten aktif Premium üyeliğiniz var" }, { status: 400 });
    }

    // 1 ay sonrasını hesapla
    const renewDate = new Date();
    renewDate.setMonth(renewDate.getMonth() + 1);

    // Kullanıcıyı PREMIUM yap
    await db.user.update({
      where: { id: userId },
      data: {
        plan: "PREMIUM",
        planRenewsAt: renewDate,
      },
    });

    // Subscription kaydı oluştur
    await db.subscription.create({
      data: {
        userId,
        status: "ACTIVE",
        startedAt: new Date(),
        currentPeriodEnd: renewDate,
        provider: "manual",
      },
    });

    return NextResponse.json({
      success: true,
      plan: "PREMIUM",
      planRenewsAt: renewDate.toISOString(),
      message: "Premium üyelik aktifleştirildi",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Aktivasyon hatası";
    console.error("Subscription activate error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET: Kullanıcının abonelik durumunu getir
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const subscriptions = await db.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const user = await db.user.findUnique({ where: { id: userId } });

    return NextResponse.json({
      success: true,
      plan: user?.plan || "FREE",
      planRenewsAt: user?.planRenewsAt?.toISOString() || null,
      subscriptions,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
