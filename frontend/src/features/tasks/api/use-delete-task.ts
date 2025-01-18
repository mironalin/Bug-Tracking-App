import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.tasks)[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof api.tasks)[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api.tasks[":taskId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.slug] });
    },
    onError: () => {
      toast.error("Failed to delete task!");
    },
  });

  return mutation;
};
