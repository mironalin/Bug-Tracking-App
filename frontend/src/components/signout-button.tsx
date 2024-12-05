import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: "/sign-in" });
          },
        },
      });
    } catch (error) {
      toast.error("Error signing out: " + error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button disabled={pending} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
