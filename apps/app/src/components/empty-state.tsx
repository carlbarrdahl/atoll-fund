import { FolderPlus } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-muted/40 flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
      <FolderPlus className="text-muted-foreground mb-4 h-8 w-8" />
      <h2 className="mb-2 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
