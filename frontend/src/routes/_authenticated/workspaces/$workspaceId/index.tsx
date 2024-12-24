import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  return <div>{`Workspace id: ${workspaceId}`}</div>;
}
