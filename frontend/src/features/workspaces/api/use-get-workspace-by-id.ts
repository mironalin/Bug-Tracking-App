import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getWorkspaceByIdQuery = async (workspaceId: string) => {
  const response = await api.workspaces[":workspaceId"].$get({
    param: {
      workspaceId: workspaceId,
    },
    query: {},
  });

  if (!response.ok) {
    throw Error(`Failed to fetch workspace ${workspaceId}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export const useGetWorkspaceById = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQuery(workspaceId),
  });
  return query;
};
