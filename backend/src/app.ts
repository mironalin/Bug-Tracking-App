import { Hono } from "hono";
import { logger } from "hono/logger";
import { projectsRoute } from "./routes/projects.js";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/projects", projectsRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
