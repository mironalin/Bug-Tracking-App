import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGetWorkspaceInfoById } from "@/features/workspaces/api/use-get-workspace-info-by-id";
import { JoinWorkspaceFrom } from "@/features/workspaces/components/join-workspace-form";
import { LoadingJoinWorkspaceForm } from "@/features/workspaces/components/loading-join-form";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/join/$inviteCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { workspaceId } = Route.useParams();
  const { isFetching, isError, data: workspace, error } = useGetWorkspaceInfoById(workspaceId);

  if (isFetching) {
    return (
      <div className="w-full lg:max-w-xl">
        <LoadingJoinWorkspaceForm />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!workspace) {
    navigate({ to: "/" });
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceFrom initialValues={workspace} />
    </div>
  );
}
