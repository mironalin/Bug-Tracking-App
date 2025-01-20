import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

interface GetMeQueryParams {
  workspaceId: string;
}

export const getMeQuery = async ({ workspaceId }: GetMeQueryParams) => {
  const response = await api.members[":workspaceId"].$get({ param: { workspaceId } });

  if (!response.ok) {
    throw Error("Failed to fetch me: " + response.statusText);
  }

  const { data } = await response.json();

  return data;
};

export const useGetMe = ({ workspaceId }: GetMeQueryParams) => {
  const query = useQuery({
    queryKey: ["me", workspaceId],
    queryFn: () => getMeQuery({ workspaceId }),
  });
  return query;
};

export const useGetMeQueryKey = ({ workspaceId }: GetMeQueryParams) => ["me", workspaceId];
