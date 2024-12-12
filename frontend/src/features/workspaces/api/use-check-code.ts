import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export const getCheckCode = async (workspaceId: string, inviteCode: string) => {
  const response = await api.workspaces[":workspaceId"]["join"][":inviteCode"].$get({
    param: {
      workspaceId: workspaceId,
      inviteCode: inviteCode,
    },
    query: {},
  });

  if (!response.ok) {
    throw Error(`Invite code not valid ${workspaceId}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export const useGetCheckCode = (workspaceId: string, inviteCode: string) => {
  const query = useQuery({
    queryKey: ["checkCode", workspaceId, inviteCode],
    queryFn: () => getCheckCode(workspaceId, inviteCode),
  });
  return query;
};
