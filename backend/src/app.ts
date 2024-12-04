import { Hono } from "hono";
import { logger } from "hono/logger";
import { projectsRoute } from "./routes/projects.js";

const app = new Hono();

app.use("*", logger());

app.route("/api/projects", projectsRoute);

export default app;
