"use client";

import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import { Compass, UserIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

export function Header() {
  return (
    <header className="mb-2 flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Link href={`/`} className="mr-8">
          <Compass className="size-4" />
          {/* <Button icon={AudioLinesIcon} size="icon" variant="ghost" /> */}
          {/* <div className="size-8 rounded-full border-4 border-gray-950"></div> */}
        </Link>
        <Link href={`/projects`}>
          <Button variant="ghost">View Projects</Button>
        </Link>
      </div>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show }) => {
          if (isConnected) {
            return (
              <Button
                variant="outline"
                size="icon"
                icon={UserIcon}
                onClick={show}
                className="overflow-hidden rounded-full"
              />
            );
          }
          return (
            <Button disabled={isConnecting} onClick={show} variant="secondary">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
    </header>
  );
}
