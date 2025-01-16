import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export const getTasksQuery = async (workspaceId: string) => {
  const response = await api.tasks.$get({ query: { workspaceId } });

  if (!response.ok) {
    throw Error("Failed to fetch tasks: " + response.statusText);
  }

  const data = await response.json();

  return data;
};

export const useGetTasks = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: () => getTasksQuery(workspaceId),
  });
  return query;
};
