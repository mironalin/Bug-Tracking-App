import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "../db/index.js";
import { workspaces as workspacesTable, insertWorkspacesSchema } from "../db/schema/workspaces-schema.js";
import { auth } from "../lib/auth.js";

import { createWorkspaceSchema } from "../sharedTypes.js";

export const workspacesRoute = new Hono<{
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
  .post("/", zValidator("json", createWorkspaceSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);

    const workspace = c.req.valid("json");

    const validatedWorkspace = insertWorkspacesSchema.parse({ ...workspace, userId: user.id });

    const result = await db
      .insert(workspacesTable)
      .values(validatedWorkspace)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  });
