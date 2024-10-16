"use client";
import { Meta } from "../ui/meta";
import { BanknoteIcon, ClockIcon, PlusIcon } from "lucide-react";
import { type Address } from "viem";
import Link from "next/link";
import { Project, useProjects } from "~/hooks/use-projects";
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

  console.log(projects);
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
                key={project.id}
                className="relative flex items-center rounded-md border-b p-2"
                href={`/projects/${project.id}`}
              >
                <Project {...project} />
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

function Project({ id, target, deadline, metadata, totalRaised }: Project) {
  const { data: _metadata } = useMetadata(metadata);
  if (!id) return <div>...</div>;
  return (
    <div className="mb-2 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="mb-1 text-base font-bold">{_metadata?.title}</h2>
        <ProjectBadge id={id} />
      </div>
      <div className="mb-2 flex gap-4 text-xs">
        <Meta icon={BanknoteIcon}>
          <div>
            <TokenAmount amount={totalRaised} hideSymbol /> /{" "}
            <TokenAmount amount={target} />
          </div>
        </Meta>
        <Meta icon={ClockIcon}>
          <div>{deadline ? format(Number(deadline), "PP") : "N/A"}</div>
        </Meta>
      </div>
      <p className="text-sm">
        {truncate(stripMarkdown(_metadata?.description), 120)}
      </p>
    </div>
  );
}
