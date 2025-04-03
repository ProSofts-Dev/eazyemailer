import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { accounts, sessions, settings, users, verificationTokens } from "../db/schema";
import { db } from "../db";
import { InferInsertModel } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { generateApiToken } from "../utils/token";

type Settings = InferInsertModel<typeof settings>;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Generate API token on first sign in
      if (user?.id && !token.apiToken) {
        token.apiToken = generateApiToken(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      let newSession: any = session;
      if (newSession?.user) {
        newSession.user.id = token.sub;
      }
      return newSession;
    },
  },
  events: {
    async createUser({ user }) {
      try {
          let token = await generateApiToken(user?.id);
          await db.insert(settings).values({
            userId: user?.id,
            senderName: user.name,
            senderEmail: user.email,
            senderEmailVerified: false, // Default value
            dailyLimit: 50, // Replace with your default value
            monthlyLimit: 1500,
            dailyLimitUsed: 0,
            monthlyLimitUsed: 0,
            contactLimit: 3000,
            contactLimitUsed: 0,
            trackOpens: true, // Default value
            trackClicks: true, // Default value
            awsRegion: "us-east-1", // Replace with your default value
            sesFromDomain: "example.com", // Replace with your domain
            sesSendingQuota: 1000, // Replace with your default SES quota
            createdAt: new Date(),
            updatedAt: new Date(),
            apiToken: token,
          } as Settings).returning();
      } catch (e) {
        console.error("Error creating settings entry:", e);
      }
    },
  },
};