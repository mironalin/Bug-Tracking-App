import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { LoaderComponent } from "@/components/loader-component";
import { UserButton } from "@/features/auth/components/user-button";
import { userQueryOptions } from "@/features/auth/api/authApi";

export const Route = createFileRoute("/_standalone")({
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
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link to="/">
            <img src="/logo.svg" alt="Logo" height={56} width={152} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
