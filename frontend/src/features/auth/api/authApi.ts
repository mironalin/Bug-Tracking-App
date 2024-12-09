import { api } from "@/lib/rpc";
import { queryOptions } from "@tanstack/react-query";

async function getCurrentSession() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-Session"],
  queryFn: getCurrentSession,
});
