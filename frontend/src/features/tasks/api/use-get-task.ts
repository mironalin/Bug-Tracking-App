import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

interface GetTaskQuery {
  taskSlug: string;
}

export const getTaskQuery = async ({ taskSlug }: GetTaskQuery) => {
  const response = await api.tasks[":taskSlug"].$get({
    param: {
      taskSlug,
    },
  });

  if (!response.ok) {
    throw Error("Failed to individual task: " + response.statusText);
  }

  const { data } = await response.json();

  return data;
};

export const useGetTask = ({ taskSlug }: GetTaskQuery) => {
  const query = useQuery({
    queryKey: ["task", taskSlug],
    queryFn: () => getTaskQuery({ taskSlug }),
  });
  return query;
};
