import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export const LoadingJoinWorkspaceForm = () => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          <Skeleton className="h-6 w-1/3 rounded" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-6 w-3/4 rounded" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
