"use client";

import { useParams } from "next/navigation";
import { type Address } from "viem";
import { QRCodeSVG } from "qrcode.react";
import { Markdown } from "~/components/ui/markdown";
import { type ReactNode } from "react";
import { useProjectDetails } from "~/hooks/use-project-details";
import { useMetadata } from "~/hooks/use-metadata";
import { ProjectBadge } from "./project-badge";
import { getBaseUrl } from "~/trpc/react";
import { ProjectMeta } from "./project-meta";

export function ProjectQR({ action = null }: { action: ReactNode }) {
  const { projectAddress } = useParams();
  const { data: details, isPending } = useProjectDetails(
    projectAddress as Address,
  );
  const { data: metadata } = useMetadata(details?.projectMetadata);

  if (isPending) return <div className="h-64 animate-pulse bg-gray-100"></div>;
  if (!details) return <div>Not found</div>;

  const projectUrl = new URL(
    `/projects/${projectAddress}`,
    getBaseUrl(),
  ).toString();
  const progress = (details.totalFundsRaised / details.fundingTarget) * 100;
  return (
    <>
      <div className="flex items-center gap-1 bg-white py-2">
        {action}
        <h1 className="flex-1 text-lg font-semibold sm:text-2xl md:text-3xl">
          {metadata?.title}
        </h1>
        <div className="flex items-center gap-2">
          <ProjectBadge projectAddress={projectAddress} />
        </div>
      </div>
      <ProjectMeta details={details} />
      <div className="max-w-full">
        <QRCodeSVG className="w-full" size={300} value={projectUrl} />
      </div>

      <div className="flex h-full flex-1 flex-col">
        <Markdown>{metadata?.description}</Markdown>
      </div>
    </>
  );
}
