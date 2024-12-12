import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import {
  workspaces as workspacesTable,
  insertWorkspacesSchema,
  updateWorkspacesSchema,
  generateUniqueString,
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
  .get("/:workspaceId/info", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.param();

    const workspace = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, workspaceId));

    return c.json({ name: workspace[0].name });
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
    });

    console.log("Validated Update Object:", validatedWorkspaceUpdate);

    const updatedWorkspace = await db
      .update(workspacesTable)
      .set(validatedWorkspaceUpdate)
      .where(eq(workspacesTable.slug, workspaceId));

    return c.json({ updatedWorkspace });
  })
  .delete("/:workspaceId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // await db
    //   .delete(membersTable)
    //   .where(and(eq(membersTable.workspaceId, workspaceId), eq(membersTable.userId, user.id)));

    await db.delete(workspacesTable).where(eq(workspacesTable.slug, workspaceId));

    return c.json({ workspace: { slug: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const validatedWorkspaceUpdate = updateWorkspacesSchema.parse({
      inviteCode: generateUniqueString(10),
    });

    const workspace = await db
      .update(workspacesTable)
      .set(validatedWorkspaceUpdate)
      .where(eq(workspacesTable.slug, workspaceId))
      .returning()
      .then((res) => res[0]);

    return c.json({ workspace });
  })
  .post("/:workspaceId/join", getSessionAndUser, zValidator("json", z.object({ code: z.string() })), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.param();
    const { code } = c.req.valid("json");

    const member = await getMember({ db, workspaceId, userId: user.id });

    if (member) {
      return c.json({ error: "Already a member" }, 400);
    }

    const workspace = (await db.select().from(workspacesTable).where(eq(workspacesTable.slug, workspaceId)))[0];

    if (workspace.inviteCode !== code) {
      return c.json({ error: "Invalid code" }, 400);
    }

    const validatedMember = insertMembersSchema.parse({
      userId: user.id,
      workspaceId: workspace.slug,
      role: MemberRole.MEMBER,
    });

    await db.insert(membersTable).values(validatedMember);

    return c.json({ workspace });
  });

export type WorkspaceApi = typeof workspacesRoute;
