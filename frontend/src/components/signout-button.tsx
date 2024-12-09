import { signOut } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ErrorContext } from "@better-fetch/fetch";

export const SignOutButton = () => {
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (ctx: ErrorContext) => {
          setPending(false);
          toast.error(ctx.error.message + "!");
        },
      },
    });
  };

  return (
    <Button disabled={pending} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
