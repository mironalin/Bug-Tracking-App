import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

interface ErrorPageProps {
  message?: string;
}

export const ErrorPage = ({ message = "Something went wrong" }: ErrorPageProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <AlertTriangle className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground mb-2">{message}</p>
      <Button variant="secondary" size="sm" asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
};
