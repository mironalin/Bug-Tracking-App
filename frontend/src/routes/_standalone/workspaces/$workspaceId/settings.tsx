import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { LoadingSettingsForm } from "@/features/workspaces/components/loading-settings-form";
import { useGetMe, getMeQuery } from "@/features/members/api/use-get-me";
import { MemberRole, MemberTypeInterface } from "@server/sharedTypes";
import { toast } from "sonner";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/settings")({
  beforeLoad: async ({ context, params }) => {
    const { workspaceId } = params;
    const queryClient = context.queryClient;

    const data = await queryClient.ensureQueryData({
      queryKey: ["me", workspaceId],
      queryFn: () => getMeQuery({ workspaceId }),
    });

    if (data.role !== MemberRole.ADMIN) {
      toast.error("You don't have permission to edit this workspace");
      throw redirect({ to: `/workspaces/${workspaceId}` });
    }
  },
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
