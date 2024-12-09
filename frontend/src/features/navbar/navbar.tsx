import { SignOutButton } from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";
import { UserButton } from "../auth/components/user-button";

export function Navbar() {
  const { data: session } = authClient.useSession();

  return (
    <div className="mx-auto max-w-screen-2xl p-4">
      <nav className="flex justify-between items-center">
        {session ? (
          <>
            <h1>Hello, {session.user.name}</h1>
            <div className="flex items-center gap-2">
              <UserButton />
            </div>
          </>
        ) : (
          <div className="ml-auto">
            <Button asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
