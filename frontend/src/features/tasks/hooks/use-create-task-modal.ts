import { TaskStatus } from "@server/sharedTypes";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [status, setStatus] = useQueryState("task-status", parseAsString);

  const open = (status?: TaskStatus) => {
    setStatus(status ?? null);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setStatus(null);
  };

  return {
    isOpen,
    open,
    close,
    status,
    setIsOpen,
  };
};
