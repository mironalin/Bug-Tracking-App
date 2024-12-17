import { MembersList } from "@/features/workspaces/components/members-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_standalone/workspaces/$workspaceId/members")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full lg-max-w-xl">
      <MembersList />
    </div>
  );
}
