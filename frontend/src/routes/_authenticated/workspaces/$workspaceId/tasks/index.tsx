import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { getMeQuery, useGetMe } from "@/features/members/api/use-get-me";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/tasks/")({
  loader: async ({ context, params }) => {
    const { workspaceId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["me", workspaceId],
      queryFn: () => getMeQuery({ workspaceId }),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = useParams({ strict: false }) as { workspaceId: string };

  const { data: currentMember } = useGetMe({ workspaceId });

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher hideAssigneeFilter currentAssigneeId={currentMember.slug} />
    </div>
  );
}
