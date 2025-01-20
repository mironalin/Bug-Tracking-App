import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberRole, MemberTypeInterface } from "@server/sharedTypes";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetMe } from "@/features/members/api/use-get-me";

export interface ExtendedMemberTypeInterface extends MemberTypeInterface {
  name: string;
  email: string;
}

interface MembersListProps {
  data: ExtendedMemberTypeInterface[];
}

export const MembersList = ({ data }: MembersListProps) => {
  const { workspaceId } = useParams({ strict: false }) as { workspaceId: string };

  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

  const { data: currentMember } = useGetMe({ workspaceId });

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?",
    "destructive"
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember({ param: { memberId } });
  };

  if (!currentMember) {
    return null;
  }

  const isCurrentUserAdmin = currentMember.role === MemberRole.ADMIN;

  const isCurrentUser = (member: ExtendedMemberTypeInterface) => member.slug === currentMember.slug;

  console.log(isCurrentUser(currentMember));

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-[-2px] p-7">
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 " />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.map((member, index: number) => (
          <Fragment key={member.id}>
            <div className="flex items-center gap-2">
              <MemberAvatar className="size-10" fallbackClassName="text-lg" name={member.name} />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isUpdatingMember || !isCurrentUserAdmin}
                    onClick={() => handleUpdateMember(member.slug!, MemberRole.ADMIN)}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isUpdatingMember || !isCurrentUserAdmin}
                    onClick={() => handleUpdateMember(member.slug!, MemberRole.MEMBER)}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    disabled={isDeletingMember || (!isCurrentUser(member) && !isCurrentUserAdmin)}
                    onClick={() => handleDeleteMember(member.slug!)}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data?.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
