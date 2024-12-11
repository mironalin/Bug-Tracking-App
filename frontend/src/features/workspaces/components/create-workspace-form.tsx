import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspaces";
import { useUploadToS3 } from "@/features/workspaces/api/use-upload-to-s3-mutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkspace, createWorkspaceSchema } from "@server/sharedTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "@tanstack/react-router";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();
  const { mutate: uploadFile, isPending: isUploading } = useUploadToS3();

  const form = useForm<CreateWorkspace>({
    resolver: zodResolver(createWorkspaceSchema),
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
          const values: CreateWorkspace = {
            name: form.getValues("name"),
            imageUrl: uploadedUrl,
          };
          createWorkspace(
            { json: values },
            {
              onSuccess: (result) => {
                form.reset();
                onCancel?.();
                navigate({ to: `/workspaces/${result.slug}` });
              },
            }
          );
        },
      });
    } else {
      const values: CreateWorkspace = {
        name: form.getValues("name"),
        imageUrl: undefined,
      };
      createWorkspace(
        { json: values },
        {
          onSuccess: (result) => {
            form.reset();
            onCancel?.();
            navigate({ to: `/workspaces/${result.slug}` });
          },
        }
      );
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new workspace</CardTitle>
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
                {isUploading ? "Uploading Image..." : isPending ? "Creating Workspace..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
