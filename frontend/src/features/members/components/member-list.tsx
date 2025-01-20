import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { Link, useParams } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { MemberAvatar } from "./member-avatar";
import { ExtendedMemberTypeInterface } from "@/features/workspaces/components/members-list";

interface MemberListProps {
  data: ExtendedMemberTypeInterface[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const { workspaceId } = useParams({ strict: false });

  return (
    <div className="flex flex-col gap-y-4 row-span-2 col-span-2">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link to={`/workspaces/${workspaceId}/members`}>
              <PlusIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.slug}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar className="size-12" name={member.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No projects found</li>
        </ul>
      </div>
    </div>
  );
};
