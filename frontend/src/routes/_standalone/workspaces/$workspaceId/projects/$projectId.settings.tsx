import { createFileRoute } from "@tanstack/react-router";
import { LoaderComponent } from "@/components/loader-component";
import { getProjectByIdQuery, useGetProjectById } from "@/features/projects/api/use-get-project-by-id";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/projects/$projectId/settings")({
  loader: async ({ context, params }) => {
    const { projectId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["project", projectId],
      queryFn: () => getProjectByIdQuery(projectId),
    });
  },
  component: RouteComponent,
  pendingMs: 300,
  pendingComponent: () => <LoaderComponent />,
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data } = useGetProjectById(projectId);

  if (!data) {
    throw new Error("Project not found");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm key={data.project.updatedAt} initialValues={data.project} />
    </div>
  );
}
