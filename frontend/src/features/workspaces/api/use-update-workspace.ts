import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.workspaces)[":workspaceId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof api.workspaces)[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await api.workspaces[":workspaceId"]["$patch"]({ json, param });

      if (!response.ok) {
        throw new Error("Failed to update workspace: " + response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace updated!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
