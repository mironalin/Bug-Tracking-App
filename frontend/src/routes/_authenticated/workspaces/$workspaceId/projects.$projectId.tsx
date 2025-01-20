import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageLoader } from "@/components/page-loader";
import { getProjectByIdQuery, useGetProjectById } from "@/features/projects/api/use-get-project-by-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { getTasksQuery } from "@/features/tasks/api/use-get-tasks";
import { getProjectsQuery } from "@/features/projects/api/use-get-projects";
import { getMembersQuery } from "@/features/members/api/use-get-members";
import { getProjectAnalytics, useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";
import { useGetMe } from "@/features/members/api/use-get-me";
import { toast } from "sonner";
import { MemberRole } from "@server/sharedTypes";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/projects/$projectId")({
  loader: async ({ context, params }) => {
    const { projectId, workspaceId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["project", projectId],
      queryFn: () => getProjectByIdQuery(projectId),
    });

    await queryClient.prefetchQuery({
      queryKey: ["project-analytics", projectId],
      queryFn: () => getProjectAnalytics(projectId),
    });
  },
  component: RouteComponent,
  // pendingMs: 300,
  // pendingComponent: () => <PageLoader />,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { workspaceId, projectId } = Route.useParams();
  const { data: project } = useGetProjectById(projectId);
  const { data: analytics } = useGetProjectAnalytics(projectId);

  const { data: currentMember } = useGetMe({ workspaceId });

  if (!currentMember) {
    return null;
  }

  if (!project) {
    throw new Error("Project not found");
  }

  if (!analytics) {
    throw new Error("Project analytics not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} image={project.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              currentMember.role === MemberRole.ADMIN
                ? navigate({ to: `/workspaces/${project.workspaceId}/projects/${project.slug}/settings` })
                : toast.error("You do not have permission to edit this project")
            }
          >
            <PencilIcon className="size-4" />
            Edit Project
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter currentAssigneeId={currentMember.slug} showAllTasks />
    </div>
  );
}
