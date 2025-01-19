import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { ProjectTypeInterface, TaskTypeInterface } from "@server/sharedTypes";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

interface TaskBreadcrumbsProps {
  project: ProjectTypeInterface;
  task: TaskTypeInterface;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.slug } },
      {
        onSuccess: () => {
          navigate({ to: `/workspaces/${workspaceId}/tasks` });
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />
      <Link to={`/workspaces/${workspaceId}/projects/${project.slug}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75">{project.name}</p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button onClick={handleDeleteTask} disabled={isPending} className="ml-auto" variant="destructive" size="sm">
        <TrashIcon className="size-4" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
