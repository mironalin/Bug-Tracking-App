import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { createFileRoute } from "@tanstack/react-router";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { LoadingSettingsForm } from "@/features/workspaces/components/loading-settings-form";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { isFetching, isError, data, error } = useGetWorkspaceById(workspaceId);

  if (isFetching) {
    return (
      <div className="w-full lg:max-w-xl">
        <LoadingSettingsForm />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data.workspace[0]) {
    navigate({ to: `/workspaces/${workspaceId}` });
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm key={data.workspace[0].updatedAt} initialValues={data.workspace[0]} />
    </div>
  );
}
