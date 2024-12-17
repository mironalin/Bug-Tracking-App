import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof api.members)[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof api.members)[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api.members[":memberId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member deleted!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
