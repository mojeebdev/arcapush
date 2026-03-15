import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin",
    error:  "/auth/error",
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        
        session.user.id = (token.dbId as string) ?? token.sub;

        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { onboardingComplete: true, role: true },
        });

        (session.user as any).onboardingComplete = dbUser?.onboardingComplete ?? false;
        (session.user as any).role               = dbUser?.role ?? "viewer";
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        
        token.dbId = user.id;
        token.sub  = user.id;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/onboarding`;
    },
  },
});