import { getWorkspacesQueryOptions } from "@/features/workspaces/api/use-get-workspaces";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const data = await queryClient.fetchQuery(getWorkspacesQueryOptions);
    if (data.length === 0) {
      throw redirect({ to: "/workspaces/create" });
    } else {
      throw redirect({ to: `/workspaces/${data[data.length - 1].slug}` });
    }
  },
  component: Index,
});

function Index() {
  return <div>Home page</div>;
}
