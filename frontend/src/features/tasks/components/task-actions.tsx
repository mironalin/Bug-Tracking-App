import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useGetMe } from "@/features/members/api/use-get-me";
import { MemberRole } from "@server/sharedTypes";

interface TaskActionProps {
  id: string;
  projectId: string;
  assigneeId: string;
  children?: React.ReactNode;
}

export const TaskActions = ({ id, projectId, assigneeId, children }: TaskActionProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const navigate = useNavigate();

  const { workspaceId } = useParams({ strict: false }) as { workspaceId: string };

  const { open } = useEditTaskModal();

  const { mutate, isPending } = useDeleteTask();

  const { data: currentMember } = useGetMe({ workspaceId });

  if (!currentMember) return null;

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenProject = () => {
    navigate({ to: `/workspaces/${workspaceId}/projects/${projectId}` });
  };

  const onOpenTask = () => {
    navigate({ to: `/workspaces/${workspaceId}/tasks/${id}` });
  };

  console.log("assigneeId", assigneeId);
  console.log("currentMemberSlug", currentMember.slug);

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTask} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenProject} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
            disabled={currentMember.slug !== assigneeId && currentMember.role === MemberRole.MEMBER}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending || (currentMember.slug !== assigneeId && currentMember.role === MemberRole.MEMBER)}
            className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
