import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingEditWorkspaceForm = () => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <Skeleton className="h-6 w-2/3 rounded" />
      </CardHeader>
      <div className="px-7">
        <Skeleton className="h-2 w-full rounded mt-2" />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-y-4">
          {/* Skeleton for Workspace Name Input */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          {/* Skeleton for Image Upload Section */}
          <div className="flex items-center gap-x-5">
            <Skeleton className="h-[72px] w-[72px] rounded-md" />
            <div className="flex flex-col flex-1 gap-y-2">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-6 w-24 rounded mt-2" />
            </div>
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded mt-6" />
        {/* Skeleton for Buttons */}
        <div className="flex items-center justify-between mt-8 mb-2">
          <Skeleton className="h-10 w-24 rounded invisible" />
          <Skeleton className="h-10 w-36 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};
