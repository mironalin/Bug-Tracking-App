import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.workspaces)[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<(typeof api.workspaces)[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await api.workspaces[":workspaceId"]["join"]["$post"]({ json, param });

      if (!response.ok) {
        throw new Error("Failed to join workspace: " + response.statusText);
      }

      return await response.json();
    },
    onSuccess: ({ workspace }) => {
      toast.success("Joined workspace successfully!");
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspace.slug] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
