import { Navbar } from "@/features/navbar/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/api";
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const data = await queryClient.fetchQuery(userQueryOptions);
    if (!data.session) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
}
