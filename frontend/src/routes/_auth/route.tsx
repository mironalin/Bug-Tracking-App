import { Button } from "@/components/ui/button";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const isSignIn = pathname === "/sign-in";

  console.log(pathname);
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Link to="/">
            <img src="/logo.svg" height={56} width={152} alt="logo" />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link to={isSignIn ? "/sign-up" : "/sign-in"}>{isSignIn ? "Sign Up" : "Sign In"}</Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </main>
  );
}
