// ─── Abonelik İptal API ───

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

    if (user.plan !== "PREMIUM") {
      return NextResponse.json({ success: false, error: "Aktif Premium üyeliğiniz yok" }, { status: 400 });
    }

    // Aktif aboneliği CANCELED olarak işaretle
    const activeSub = await db.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    if (activeSub) {
      await db.subscription.update({
        where: { id: activeSub.id },
        data: { status: "CANCELED" },
      });
    }

    // Kullanıcıyı FREE yap
    await db.user.update({
      where: { id: userId },
      data: {
        plan: "FREE",
        planRenewsAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      plan: "FREE",
      message: "Premium üyelik iptal edildi",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "İptal hatası";
    console.error("Subscription cancel error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
