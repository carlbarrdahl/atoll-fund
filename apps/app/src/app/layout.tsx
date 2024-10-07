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
  description: "...",
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
              <main className="relative mx-auto flex h-full min-h-screen max-w-screen-md flex-col">
                <Header />
                <div className="flex-1 px-2">{children}</div>
              </main>
              <Toaster />
            </Web3Provider>
          </TRPCReactProvider>
        </MobileLayoutFix>
      </body>
    </html>
  );
}
