import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<(typeof api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });

      if (!response.ok) {
        throw new Error("Failed to reset invite code: " + response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Invite code reseted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // queryClient.invalidateQueries({ queryKey: ["workspace", workspace.slug] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
