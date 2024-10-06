import { type Address } from "viem";
import { EventDetails } from "~/components/projects/event-details";
import { BackButton } from "~/components/ui/back-button";

export default function EventPage({
  params: { poolAddress, eventId },
}: {
  params: { poolAddress: Address; eventId: string };
}) {
  return (
    <EventDetails
      eventId={Number(eventId)}
      action={<BackButton href={`/pools/${poolAddress}/events`} />}
    />
  );
}
