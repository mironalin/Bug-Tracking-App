import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export const getMembersQuery = async (workspaceId: string) => {
  const response = await api.members.$get({ query: { workspaceId } });

  if (!response.ok) {
    throw Error("Failed to fetch members: " + response.statusText);
  }

  const { data } = await response.json();

  return data;
};

export const useGetMembers = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersQuery(workspaceId),
  });
  return query;
};
