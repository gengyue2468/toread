import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow specific user to sign in
      const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];
      if (allowedUsers.length === 0) {
        // If no allowed users configured, allow everyone (for development)
        return true;
      }

      const githubUsername = (profile as any)?.login;
      const userEmail = user.email;

      if (
        allowedUsers.includes(githubUsername) ||
        (userEmail && allowedUsers.includes(userEmail))
      ) {
        return true;
      }

      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
