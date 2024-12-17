import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./routes/auth.js";
import { meRoute } from "./routes/me.js";
import { auth } from "./lib/auth.js";
import { workspacesRoute } from "./routes/workspaces.js";
import { bucketRoute } from "./routes/bucketRoute.js";
import { logger } from "hono/logger";
import { membersRoute } from "./routes/members.js";

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

// app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/auth/**", authRoute)
  .route("/me", meRoute)
  .route("/workspaces", workspacesRoute)
  .route("/generatePresignedUrl", bucketRoute)
  .route("/members", membersRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
