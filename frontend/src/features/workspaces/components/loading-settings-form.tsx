import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSettingsForm = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <Skeleton className="h-6 w-2/3 rounded" />
        </CardHeader>
        <div className="px-7">
          <Skeleton className="h-2 w-full rounded mt-2" />
        </div>
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-10 w-full rounded mt-1" />
            </div>
            <div className="flex items-center gap-x-5 mt-2">
              <Skeleton className="h-[72px] w-[72px] rounded-md" />
              <div className="flex flex-col flex-1 gap-y-2">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded mt-6" />
          <div className="flex items-center justify-between mt-8 mb-1">
            <Skeleton className="h-10 w-24 rounded invisible" />
            <Skeleton className="h-10 w-36 rounded" />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <Skeleton className="h-6 w-2/3 rounded mb-2" />
            <p className="text-sm text-muted-foreground flex flex-col gap-2">
              <Skeleton className="h-3 rounded" />
              <Skeleton className="h-3 w-2/3 rounded md:hidden lg:block" />
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-12 w-full rounded flex-1" />
                <Skeleton className="h-12 w-12 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-2 rounded mt-6 mb-6" />
            <Skeleton className="mt-6  ml-auto h-8 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <Skeleton className="h-6 w-2/4 rounded mb-2" />
            <p className="text-sm text-muted-foreground flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-1/4 rounded md:hidden lg:block" />{" "}
            </p>
            <Skeleton className="h-2 rounded mt-6 mb-6" />
            <Skeleton className="mt-6  ml-auto h-8 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
