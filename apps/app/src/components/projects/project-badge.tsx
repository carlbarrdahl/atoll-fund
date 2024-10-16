"use client";
import { type Address } from "viem";
import { useProjectDetails } from "~/hooks/use-project-details";
import { Badge } from "../ui/badge";

export function ProjectBadge({ id }: { id: Address }) {
  const { data, isPending } = useProjectDetails(id);

  if (!data) return null;
  if (isPending)
    return (
      <Badge variant="outline" className="animate-pulse">
        <span className="opacity-0">loading</span>
      </Badge>
    );
  if (data.fundingDeadline < Date.now())
    return data.totalFundsRaised >= data.fundingTarget ? (
      <Badge variant="success">Succeeded</Badge>
    ) : (
      <Badge variant="secondary">Finished</Badge>
    );
  if (data.isWithdrawn) return <Badge variant="success">Withdrawn</Badge>;
  if (data.canRefund) return <Badge variant="destructive">Not funded</Badge>;
  if (data.canWithdraw) return <Badge variant="success">Funded</Badge>;
  return <Badge variant="outline">Funding</Badge>;
}
