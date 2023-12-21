import "@/styles/globals.css";

import { Inter, Plus_Jakarta_Sans, Vollkorn } from "next/font/google";
import { headers } from "next/headers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { TRPCReactProvider } from "@/trpc/react";
import { Footer } from "./_components/footer";
import { getServerAuthSession } from "@/server/auth";
import { NavBar } from "./_components/nav-bar";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

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
  title: "tomatovillage",
  description: "food blogging community",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const grainyStyle = { backgroundImage: "url(/grainy.svg)" };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${jakarta.variable} ${vollkorn.variable} bg-gradient-to-br from-red-200 via-green-200 to-orange-200`}
      >
        <div className="h-screen overflow-y-scroll" style={grainyStyle}>
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
            <div className="flex min-h-screen flex-col items-center justify-between text-text">
              <div className="w-full max-w-3xl">
                <NavBar loggedIn={!!session} />
                {children}
              </div>
            </div>
            <div className="flex flex-col items-center bg-white/30">
              <div className="max-w-3xl">
                <Footer />
              </div>
            </div>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
