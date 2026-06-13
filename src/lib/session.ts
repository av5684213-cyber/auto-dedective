// ─── Oturum Yardımcıları ───

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Sunucu bileşenlerinde oturum bilgisini alır.
 * Oturum yoksa null döner.
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Sunucu route'larında kimlik doğrulama yapar.
 * Oturum yoksa 401 yanıtı döner.
 * Kullanıcı ID'sini döner.
 */
export async function requireAuth(request: Request): Promise<{ userId: string } | Response> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ success: false, error: "Oturum açmanız gerekiyor" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return { userId: session.user.id };
}

/**
 * Sahiplik kontrolü yapar. Kaynak sahibi ile oturum kullanıcısı eşleşmiyorsa 403 döner.
 */
export async function requireOwnership(
  resourceUserId: string
): Promise<{ userId: string } | Response> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ success: false, error: "Oturum açmanız gerekiyor" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (session.user.id !== resourceUserId) {
    return new Response(
      JSON.stringify({ success: false, error: "Bu kaynağa erişim izniniz yok" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return { userId: session.user.id };
}
