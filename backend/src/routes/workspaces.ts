import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";

import { db } from "../db/index.js";
import {
  workspaces as workspacesTable,
  insertWorkspacesSchema,
  updateWorkspacesSchema,
} from "../db/schema/workspaces-schema.js";
import { members as membersTable, insertMembersSchema } from "../db/schema/members-schema.js";
import { auth } from "../lib/auth.js";

import { createWorkspaceSchema, MemberRole } from "../sharedTypes.js";
import { and, eq, inArray } from "drizzle-orm";
import { getMember } from "../lib/utils.js";
import { getSessionAndUser } from "../middleware/get-session-and-user.js";

export const workspacesRoute = new Hono()
  .get("/", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const members = await db.select().from(membersTable).where(eq(membersTable.userId, user.id));

    if (members.length === 0) {
      return c.json({ workspaces: [] });
    }

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = await db.select().from(workspacesTable).where(inArray(workspacesTable.slug, workspaceIds));

    return c.json({ workspaces });
  })
  .post("/", getSessionAndUser, zValidator("json", createWorkspaceSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const workspace = c.req.valid("json");

    const validatedWorkspace = insertWorkspacesSchema.parse({ ...workspace, userId: user.id });

    const result = await db
      .insert(workspacesTable)
      .values(validatedWorkspace)
      .returning()
      .then((res) => res[0]);

    const validatedMember = insertMembersSchema.parse({
      userId: user.id,
      workspaceId: result.slug,
      role: MemberRole.ADMIN,
    });

    await db.insert(membersTable).values(validatedMember);

    c.status(201);
    return c.json(result);
  })
  .get("/:workspaceId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });

    if (!member) {
      console.log("no member found");
      return c.json({ workspaces: [] });
    }

    const workspace = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, workspaceId));

    return c.json({ workspace });
  })
  .patch("/:workspaceId", getSessionAndUser, zValidator("json", updateWorkspacesSchema), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { name, imageUrl } = c.req.valid("json");

    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const validatedWorkspaceUpdate = updateWorkspacesSchema.parse({
      name: name,
      imageUrl: imageUrl ?? null,
      updatedAt: () => sql`now()`,
    });

    console.log("Validated Update Object:", validatedWorkspaceUpdate);

    const updatedWorkspace = await db
      .update(workspacesTable)
      .set(validatedWorkspaceUpdate)
      .where(eq(workspacesTable.slug, workspaceId));

    return c.json({ updatedWorkspace });
  });

export type WorkspaceApi = typeof workspacesRoute;
