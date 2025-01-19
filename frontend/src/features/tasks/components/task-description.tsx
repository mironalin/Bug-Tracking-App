import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { PopulatedTaskTypeInterface } from "@server/sharedTypes";
import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: PopulatedTaskTypeInterface;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({ json: { description: value }, param: { taskId: task.slug } });
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="secondary" size="sm">
          {isEditing ? <XIcon className="size-4" /> : <PencilIcon className="size-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description"
            value={value as string}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button className="w-fit ml-auto" size="sm" onClick={handleSave}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>{task.description || <span className="text-muted-foreground">No description set</span>}</div>
      )}
    </div>
  );
};
