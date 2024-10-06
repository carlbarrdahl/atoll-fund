"use client";

import { BanknoteIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Markdown } from "~/components/ui/markdown";
import { Meta } from "~/components/ui/meta";
import { type ReactNode } from "react";
import { FundButton } from "./fund-button";
import { useProjectDetails } from "~/hooks/use-project-details";
import { useMetadata } from "~/hooks/use-metadata";
import { Progress } from "~/components/ui/progress";
import { TokenAmount } from "../token/token-amount";
import { useParams } from "next/navigation";
import { type Address } from "viem";

export function ProjectDetails({ action = null }: { action: ReactNode }) {
  const { projectAddress } = useParams();
  const { data: details, isPending } = useProjectDetails(
    projectAddress as Address,
  );
  const { data: metadata } = useMetadata(details?.projectMetadata);

  if (isPending) return <div className="h-64 animate-pulse bg-gray-100"></div>;
  if (!details) return <div>Not found</div>;

  const progress = (details.totalFundsRaised / details.fundingTarget) * 100;

  return (
    <>
      <div className="flex items-center gap-1 bg-white py-2">
        {action}
        <h1 className="text-lg font-semibold sm:text-2xl md:text-3xl">
          {metadata?.title}
        </h1>
      </div>
      <div className="mb-4 flex flex-col gap-2 text-sm">
        <Meta icon={ClockIcon}>
          <div>
            Funding until: {format(new Date(details.fundingDeadline), "PP")}
          </div>
        </Meta>
        <Meta icon={BanknoteIcon}>
          <div className="flex gap-1">
            <span>Raised: </span>
            <TokenAmount amount={details.totalFundsRaised} hideSymbol />
            / <TokenAmount amount={details.fundingTarget} />
          </div>
        </Meta>
        <Progress value={progress} />
      </div>

      <div className="flex h-full flex-1 flex-col">
        <Markdown>{metadata?.description}</Markdown>
      </div>

      <FundButton />
    </>
  );
}

function ActionButton() {
  return <Button>Refund</Button>;
}
