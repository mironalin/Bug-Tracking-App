import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getWorkspaceInfoByIdQuery = async (workspaceId: string) => {
  const response = await api.workspaces[":workspaceId"]["info"].$get({
    param: {
      workspaceId: workspaceId,
    },
    query: {},
  });

  if (!response.ok) {
    throw Error("Failed to fetch workspace info: " + response.statusText);
  }

  const data = await response.json();

  return data;
};

export const useGetWorkspaceInfoById = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceInfoByIdQuery(workspaceId),
  });
  return query;
};
