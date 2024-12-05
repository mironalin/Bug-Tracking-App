import { Hono } from "hono";
import { auth } from "../lib/auth.js";
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
    name: "Chat Application",
    description: "Real-time messaging platform for team communication",
    repositoryUrl: "https://github.com/org/chat-app",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Task Manager",
    description: "Efficient task management system for productivity",
    repositoryUrl: "https://github.com/org/task-manager",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: 3,
    name: "E-commerce Platform",
    description: "Scalable online shopping solution",
    repositoryUrl: "https://github.com/org/ecommerce",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-12T09:30:00Z",
  },
  {
    id: 4,
    name: "Weather App",
    description: "Real-time weather forecasting application",
    repositoryUrl: "https://github.com/org/weather-app",
    createdAt: "2024-01-08T13:45:00Z",
    updatedAt: "2024-01-11T10:15:00Z",
  },
  {
    id: 5,
    name: "Fitness Tracker",
    description: "Personal health and fitness monitoring tool",
    repositoryUrl: "https://github.com/org/fitness-tracker",
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-09T14:30:00Z",
  },
];

export const projectsRoute = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .get("/", (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);
    return c.json({ projects: fakeProjects });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);
    const project = await c.req.valid("json");
    fakeProjects.push({ id: fakeProjects.length + 1, ...project });
    return c.json(project);
  })
  .get("/:id{[0-9]+}", (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);
    const id = Number.parseInt(c.req.param("id"));
    const project = fakeProjects.find((project) => project.id === id);
    if (!project) {
      return c.notFound();
    }
    return c.json({ project });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeProjects.findIndex((project) => project.id === id);
    if (index === -1) {
      return c.notFound();
    }

    const deletedProject = fakeProjects.splice(index, 1)[0];
    return c.json({ project: deletedProject });
  });
