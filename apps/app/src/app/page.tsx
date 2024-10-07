import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
import { MintTokens } from "~/components/token/mint";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="pt-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Mint test tokens</AlertTitle>
          <AlertDescription>
            You can mint test tokens to create and fund events
            <MintTokens />
          </AlertDescription>
        </Alert>
      </div>
    </HydrateClient>
  );
}
