import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.workspaces.$get();

      if (!response.ok) {
        throw Error("Failed to fetch workspaces");
      }

      const data = await response.json();

      return data;
    },
  });
  return query;
};
