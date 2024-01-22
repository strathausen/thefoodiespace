import "@/styles/globals.css";

import { Inter, Plus_Jakarta_Sans, Vollkorn } from "next/font/google";
import { headers } from "next/headers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";

import { TRPCReactProvider } from "@/trpc/react";
import { Footer } from "components/footer";
import { getServerAuthSession } from "@/server/auth";
import { NavBar } from "components/nav-bar";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "api/uploadthing/core";
import { Provider } from "./provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const vollkorn = Vollkorn({
  subsets: ["latin"],
  variable: "--font-vollkorn",
  display: "swap",
});

export const metadata = {
  title: "thefoodie.space",
  description: "food blogging community",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const grainyStyle = { backgroundImage: "url(/grainy.svg)" };

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <body
        className={`font-sans ${inter.variable} ${jakarta.variable} ${vollkorn.variable} bg-gradient-to-br from-red-200 via-green-200 to-orange-200`}
      >
        <div className="h-[calc(100dvh)] overflow-y-scroll" style={grainyStyle}>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <TRPCReactProvider headers={headers()}>
            <div className="flex min-h-[calc(100dvh)] text-text">
              <Provider locale={locale}>
                <NavBar session={session} />
              </Provider>
              <div className="flex w-full max-w-4xl flex-col md:ml-[12em]">
                {children}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center bg-white/30">
              <div className="max-w-3xl">
                <Footer />
              </div>
            </div>
          </TRPCReactProvider>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
