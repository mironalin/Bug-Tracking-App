import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/projects/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>ProjectId: {Route.useParams().projectId}</div>;
}
