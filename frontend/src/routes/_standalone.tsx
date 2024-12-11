import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LoaderComponent } from "@/components/loader-component";
import { UserButton } from "@/features/auth/components/user-button";

export const Route = createFileRoute("/_standalone")({
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
