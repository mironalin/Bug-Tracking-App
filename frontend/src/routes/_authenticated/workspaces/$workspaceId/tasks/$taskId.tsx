import { ErrorPage } from "@/components/error-page";
import { PageLoader } from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { createFileRoute } from "@tanstack/react-router";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/tasks/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();

  const { data, isLoading } = useGetTask({ taskSlug: taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <ErrorPage message="Task not found!" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
}
