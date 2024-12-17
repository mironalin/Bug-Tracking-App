import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useUploadToS3 } from "@/features/workspaces/api/use-upload-to-s3-mutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProject, CreateWorkspace, createWorkspaceSchema } from "@server/sharedTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "@tanstack/react-router";
import { insertProjectsSchema } from "@server/db/schema/projects-schema";
interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createProject, isPending } = useCreateProject();
  const { mutate: uploadFile, isPending: isUploading } = useUploadToS3();

  const form = useForm<CreateProject>({
    resolver: zodResolver(insertProjectsSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

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
          const values: CreateProject = {
            workspaceId: workspaceId!,
            name: form.getValues("name"),
            imageUrl: uploadedUrl,
          };
          createProject(
            { json: values },
            {
              onSuccess: () => {
                form.reset();
                onCancel?.();
              },
            }
          );
        },
      });
    } else {
      const values: CreateProject = {
        workspaceId: workspaceId!,
        name: form.getValues("name"),
        imageUrl: undefined,
      };
      createProject(
        { json: values },
        {
          onSuccess: () => {
            form.reset();
            onCancel?.();
          },
        }
      );
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
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
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
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
                        <p className="text-sm">Project Icon</p>
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
                {isUploading ? "Uploading Image..." : isPending ? "Creating Project..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
