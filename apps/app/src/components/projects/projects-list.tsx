"use client";
import { Meta } from "../ui/meta";
import { BanknoteIcon, ClockIcon, PlusIcon } from "lucide-react";
import { type Address } from "viem";
import Link from "next/link";
import { useProjects } from "~/hooks/use-projects";
import { format } from "date-fns";
import { useProjectDetails } from "~/hooks/use-project-details";
import { useMetadata } from "~/hooks/use-metadata";
import { TokenAmount } from "../token/token-amount";
import { stripMarkdown, truncate } from "~/lib/utils";
import { ProjectBadge } from "./project-badge";
import { EmptyState } from "../empty-state";
import { Button } from "../ui/button";

export function ProjectsList() {
  const { data: projects, isPending, error } = useProjects();

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        {isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse bg-gray-100" />
          ))
        ) : projects?.length ? (
          projects?.map((project) => {
            return (
              <Link
                key={project}
                className="relative flex items-center rounded-md border-b p-2"
                href={`/projects/${project}`}
              >
                <Project address={project} />
              </Link>
            );
          })
        ) : (
          <EmptyState
            title="No projects found"
            description="It looks like there are no active projects. You can start by creating your own."
            action={
              <Link href={`/projects/create`}>
                <Button icon={PlusIcon} variant="secondary">
                  Create New Project
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}

function Project({ address }: { address: Address }) {
  const { data } = useProjectDetails(address);
  const { data: metadata } = useMetadata(data?.projectMetadata);
  if (!data) return <div>...</div>;
  return (
    <div className="mb-2 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="mb-1 text-base font-bold">{metadata?.title}</h2>
        <ProjectBadge projectAddress={address} />
      </div>
      <div className="mb-2 flex gap-4 text-xs">
        <Meta icon={BanknoteIcon}>
          <div>
            <TokenAmount amount={data.totalFundsRaised} hideSymbol /> /{" "}
            <TokenAmount amount={data.fundingTarget} />
          </div>
        </Meta>
        <Meta icon={ClockIcon}>
          <div>
            {data.fundingDeadline
              ? format(Number(data.fundingDeadline), "PP")
              : "N/A"}
          </div>
        </Meta>
      </div>
      <p className="text-sm">
        {truncate(stripMarkdown(metadata?.description), 120)}
      </p>
    </div>
  );
}
