import { Navbar } from "@/features/navbar/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
export const Route = createFileRoute("/_index")({
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
