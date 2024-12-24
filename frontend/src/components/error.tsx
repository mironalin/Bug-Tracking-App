import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export const ErrorPage = () => {
  return (
    <div className="h-screen flex-col gap-y-4 flex items-center justify-center">
      <AlertTriangle className="size-6" />
      <p className="text-sm">Something went wrong</p>
      <Button variant="secondary" size="sm" asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
};
