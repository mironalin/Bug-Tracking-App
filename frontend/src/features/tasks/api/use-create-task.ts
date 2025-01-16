import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api.tasks["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to create task!");
    },
  });

  return mutation;
};
