import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getProjectByIdQuery = async (projectId: string) => {
  const response = await api.projects[":projectId"].$get({
    param: {
      projectId: projectId,
    },
  });

  if (!response.ok) {
    throw Error(`Failed to fetch project ${projectId}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export const useGetProjectById = (projectId: string) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectByIdQuery(projectId),
  });
  return query;
};
