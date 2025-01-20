import { Analytics } from "@/components/analytics";
import { ErrorPage } from "@/components/error-page";
import { PageLoader } from "@/components/page-loader";
import { getMembersQuery, useGetMembers } from "@/features/members/api/use-get-members";
import { MemberList } from "@/features/members/components/member-list";
import { getProjectsQuery, useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectList } from "@/features/projects/components/project-list";
import { getTasksQuery, useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { TaskList } from "@/features/tasks/components/task-list";
import { getWorkspaceAnalytics, useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { createFileRoute } from "@tanstack/react-router";
import { getMeQuery, useGetMe } from "@/features/members/api/use-get-me";
import { MemberRole } from "@server/sharedTypes";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/")({
  loader: async ({ context, params }) => {
    const { workspaceId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["workspaces-analytics", workspaceId],
      queryFn: () => getWorkspaceAnalytics(workspaceId),
    });

    await queryClient.prefetchQuery({
      queryKey: ["projects", workspaceId],
      queryFn: () => getProjectsQuery(workspaceId),
    });

    await queryClient.prefetchQuery({
      queryKey: ["members", workspaceId],
      queryFn: () => getMembersQuery(workspaceId),
    });

    await queryClient.prefetchQuery({
      queryKey: ["me", workspaceId],
      queryFn: () => getMeQuery({ workspaceId }),
    });
  },
  component: RouteComponent,
  pendingMs: 300,
  pendingComponent: () => <PageLoader />,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();

  const { data: analytics } = useGetWorkspaceAnalytics(workspaceId);
  const { data: projects } = useGetProjects(workspaceId);
  const { data: members } = useGetMembers(workspaceId);
  const { data: currentMember, isLoading: isLoadingMember } = useGetMe({ workspaceId });
  const {
    data: tasks,
    isLoading,
    refetch: refetchTasks,
  } = useGetTasks({ workspaceId, assigneeId: currentMember.slug });

  if (isLoading || isLoadingMember) {
    return <PageLoader />;
  }

  console.log("tasks", tasks);

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-rows-3 xl:grid-flow-col xl:gap-4">
        <TaskList data={tasks} total={tasks.length} currentMember={currentMember} handleRefetch={refetchTasks} />
        <ProjectList data={projects} total={projects.length} />
        <MemberList data={members} total={members.length} />
      </div>
    </div>
  );
}
