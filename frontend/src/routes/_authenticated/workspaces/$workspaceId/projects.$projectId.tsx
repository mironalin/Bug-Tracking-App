import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderComponent } from "@/components/loader-component";
import { getProjectByIdQuery, useGetProjectById } from "@/features/projects/api/use-get-project-by-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { getTasksQuery } from "@/features/tasks/api/use-get-tasks";
import { getProjectsQuery } from "@/features/projects/api/use-get-projects";
import { getMembersQuery } from "@/features/members/api/use-get-members";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/projects/$projectId")({
  loader: async ({ context, params }) => {
    const { projectId, workspaceId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["project", projectId],
      queryFn: () => getProjectByIdQuery(projectId),
    });

    // await queryClient.prefetchQuery({
    //   queryKey: ["tasks", workspaceId],
    //   queryFn: () => getTasksQuery(workspaceId),
    // });
  },
  component: RouteComponent,
  // pendingMs: 300,
  // pendingComponent: () => <LoaderComponent />,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const { data } = useGetProjectById(projectId);

  if (!data) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={data.project.name} image={data.project.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{data.project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/workspaces/${data.project.workspaceId}/projects/${data.project.slug}/settings`}>
              <PencilIcon className="size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
