import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getProjectAnalytics = async (projectId: string) => {
  const response = await api.projects[":projectId"]["analytics"].$get({
    param: {
      projectId: projectId,
    },
  });

  if (!response.ok) {
    throw Error(`Failed to fetch project analytics for ${projectId}: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};

export const useGetProjectAnalytics = (projectId: string) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: () => getProjectAnalytics(projectId),
  });
  return query;
};
