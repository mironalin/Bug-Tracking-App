import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

type ResponseType = InferResponseType<(typeof api.projects)["$post"], 200>;
type RequestType = InferRequestType<(typeof api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api.projects["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // queryClient.invalidateQueries({ queryKey: ["project", workspaceId] });
    },
    onError: () => {
      toast.error("Failed to create project!");
    },
  });

  return mutation;
};
