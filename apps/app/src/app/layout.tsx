import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { MobileLayoutFix } from "~/components/ui/layout-fix";
import { Web3Provider } from "./providers";
import { Header } from "./header";
export const metadata: Metadata = {
  title: "Atoll",
  description:
    "Atoll is a Kickstarter for pop-up cities and network states, enabling communities to collectively fund projects, events, and initiatives.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <MobileLayoutFix>
          <TRPCReactProvider>
            <Web3Provider>
              <main className="relative mx-auto flex h-full min-h-screen max-w-screen-md flex-col px-2">
                <Header />

                {children}
              </main>
              <Toaster />
            </Web3Provider>
          </TRPCReactProvider>
        </MobileLayoutFix>
      </body>
    </html>
  );
}
