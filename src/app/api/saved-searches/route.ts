// ─── Kaydedilmiş Arama CRUD API ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireOwnership } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authResult = await requireAuth(new Request(""));
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const searches = await db.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, searches });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const { name, queryJson, channel } = body;

    if (!name || !queryJson) {
      return NextResponse.json({ success: false, error: "İsim ve filtre gereklidir" }, { status: 400 });
    }

    const search = await db.savedSearch.create({
      data: {
        name,
        queryJson: typeof queryJson === "string" ? queryJson : JSON.stringify(queryJson),
        channel: channel || "PUSH",
        userId,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, search });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const { searchId, action } = body;

    if (action === "toggle" && searchId) {
      const search = await db.savedSearch.findUnique({ where: { id: searchId } });
      if (!search) return NextResponse.json({ success: false, error: "Arama bulunamadı" }, { status: 404 });

      if (search.userId) {
        const ownership = await requireOwnership(search.userId);
        if (ownership instanceof Response) return ownership;
      }

      const updated = await db.savedSearch.update({ where: { id: searchId }, data: { isActive: !search.isActive } });
      return NextResponse.json({ success: true, search: updated });
    }

    if (action === "update" && searchId) {
      const search = await db.savedSearch.findUnique({ where: { id: searchId } });
      if (!search) return NextResponse.json({ success: false, error: "Arama bulunamadı" }, { status: 404 });

      if (search.userId) {
        const ownership = await requireOwnership(search.userId);
        if (ownership instanceof Response) return ownership;
      }

      const { name, queryJson, channel } = body;
      const data: Record<string, unknown> = {};
      if (name) data.name = name;
      if (queryJson) data.queryJson = typeof queryJson === "string" ? queryJson : JSON.stringify(queryJson);
      if (channel) data.channel = channel;
      const updated = await db.savedSearch.update({ where: { id: searchId }, data });
      return NextResponse.json({ success: true, search: updated });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get("id");
    if (!searchId) return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });

    const search = await db.savedSearch.findUnique({ where: { id: searchId } });
    if (!search) return NextResponse.json({ success: false, error: "Arama bulunamadı" }, { status: 404 });

    if (search.userId) {
      const ownership = await requireOwnership(search.userId);
      if (ownership instanceof Response) return ownership;
    }

    await db.savedSearch.delete({ where: { id: searchId } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
