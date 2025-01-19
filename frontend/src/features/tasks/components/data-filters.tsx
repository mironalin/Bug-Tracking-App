import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectTypeInterface, TaskStatus } from "@server/sharedTypes";
import { useParams } from "@tanstack/react-router";

import { Select, SelectItem, SelectContent, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  interface Project {
    value: string;
    name: string;
  }

  interface Member {
    value: string;
    name: string;
  }

  const [{ status, assigneeId, projectId, dueDate }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssigneeChange = (value: string) => {
    if (value === "all") {
      setFilters({ assigneeId: null });
    } else {
      setFilters({ assigneeId: value as string });
    }
  };

  const onProjectChange = (value: string) => {
    if (value === "all") {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value as string });
    }
  };

  const resetSelect = () => {
    setFilters({ status: null, assigneeId: null, projectId: null, dueDate: null });
    setKey(+new Date());
  };

  const [key, setKey] = useState(+new Date());

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2" key={key}>
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => {
          onStatusChange(value);
        }}
      >
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
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => {
          onAssigneeChange(value);
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <div className="flex flex-row gap-2 items-center">
              <UserIcon className="size-4" />
              <SelectValue placeholder="All assignees" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member: Member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => {
            onProjectChange(value);
          }}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <div className="flex flex-row gap-2 items-center">
                <FolderIcon className="size-4" />
                <SelectValue placeholder="All projects" />
              </div>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project: Project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="w-full lg:w-auto h-8"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
      <Button onClick={() => resetSelect()} variant="muted" className="w-full lg:w-auto h-8">
        Clear Filters
      </Button>
    </div>
  );
};
