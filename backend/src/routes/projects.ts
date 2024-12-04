import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const projectSchema = z.object({
  id: z.number().int().min(1),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  repositoryUrl: z.string().url("Repository URL must be a valid URL"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type Project = z.infer<typeof projectSchema>;

const createPostSchema = projectSchema.omit({ id: true });

const fakeProjects: Project[] = [
  {
    id: 1,
    name: "Bug Tracker",
    description: "A web application for tracking software bugs and issues",
    repositoryUrl: "https://github.com/org/bug-tracker",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Task Manager",
    description: "Project management system for organizing and tracking tasks",
    repositoryUrl: "https://github.com/org/task-manager",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 3,
    name: "Chat Application",
    description: "Real-time messaging platform for team communication",
    repositoryUrl: "https://github.com/org/chat-app",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

export const projectsRoute = new Hono()
  .get("/", (c) => {
    return c.json({ projects: fakeProjects });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const project = await c.req.valid("json");
    fakeProjects.push({ id: fakeProjects.length + 1, ...project });
    return c.json(project);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const project = fakeProjects.find((project) => project.id === id);
    if (!project) {
      return c.notFound();
    }
    return c.json({ project });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeProjects.findIndex((project) => project.id === id);
    if (index === -1) {
      return c.notFound();
    }

    const deletedProject = fakeProjects.splice(index, 1)[0];
    return c.json({ project: deletedProject });
  });
