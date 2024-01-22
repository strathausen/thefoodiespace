import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook";
import { Resend } from "resend";
import { UTApi } from "uploadthing/server";

import { env } from "@/env.mjs";
import { db } from "@/server/db";

const resend = new Resend(env.RESEND_KEY);
const ut = new UTApi();

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      // if user image is set but it does not match 'utfs.io'
      // then we need to upload the image via uploadthing and update the url
      if (user.image && !/utfs.io/.test(user.image)) {
        try {
          // upload image to uploadthing
          const response = await fetch(user.image);
          const blob = await response.blob();
          const utRes = await ut.uploadFiles(blob);
          await db.user.update({
            where: { id: user.id },
            data: { image: utRes.data?.url },
          });
        } catch (error) {
          await db.user.update({
            where: { id: user.id },
            data: { image: null },
          });
        }
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    //DiscordProvider({
    //clientId: env.DISCORD_CLIENT_ID,
    //clientSecret: env.DISCORD_CLIENT_SECRET,
    //}),
    EmailProvider({
      server: "",
      from: "Tomato Village <noreply@tomatovillage.com>",
      async sendVerificationRequest(params) {
        try {
          await resend.emails.send({
            from: "Tomato Village <noreply@tomatovillage.com>",
            to: params.identifier,
            subject: "login to the foodie space",
            text: `login the foodie space: ${params.url}`,
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
