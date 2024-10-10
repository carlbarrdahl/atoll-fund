import { ProjectDetails } from "~/components/projects/project-details";
import { BackButton } from "~/components/ui/back-button";

export default function ProjectPage() {
  return (
    <>
      <ProjectDetails action={<BackButton href={`/projects`} />} />
    </>
  );
}
