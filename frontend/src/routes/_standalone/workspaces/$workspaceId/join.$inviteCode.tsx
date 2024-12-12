import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useGetWorkspaceInfoById,
  getWorkspaceInfoByIdQuery,
} from "@/features/workspaces/api/use-get-workspace-info-by-id";
import { JoinWorkspaceFrom } from "@/features/workspaces/components/join-workspace-form";
import { InviteCodeInvalidCard } from "@/features/workspaces/components/inviteCode-invalid-card";
import { getCheckCode, useGetCheckCode } from "@/features/workspaces/api/use-check-code";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/join/$inviteCode")({
  loader: async ({ context, params }) => {
    const { workspaceId, inviteCode } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["checkCode", workspaceId, inviteCode],
      queryFn: () => getCheckCode(workspaceId, inviteCode),
    });
    await queryClient.prefetchQuery({
      queryKey: ["workspace", workspaceId],
      queryFn: () => getWorkspaceInfoByIdQuery(workspaceId),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { workspaceId, inviteCode } = Route.useParams();
  const { data: workspace } = useGetWorkspaceInfoById(workspaceId);
  const { data: checkedCode } = useGetCheckCode(workspaceId, inviteCode);

  if (!checkedCode.success) {
    return (
      <div className="w-full lg:max-w-xl">
        <InviteCodeInvalidCard />
      </div>
    );
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
