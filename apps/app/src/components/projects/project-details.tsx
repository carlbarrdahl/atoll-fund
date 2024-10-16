"use client";

import { QrCodeIcon } from "lucide-react";
import { Markdown } from "~/components/ui/markdown";
import { type ReactNode } from "react";
import { FundButton } from "./fund-button";
import { useProjectDetails } from "~/hooks/use-project-details";
import { useMetadata } from "~/hooks/use-metadata";
import { useParams } from "next/navigation";
import { type Address } from "viem";
import { ProjectBadge } from "./project-badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProjectMeta } from "./project-meta";
import { Badge } from "../ui/badge";
import { useProjectById } from "~/hooks/use-projects";

export function ProjectDetails({ action = null }: { action: ReactNode }) {
  const { projectAddress } = useParams();
  const { data: details, isPending } = useProjectById(projectAddress);
  const { data: metadata } = useMetadata(details?.metadata);

  if (isPending) return <div className="h-64 animate-pulse bg-gray-100"></div>;
  if (!details) return <div>Not found</div>;
  console.log(details);
  return (
    <>
      <div className="flex items-center gap-1 bg-white py-2">
        {action}
        <h1 className="flex-1 text-lg font-semibold sm:text-2xl md:text-3xl">
          {metadata?.title}
        </h1>
        <div className="flex items-center gap-2">
          <ProjectBadge id={projectAddress} />
          <Link href={`/projects/${projectAddress}/qr`}>
            <Button
              icon={QrCodeIcon}
              variant={"ghost"}
              size="icon"
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
      <ProjectMeta details={details} />

      <div className="flex h-full flex-1 flex-col">
        <Markdown>{metadata?.description}</Markdown>
      </div>

      <FundButton />
    </>
  );
}
