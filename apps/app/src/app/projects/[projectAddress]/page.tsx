import { type Address } from "viem";
import { ProjectDetails } from "~/components/projects/project-details";
import { BackButton } from "~/components/ui/back-button";

export default function PoolPage({
  params: { poolAddress },
}: {
  params: { poolAddress: Address };
}) {
  return (
    <>
      <ProjectDetails action={<BackButton href={`/projects`} />} />
    </>
  );
}
