"use client";
import { type Address } from "viem";
import { useProjectDetails } from "~/hooks/use-project-details";
import { Badge } from "../ui/badge";

export function ProjectBadge({ projectAddress }: { projectAddress: Address }) {
  const { data, isPending } = useProjectDetails(projectAddress as Address);

  if (!data) return null;
  if (isPending)
    return (
      <Badge variant="outline" className="animate-pulse">
        <span className="opacity-0">loading</span>
      </Badge>
    );
  console.log(
    data.fundingDeadline,
    Date.now(),
    "funding done:",
    data.fundingDeadline < Date.now(),
  );
  if (data.fundingDeadline < Date.now())
    return <Badge variant="secondary">Finished</Badge>;
  if (data.isWithdrawn) return <Badge variant="success">Withdrawn</Badge>;
  if (data.canRefund) return <Badge variant="destructive">Not funded</Badge>;
  if (data.canWithdraw) return <Badge variant="success">Funded</Badge>;
  return <Badge variant="outline">Funding</Badge>;
}
