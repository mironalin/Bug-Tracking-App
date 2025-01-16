import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

interface GetTasksQuery {
  workspaceId: string;
  projectId?: string | null;
  status?: string | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export const getTasksQuery = async ({ workspaceId, projectId, status, search, assigneeId, dueDate }: GetTasksQuery) => {
  const response = await api.tasks.$get({
    query: {
      workspaceId,
      projectId: projectId ?? undefined,
      status: status ?? undefined,
      search: search ?? undefined,
      assigneeId: assigneeId ?? undefined,
      dueDate: dueDate ?? undefined,
    },
  });

  if (!response.ok) {
    throw Error("Failed to fetch tasks: " + response.statusText);
  }

  const data = await response.json();

  return data;
};

export const useGetTasks = ({ workspaceId, projectId, status, search, assigneeId, dueDate }: GetTasksQuery) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId, projectId, status, search, assigneeId, dueDate],
    queryFn: () => getTasksQuery({ workspaceId, projectId, status, search, assigneeId, dueDate }),
  });
  return query;
};
