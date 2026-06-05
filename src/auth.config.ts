import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // real providers added in auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // Strip a leading /en or /ar so checks work under locale prefixes.
      const path = nextUrl.pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
      const isOnAdmin = path.startsWith("/admin");
      const isOnLogin = path === "/admin/login";

      if (isOnLogin) return true; // login page always reachable
      if (isOnAdmin) return isLoggedIn; // gate the rest of /admin
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
