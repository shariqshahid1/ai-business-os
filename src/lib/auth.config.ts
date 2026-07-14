import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as Record<string, unknown>;
        token.id = u.id as string;
        token.role = u.role as string;
        token.businessId = u.businessId as string;
        token.emailVerified = u.emailVerified
          ? new Date(u.emailVerified as string).toISOString()
          : null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.businessId = token.businessId as string;
        session.user.emailVerified = token.emailVerified
          ? new Date(token.emailVerified as string)
          : null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
