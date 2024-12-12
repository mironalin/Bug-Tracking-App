import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";

interface JoinWorkspaceFromProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceFrom = ({ initialValues }: JoinWorkspaceFromProps) => {
  const { workspaceId, inviteCode } = useParams({ strict: false });
  const navigate = useNavigate();
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    joinWorkspace(
      { json: { code: inviteCode }, param: { workspaceId } },
      {
        onSuccess: ({ workspace }) => {
          navigate({ to: `/workspaces/${workspace.slug}` });
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You have been invited to join <strong>{initialValues.name}</strong> workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <Button variant="secondary" size="lg" type="button" className="w-full lg:w-fit" disabled={isPending} asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button type="button" size="lg" className="w-full lg:w-fit" onClick={onSubmit} disabled={isPending}>
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
