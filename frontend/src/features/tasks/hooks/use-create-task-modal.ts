import { TaskStatus } from "@server/sharedTypes";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [status, setStatus] = useQueryState("task-status", parseAsString);
  const [projectId, setProjectId] = useQueryState("project-id", parseAsString);

  const open = (status?: TaskStatus, projectId?: string) => {
    setStatus(status ?? null);
    setProjectId(projectId ?? null);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setProjectId(null);
    setStatus(null);
  };

  return {
    isOpen,
    open,
    close,
    status,
    projectId,
    setIsOpen,
  };
};
