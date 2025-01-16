import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-task";
import { useParams } from "@tanstack/react-router";
import { useQueryState } from "nuqs";

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const { open } = useCreateTaskModal();

  const { workspaceId } = useParams({ strict: false });

  const { data: tasks } = useGetTasks(workspaceId!);

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
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            {JSON.stringify(tasks.data)}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            {JSON.stringify(tasks.data)}
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            {JSON.stringify(tasks.data)}
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
