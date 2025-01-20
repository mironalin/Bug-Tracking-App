import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";

import { useLocation, useParams } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useGetMe } from "@/features/members/api/user-get-me";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Projects",
    description: "View all of your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const { workspaceId } = useParams({ strict: false }) as { workspaceId: string };

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { data: currentMember, isLoading: isLoadingCurrentMember } = useGetMe({ workspaceId });

  if (isLoadingCurrentMember) {
    return null;
  }

  const pathnameParts = pathname.split("/");

  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-medium">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton role={currentMember.role} />
    </nav>
  );
};
