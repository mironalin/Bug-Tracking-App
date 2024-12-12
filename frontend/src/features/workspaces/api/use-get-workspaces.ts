import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export const getWorkspacesQuery = async () => {
  const response = await api.workspaces.$get();

  if (!response.ok) {
    throw Error("Failed to fetch workspaces: " + response.statusText);
  }

  const data = await response.json();

  return data;
};

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspacesQuery,
  });
  return query;
};

export const getWorkspacesQueryOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: getWorkspacesQuery,
});
