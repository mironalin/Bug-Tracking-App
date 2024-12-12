import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useUploadToS3 } from "@/features/workspaces/api/use-upload-to-s3-mutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateWorkspace, WorkspaceTypeInterface } from "@server/sharedTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "@tanstack/react-router";
import { updateWorkspacesSchema } from "@server/db/schema/workspaces-schema";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: WorkspaceTypeInterface;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();
  const { mutate: uploadFile, isPending: isUploading } = useUploadToS3();
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?",
    "destructive"
  );

  const form = useForm<UpdateWorkspace>({
    resolver: zodResolver(updateWorkspacesSchema),
    defaultValues: {
      ...initialValues,
      imageUrl: initialValues.imageUrl ?? undefined,
    },
  });

  const handleDelete = async () => {
    const result = await confirmDelete();
    if (!result) {
      return;
    }
    deleteWorkspace(
      { param: { workspaceId: initialValues.slug } },
      {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      }
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      form.setValue("imageUrl", URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async () => {
    if (file) {
      uploadFile(file, {
        onSuccess: (uploadedUrl) => {
          const finalValues: UpdateWorkspace = {
            name: form.getValues("name"),
            imageUrl: uploadedUrl,
          };
          updateWorkspace(
            { json: finalValues, param: { workspaceId: initialValues.slug } },
            {
              onSuccess: () => {
                // form.reset();
                onCancel?.();
                navigate({ to: `/workspaces/${initialValues.slug}` });
              },
            }
          );
        },
      });
    } else {
      const finalValues: UpdateWorkspace = {
        name: form.getValues("name"),
        imageUrl: undefined,
      };
      updateWorkspace(
        { json: finalValues, param: { workspaceId: initialValues.slug } },
        {
          onSuccess: () => {
            // form.reset();
            onCancel?.();
            navigate({ to: `/workspaces/${initialValues.slug}` });
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-[-2px] p-7">
          <Button
            size="sm"
            variant="secondary"
            onClick={onCancel ? onCancel : () => navigate({ to: `/workspaces/${initialValues.slug}` })}
          >
            <ArrowLeftIcon className="size-4" />
            <p className="mb-[0.5px]">Back</p>
          </Button>
          <CardTitle className="text-xl font-bold mb-10">{initialValues.name}</CardTitle>
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
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <img src={field.value} alt="Logo" className="object-cover" />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">JPG, PNG, SVG OR JPEG, max 1MB</p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                form.setValue("imageUrl", "");
                                setFile(null);
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="teritary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
                <Button type="submit" size="lg" variant="primary" disabled={isUploading || isPending}>
                  {isUploading ? "Uploading Image..." : isPending ? "Saving changes..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible. All data associated with this workspace will be lost.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
