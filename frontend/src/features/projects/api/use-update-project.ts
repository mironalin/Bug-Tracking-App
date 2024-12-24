import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

type ResponseType = InferResponseType<(typeof api.projects)[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof api.projects)[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
  const { projectId } = useParams({ strict: false });
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await api.projects[":projectId"]["$patch"]({ json, param });

      if (!response.ok) {
        throw new Error("Failed to update project: " + response.statusText);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project updated!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
