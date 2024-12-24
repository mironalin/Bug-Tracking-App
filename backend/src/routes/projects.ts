import { Hono } from "hono";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { getSessionAndUser } from "../middleware/get-session-and-user.js";
import { db } from "../db/index.js";
import { insertProjectsSchema, projects as projectsTable } from "../db/schema/projects-schema.js";
import { getMember } from "../lib/utils.js";

export const projectsRoute = new Hono()
  .get("/", getSessionAndUser, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.valid("query");

    const member = getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.workspaceId, workspaceId))
      .orderBy(desc(projectsTable.createdAt));

    return c.json({ projects });
  })
  .post("/", getSessionAndUser, zValidator("json", insertProjectsSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, imageUrl, workspaceId } = c.req.valid("json");

    console.log("name", name);

    const member = getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const validatedProject = insertProjectsSchema.parse({ name, imageUrl, userId: user.id, workspaceId });

    const result = await db
      .insert(projectsTable)
      .values(validatedProject)
      .returning()
      .then((res) => res[0]);

    return c.json(result);
  })
  .get("/:projectId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { projectId } = c.req.param();

    const project = (await db.select().from(projectsTable).where(eq(projectsTable.slug, projectId)))[0];

    const member = await getMember({ db, workspaceId: project.workspaceId, userId: user.id });

    if (!member) {
      return c.json({ project: [] });
    }

    return c.json({ project });
  });
