// ─── Favoriler CRUD API ───

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireOwnership } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authResult = await requireAuth(new Request(""));
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const favorites = await db.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { listing: true },
    });
    return NextResponse.json({ success: true, favorites });
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
    const { listingId, note, tags } = body;

    if (!listingId) {
      return NextResponse.json({ success: false, error: "İlan ID gereklidir" }, { status: 400 });
    }

    // Aynı ilanı tekrar eklemeyi önle
    const existing = await db.favorite.findFirst({
      where: { userId, listingId },
    });
    if (existing) {
      const updated = await db.favorite.update({
        where: { id: existing.id },
        data: {
          note: note || existing.note,
          tags: tags ? JSON.stringify(tags) : existing.tags,
        },
      });
      return NextResponse.json({ success: true, favorite: updated });
    }

    const favorite = await db.favorite.create({
      data: {
        userId,
        listingId,
        note: note || null,
        tags: tags ? JSON.stringify(tags) : "[]",
      },
    });

    return NextResponse.json({ success: true, favorite });
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
    const { favoriteId, note, tags } = body;

    if (!favoriteId) return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });

    // Sahiplik kontrolü
    const existing = await db.favorite.findUnique({ where: { id: favoriteId } });
    if (!existing) return NextResponse.json({ success: false, error: "Favori bulunamadı" }, { status: 404 });

    const ownership = await requireOwnership(existing.userId);
    if (ownership instanceof Response) return ownership;

    const data: Record<string, unknown> = {};
    if (note !== undefined) data.note = note;
    if (tags) data.tags = JSON.stringify(tags);

    const updated = await db.favorite.update({ where: { id: favoriteId }, data });
    return NextResponse.json({ success: true, favorite: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const { userId } = authResult;

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get("id");
    if (!favoriteId) return NextResponse.json({ success: false, error: "ID gereklidir" }, { status: 400 });

    // Sahiplik kontrolü
    const existing = await db.favorite.findUnique({ where: { id: favoriteId } });
    if (!existing) return NextResponse.json({ success: false, error: "Favori bulunamadı" }, { status: 404 });

    const ownership = await requireOwnership(existing.userId);
    if (ownership instanceof Response) return ownership;

    await db.favorite.delete({ where: { id: favoriteId } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
