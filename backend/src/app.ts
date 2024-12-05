import { Hono } from "hono";
import { logger } from "hono/logger";
import { projectsRoute } from "./routes/projects.js";
import { authRoute } from "./routes/auth.js";
import { sessionRoute } from "./routes/session.js";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/projects", projectsRoute)
  .route("/auth/*", authRoute)
  .route("/session", sessionRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
