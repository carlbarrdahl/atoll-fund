"use client";

import { BanknoteIcon, ClockIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { Meta } from "~/components/ui/meta";
import { type ProjectDetails } from "~/hooks/use-project-details";
import { Progress } from "~/components/ui/progress";
import { TokenAmount } from "../token/token-amount";

export function ProjectMeta({ details }: { details: ProjectDetails }) {
  const progress = (details.totalFundsRaised / details.fundingTarget) * 100;

  return (
    <div className="mb-4 flex flex-col gap-2 text-sm">
      <Meta icon={ClockIcon}>
        <div>
          {/* {toNow(details.fundingDeadline, { addSuffix: false })} left to fund */}
          Funding until: {format(new Date(details.fundingDeadline), "PP HH:mm")}
        </div>
      </Meta>
      <Meta icon={BanknoteIcon}>
        <div className="flex gap-1">
          <span>Raised: </span>
          <TokenAmount amount={details.totalFundsRaised} hideSymbol />
          / <TokenAmount amount={details.fundingTarget} />
        </div>
      </Meta>
      <Progress variant="success" value={progress} />
    </div>
  );
}
