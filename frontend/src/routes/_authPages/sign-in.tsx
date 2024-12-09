import { SignInCard } from "@/features/auth/components/sign-in-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authPages/sign-in")({
  component: SignIn,
});

function SignIn() {
  return <SignInCard />;
}
