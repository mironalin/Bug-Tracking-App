import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useParams } from "@tanstack/react-router";
import { ProjectTypeInterface } from "@server/sharedTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetTask } from "../api/use-get-task";
import { EditTaskForm } from "./edit-task-form";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  slug: string;
}

export const EditTaskFormWrapper = ({ onCancel, slug }: EditTaskFormWrapperProps) => {
  const { workspaceId } = useParams({ strict: false });

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({ taskSlug: slug });

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

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      initialValues={initialValues}
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
};
