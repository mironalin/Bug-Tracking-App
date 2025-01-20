import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getWorkspaceAnalytics = async (workspaceId: string) => {
  const response = await api.workspaces[":workspaceId"]["analytics"].$get({
    param: {
      workspaceId,
    },
  });

  if (!response.ok) {
    throw Error(`Failed to fetch workspace analytics for ${workspaceId}: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};

export const useGetWorkspaceAnalytics = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspaces-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalytics(workspaceId),
  });
  return query;
};
