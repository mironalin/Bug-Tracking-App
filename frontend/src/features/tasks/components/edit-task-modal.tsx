import { ResponsiveModal } from "@/components/responsive-modal";
import { EditTaskFormWrapper } from "./edit-task-form-wrapper";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

export const EditTaskModal = () => {
  const { taskSlug, setTaskSlug, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskSlug} onOpenChange={close}>
      {taskSlug && <EditTaskFormWrapper slug={taskSlug} onCancel={close} />}
    </ResponsiveModal>
  );
};
