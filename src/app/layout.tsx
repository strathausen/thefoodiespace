import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { Footer } from "./_components/footer";
import { getServerAuthSession } from "@/server/auth";
import { NavBar } from "./_components/nav-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "tomatovillage",
  description: "food blogging community",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <div className="flex min-h-screen flex-col items-center justify-between bg-background text-text">
            <div className="w-full max-w-3xl">
              <NavBar loggedIn={!!session} />
              {children}
            </div>
          </div>
          <div className="flex flex-col items-center border-t border-accent-alt">
            <div className="w-full max-w-3xl">
              <Footer />
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
