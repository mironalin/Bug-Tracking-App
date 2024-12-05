import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectsRoute } from "./routes/projects.js";
import { authRoute } from "./routes/auth.js";
import { auth } from "./lib/auth.js";

const app = new Hono();

app.use(
  "/api/auth/**", // or replace with "*" to enable cors for all routes
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

const apiRoutes = app.basePath("/api").route("/projects", projectsRoute).route("/auth/*", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
