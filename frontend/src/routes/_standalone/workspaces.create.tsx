import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_standalone/workspaces/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
}
