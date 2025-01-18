import { useQueryState, parseAsString } from "nuqs";

export const useEditTaskModal = () => {
  const [taskSlug, setTaskSlug] = useQueryState("edit-task", parseAsString);

  const open = (slug: string) => setTaskSlug(slug);
  const close = () => setTaskSlug(null);

  return {
    taskSlug,
    open,
    close,
    setTaskSlug,
  };
};
