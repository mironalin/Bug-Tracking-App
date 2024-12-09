import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectsRoute } from "./routes/projects.js";
import { authRoute } from "./routes/auth.js";
import { meRoute } from "./routes/me.js";
import { auth } from "./lib/auth.js";

const app = new Hono();

app.use(
  "/api/auth/**", // or replace with "*" to enable cors for all routes
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

const apiRoutes = app
  .basePath("/api")
  .route("/projects", projectsRoute)
  .route("/auth/**", authRoute)
  .route("/me", meRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
