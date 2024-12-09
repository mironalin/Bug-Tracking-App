import { Navbar } from "@/features/navbar/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/api";
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth;
    if (!auth.data?.session) {
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
