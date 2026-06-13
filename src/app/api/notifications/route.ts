import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/* ─── GET — fetch unread notifications for all alerts ─── */
export async function GET() {
  try {
    const notifications = await db.alertNotification.findMany({
      where: { isRead: false },
      orderBy: { foundAt: "desc" },
      take: 50,
      include: { alert: { select: { name: true, id: true } } },
    });

    const totalUnread = await db.alertNotification.count({
      where: { isRead: false },
    });

    return NextResponse.json({ success: true, notifications, totalUnread });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/* ─── PUT — mark notification(s) as read ─── */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead, alertId } = body;

    if (markAllRead) {
      const where = alertId ? { alertId, isRead: false } : { isRead: false };
      await db.alertNotification.updateMany({ where, data: { isRead: true } });
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      await db.alertNotification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
