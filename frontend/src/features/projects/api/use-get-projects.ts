import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export const getProjectsQuery = async (workspaceId: string) => {
  const response = await api.projects.$get({ query: { workspaceId } });

  if (!response.ok) {
    throw Error("Failed to fetch projects: " + response.statusText);
  }

  const { data } = await response.json();

  return data;
};

export const useGetProjects = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjectsQuery(workspaceId),
  });
  return query;
};
