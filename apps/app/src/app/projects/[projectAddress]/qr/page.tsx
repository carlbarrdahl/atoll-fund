import { ProjectQR } from "~/components/projects/project-qr";
import { BackButton } from "~/components/ui/back-button";

export default function ProjectQRPage({
  params: { projectAddress },
}: {
  params: { projectAddress: string };
}) {
  return (
    <>
      <ProjectQR action={<BackButton href={`/projects/${projectAddress}`} />} />
    </>
  );
}
