import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkspaceTypeInterface } from "@server/sharedTypes";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useNavigate } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";

export const WorkspaceSwitcher = () => {
  const { workspaceId } = useParams({ strict: false });

  const { data } = useGetWorkspaces();
  const navigate = useNavigate();

  const onSelect = (id: string) => {
    navigate({ to: `/workspaces/${id}` });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {data?.workspaces.map((workspace: WorkspaceTypeInterface) => (
            <SelectItem key={workspace.id} value={String(workspace.slug)}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
