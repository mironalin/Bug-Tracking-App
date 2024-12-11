import { LoaderCircle } from "lucide-react";

export const LoaderComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle className="size-10 animate-spin text-muted-foreground" />
    </div>
  );
};
