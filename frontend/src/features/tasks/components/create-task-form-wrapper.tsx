import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useParams } from "@tanstack/react-router";
import { ProjectTypeInterface } from "@server/sharedTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
  const { workspaceId } = useParams({ strict: false });
  const { status } = useCreateTaskModal();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects(workspaceId!);
  const { data: members, isLoading: isLoadingMembers } = useGetMembers(workspaceId!);

  const projectOptions = projects?.projects.map((project: ProjectTypeInterface) => ({
    slug: project.slug,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.members.map((project: ProjectTypeInterface) => ({
    slug: project.slug,
    name: project.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions} memberOptions={memberOptions} status={status} />;
};