import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/features/auth/api/authApi";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { LoaderComponent } from "@/components/LoaderComponent";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const data = await queryClient.fetchQuery(userQueryOptions);
    if (!data.session) {
      throw redirect({ to: "/sign-in" });
    }
  },
  pendingComponent: () => <LoaderComponent />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
