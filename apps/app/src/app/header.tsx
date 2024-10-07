"use client";

import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import { Compass, UserIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useIsFetching } from "@tanstack/react-query";

export function Header() {
  const isFetching = useIsFetching();
  return (
    <header>
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <Link href={`/`} className="mr-8">
            <div className="relative -top-0.5 mr-1">
              <Compass
                className={cn("text-primary-900 absolute left-0 top-0 h-4 w-4")}
              />
              <Compass
                className={cn("h-4 w-4 transition-colors", {
                  ["text-primary-400 animate-ping"]: isFetching,
                })}
              />
            </div>

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
              <Button
                disabled={isConnecting}
                onClick={show}
                variant="secondary"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500" />
    </header>
  );
}
