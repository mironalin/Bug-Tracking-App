import { LoaderCircle } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
