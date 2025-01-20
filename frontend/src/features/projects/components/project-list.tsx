import { Button } from "@/components/ui/button";
import { ProjectTypeInterface } from "@server/sharedTypes";
import { PlusIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { Link, useParams } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "./project-avatar";

interface ProjectListProps {
  data: ProjectTypeInterface[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { workspaceId } = useParams({ strict: false });
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-2 xl:pb-0 pb-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={() => createProject()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.slug}>
              <Link to={`/workspaces/${workspaceId}/projects/${project.slug}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No projects found</li>
        </ul>
      </div>
    </div>
  );
};
