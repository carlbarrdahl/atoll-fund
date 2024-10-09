import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
import { MintTokens } from "~/components/token/mint";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Terminal } from "lucide-react";
import { Markdown } from "~/components/ui/markdown";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="space-y-4 pt-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Mint test tokens</AlertTitle>
          <AlertDescription>
            You can mint test tokens to create and fund projects
            <MintTokens />
          </AlertDescription>
        </Alert>
        <h3 className="text-xl leading-normal tracking-wide">
          Atoll is a Kickstarter for pop-up cities and network states, enabling
          communities to collectively fund projects, events, and initiatives.
        </h3>
        <Markdown className={""}>
          {`
### How it works
- **Project Creation** - individuals or groups can propose projects by including details such as title, description, funding target and deadline, and an optional minimum contribution amount.
- **Community Funding** - community members contribute funding to the projects they support by transferring the funds to a smart contract that enforce the agreed-upon terms.
- **Outcome determination**
  - Funding goals met - funds are released to the project initiator.
  - Funding goals not met - contributors can retrieve their funds and a percentage of the project owners funding as a bonus.

This mechanic is called a dominant assurance contract and designed to create a win-win situation. Either the projects get funded or the contributors receive a bonus for their participation. It also encourages the owners to market the project and find contributors.`}
        </Markdown>
      </div>
    </HydrateClient>
  );
}
