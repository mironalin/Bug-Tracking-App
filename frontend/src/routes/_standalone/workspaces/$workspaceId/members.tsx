import { MembersList } from "@/features/workspaces/components/members-list";
import { createFileRoute } from "@tanstack/react-router";
import { getMembersQuery, useGetMembers } from "@/features/members/api/use-get-members";
import { LoaderComponent } from "@/components/loader-component";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/members")({
  loader: async ({ context, params }) => {
    const { workspaceId } = params;

    const queryClient = context.queryClient;

    await queryClient.prefetchQuery({
      queryKey: ["members", workspaceId],
      queryFn: () => getMembersQuery(workspaceId),
    });
  },
  component: RouteComponent,
  pendingComponent: () => <LoaderComponent />,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  const { data } = useGetMembers(workspaceId);

  return (
    <div className="w-full lg-max-w-xl">
      <MembersList data={data} />
    </div>
  );
}
