import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useParams } from "@tanstack/react-router";

type ResponseType = InferResponseType<(typeof api.workspaces)[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof api.workspaces)[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api.workspaces[":workspaceId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }

      return await response.json();
    },
    onSuccess: ({ workspace }) => {
      toast.success("Workspace deleted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });

  return mutation;
};
