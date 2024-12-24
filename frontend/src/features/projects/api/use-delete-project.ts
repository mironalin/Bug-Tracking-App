import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.projects)[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof api.projects)[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api.projects[":projectId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete project: " + response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project deleted!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
