"use client";

import { BanknoteIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { Meta } from "~/components/ui/meta";
import { Progress } from "~/components/ui/progress";
import { TokenAmount } from "../token/token-amount";
import { type Project } from "~/hooks/use-projects";

export function ProjectMeta({ details }: { details: Project }) {
  const progress = (details.totalRaised / details.target) * 100;

  console.log(details, progress);
  return (
    <div className="mb-4 flex flex-col gap-2 text-sm">
      <Meta icon={ClockIcon}>
        <div>
          {/* {toNow(details.fundingDeadline, { addSuffix: false })} left to fund */}
          Funding until: {format(new Date(details.deadline), "PP HH:mm")}
        </div>
      </Meta>
      <Meta icon={BanknoteIcon}>
        <div className="flex gap-1">
          <span>Raised: </span>
          <TokenAmount amount={details.totalRaised} hideSymbol />
          / <TokenAmount amount={details.target} />
        </div>
      </Meta>
      <Progress variant="success" value={progress} />
    </div>
  );
}
