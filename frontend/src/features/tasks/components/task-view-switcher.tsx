import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useParams } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "@server/sharedTypes";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCalendar } from "./data-calendar";
import { PageLoader } from "@/components/page-loader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { QueryClient } from "@tanstack/react-query";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
  currentAssigneeId?: string;
  showAllTasks?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
  hideAssigneeFilter,
  currentAssigneeId,
  showAllTasks,
}: TaskViewSwitcherProps) => {
  const { workspaceId, projectId: initialProjectId } = useParams({ strict: false });
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const onKanbanChange = useCallback((tasks: { slug: string; status: TaskStatus; position: number }[]) => {
    bulkUpdate({ json: { tasks } });
  }, []);

  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    refetch: taskRefetch,
  } = useGetTasks({
    workspaceId: workspaceId!,
    projectId: initialProjectId || projectId,
    assigneeId: showAllTasks ? assigneeId : currentAssigneeId,
    status,
    dueDate,
  });

  if (isLoadingTasks) {
    return <PageLoader />;
  }

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={() =>
              open({
                projectId: initialProjectId,
                currentAssigneeId: currentAssigneeId,
              })
            }
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters
          hideProjectFilter={hideProjectFilter}
          hideAssigneeFilter={hideAssigneeFilter}
          handleRefetch={taskRefetch}
        />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 pb-4 h-full">
              <DataCalendar data={tasks} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
