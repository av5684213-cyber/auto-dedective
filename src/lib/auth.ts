// ─── NextAuth Yapılandırması ───

import type { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./db";

// Extend NextAuth types to include user.id, role, plan on session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    plan: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "E-posta",
      credentials: {
        email: { label: "E-posta", type: "email", placeholder: "eposta@ornek.com" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        if (!user.passwordHash) return null;

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role || "USER";
        token.plan = (user as any).plan || "FREE";
      }
      // Session güncellendiğinde (update çağrıldığında) plan'ı DB'den yeniden oku
      if (trigger === "update" && token.id) {
        const freshUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, role: true },
        });
        if (freshUser) {
          token.plan = freshUser.plan;
          token.role = freshUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string) || "USER";
        session.user.plan = (token.plan as string) || "FREE";
      }
      return session;
    },
  },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
