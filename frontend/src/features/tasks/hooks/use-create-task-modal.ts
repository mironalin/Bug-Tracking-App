import { TaskStatus } from "@server/sharedTypes";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

interface openProps {
  status?: TaskStatus;
  currentAssigneeId?: string;
  projectId?: string;
}

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [status, setStatus] = useQueryState("task-status", parseAsString);
  const [projectId, setProjectId] = useQueryState("project-id", parseAsString);
  const [assigneeId, setAssigneeId] = useQueryState("assignee-id", parseAsString);

  const open = ({ status, currentAssigneeId, projectId }: openProps) => {
    setStatus(status ?? null);
    setProjectId(projectId ?? null);
    setAssigneeId(currentAssigneeId ?? null);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setProjectId(null);
    setAssigneeId(null);
    setStatus(null);
  };

  return {
    isOpen,
    open,
    close,
    status,
    assigneeId,
    projectId,
    setIsOpen,
  };
};
