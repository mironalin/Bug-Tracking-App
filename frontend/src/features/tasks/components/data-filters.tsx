import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectTypeInterface, TaskStatus } from "@server/sharedTypes";
import { useParams } from "@tanstack/react-router";

import { Select, SelectItem, SelectContent, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { ListChecks, ListChecksIcon } from "lucide-react";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const { workspaceId } = useParams({ strict: false });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects(workspaceId!);
  const { data: members, isLoading: isLoadingMembers } = useGetMembers(workspaceId!);

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.projects.map((project: ProjectTypeInterface) => ({
    value: project.slug,
    name: project.name,
  }));

  const memberOptions = members?.members.map((member: ProjectTypeInterface) => ({
    value: member.slug,
    name: member.name,
  }));

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={undefined} onValueChange={() => {}}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <div className="flex flex-row gap-2 items-center">
              <ListChecksIcon className="size-4" />
              <SelectValue placeholder="All statuses" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
