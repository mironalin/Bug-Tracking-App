import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectsRoute } from "./routes/projects.js";
import { authRoute } from "./routes/auth.js";
import { sessionRoute } from "./routes/session.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Add your frontend URLs
    credentials: true, // Important for cookies/auth
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86400,
  })
);

const apiRoutes = app
  .basePath("/api")
  .route("/projects", projectsRoute)
  .route("/auth/*", authRoute)
  .route("/session", sessionRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
