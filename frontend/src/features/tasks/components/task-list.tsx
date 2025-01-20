import { Button } from "@/components/ui/button";
import { MemberRole, MemberTypeInterface, PopulatedTaskTypeInterface } from "@server/sharedTypes";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { CalendarIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { Link, useParams } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ExtendedMemberTypeInterface } from "@/features/workspaces/components/members-list";

interface TaskListProps {
  data: PopulatedTaskTypeInterface[];
  total: number;
  currentMember?: ExtendedMemberTypeInterface;
  handleRefetch: () => void;
}

export const TaskList = ({ data, total, currentMember, handleRefetch }: TaskListProps) => {
  const { workspaceId } = useParams({ strict: false });
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1 row-span-3 pb-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <div className="flex gap-2">
            <Button variant="muted" size="icon" onClick={handleRefetch}>
              <RefreshCwIcon className="size-4 text-neutral-400" />
            </Button>
            <Button
              variant="muted"
              size="icon"
              onClick={() => {
                currentMember?.role === MemberRole.ADMIN
                  ? createTask({ currentAssigneeId: currentMember?.slug as string })
                  : toast.error("You do not have permission to create a task");
              }}
            >
              <PlusIcon className="size-4 text-neutral-400" />
            </Button>
          </div>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.slug}>
              <Link to={`/workspaces/${workspaceId}/tasks/${task.slug}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No tasks found</li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link to={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};
