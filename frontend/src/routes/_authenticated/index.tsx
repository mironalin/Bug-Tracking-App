import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

function Index() {
  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm onCancel={() => {}} />
    </div>
  );
}
