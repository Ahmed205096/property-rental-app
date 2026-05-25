import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import User from "../../db/models/User";
import dbConnect from "@/app/db/mongo";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ account }) {
      const allowedProviders = ["google", "github", "facebook"];

      if (account && allowedProviders.includes(account.provider)) {
        return true;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (!account || !user) {
        return token;
      }

      try {
        await dbConnect();

        const userEmail =
          user.email || `${account.providerAccountId}@${account.provider}.auth`;

        const dbUser = await User.findOneAndUpdate(
          { email: userEmail },
          {
            $setOnInsert: {
              name: user.name,
              email: userEmail,
              image: user.image,
              role: "customer",
            },
          },
          { new: true, upsert: true },
        ).lean();

        if (dbUser && "_id" in dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.email = userEmail;
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.email = token.email || session.user.email;

      return session;
    },
  },
});
