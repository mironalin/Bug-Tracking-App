import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { z } from "zod";

import { useCreateTask } from "../api/use-create-task";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTask,
  createTasksSchema,
  PopulatedTaskTypeInterface,
  TaskStatus,
  TaskTypeInterface,
} from "@server/sharedTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { insertTasksSchema } from "@server/db/schema/tasks-schema";
import { DatePicker } from "@/components/date-picker";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";
import { useGetMe } from "@/features/members/api/use-get-me";
import { MemberRole } from "@server/sharedTypes";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { slug: string; name: string; imageUrl: string }[];
  memberOptions: { slug: string; name: string }[];
  initialValues: z.infer<typeof insertTasksSchema>;
}

export const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initialValues }: EditTaskFormProps) => {
  const { workspaceId } = useParams({ strict: false }) as { workspaceId: string };

  const { mutate: updateTask, isPending } = useUpdateTask();

  const { data: currentMember } = useGetMe({ workspaceId });

  const form = useForm<z.infer<typeof insertTasksSchema>>({
    resolver: zodResolver(insertTasksSchema.omit({ workspaceId: true, description: true })),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof createTasksSchema>) => {
    {
      updateTask(
        { json: values, param: { taskId: initialValues.slug } },
        {
          onSuccess: () => {
            form.reset();
            onCancel?.();
          },
        }
      );
    }
  };

  if (!currentMember) {
    return null;
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {currentMember.role === MemberRole.MEMBER ? (
                          <SelectItem key={currentMember.slug} value={currentMember.slug}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar className="size-6" name={currentMember.name} />
                              {currentMember.name}
                            </div>
                          </SelectItem>
                        ) : (
                          memberOptions.map((member) => (
                            <SelectItem key={member.slug} value={member.slug}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar className="size-6" name={member.name} />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.slug} value={project.slug}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl} />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(onCancel ? "block" : "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" variant="primary" disabled={isPending}>
                {isPending ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
