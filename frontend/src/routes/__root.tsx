import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ErrorPage } from "@/components/error";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: () => <ErrorPage />,
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});
