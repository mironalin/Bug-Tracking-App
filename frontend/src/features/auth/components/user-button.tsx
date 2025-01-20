import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";
import { useSession } from "@/lib/auth-client";
import { Loader, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { ErrorContext } from "@better-fetch/fetch";
import { useNavigate } from "@tanstack/react-router";
import { MemberRole } from "@server/sharedTypes";

interface UserButtonProps {
  role?: MemberRole;
}

export const UserButton = ({ role }: UserButtonProps) => {
  const navigate = useNavigate();
  const { data, isPending } = useSession();
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/sign-in" });
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message + "!");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.user) {
    throw new Error("User not found");
  }

  const { name, email } = data.user;

  const avatarFallback = name ? name.charAt(0).toUpperCase() : (email.charAt(0).toUpperCase() ?? "U");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative flex flex-row items-center cursor-pointer hover:opacity-75 transition border p-2 rounded-lg">
        {role ? <p className="text-muted-foreground text-sm font-medium mr-2 capitalize">{role}</p> : null}
        <Avatar className="size-10  border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">{name || "User"}</p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4" />
          <p className="pb-1">Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
