import axios from "axios";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import { type FacebookProfile } from "next-auth/providers/facebook";
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
    async signIn({ user }) {
      // if user image is set but it does not match 'utfs.io'
      // then we need to upload the image via uploadthing and update the url
      if (user.image && !/utfs.io/.test(user.image)) {
        try {
          // upload image to uploadthing
          const response = await fetch(user.image);
          const blob = await response.blob();
          const utRes = await ut.uploadFiles(blob);
          user.image = utRes.data?.url;
        } catch (error) {
          user.image = null;
        }
      }
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: "",
      from: "The Foodie Space <noreply@tomatovillage.com>",
      async sendVerificationRequest(params) {
        try {
          await resend.emails.send({
            from: "The Foodie Space <noreply@tomatovillage.com>",
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
      allowDangerousEmailAccountLinking: true,
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      // Make sure the profile is a high res picture
      async profile(profile: FacebookProfile, tokens) {
        // Profile id
        const { id } = profile;
        // Access token
        const { access_token } = tokens;
        // Graph API URL to return a large picture
        const url = `https://graph.facebook.com/v10.0/${id}/picture?type=large&access_token=${access_token}`;
        // GET req via axios
        const response = await axios.get(url);
        // Get the url for the large picture
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const { responseUrl } = response.request.res as { responseUrl: string };
        // Return customised next-auth user session
        return {
          id: profile.id,
          name: profile.name as string,
          email: profile.email as string,
          image: responseUrl,
        };
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
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
