import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { type Address } from "viem";
import { EventsList } from "~/components/projects/projects-list";
import { PoolDetails } from "~/components/pools/pool-details";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function EventsListPage({
  params: { poolAddress },
}: {
  params: { poolAddress: Address };
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <PoolDetails poolAddress={poolAddress} />
        <Link href={`/pools/${poolAddress}/events/create`}>
          <Button icon={PlusIcon}>New event</Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <EventsList poolAddress={poolAddress} />
    </>
  );
}
