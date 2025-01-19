import { MembersList } from "@/features/workspaces/components/members-list";
import { createFileRoute } from "@tanstack/react-router";
import { getMembersQuery, useGetMembers } from "@/features/members/api/use-get-members";
import { PageLoader } from "@/components/page-loader";

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
  pendingMs: 300,
  pendingComponent: () => <PageLoader />,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  const { data } = useGetMembers(workspaceId);

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList data={data} />
    </div>
  );
}
