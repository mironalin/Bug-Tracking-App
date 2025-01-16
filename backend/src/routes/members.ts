import { Hono } from "hono";
import { getSessionAndUser } from "../middleware/get-session-and-user.js";
import { db } from "../db/index.js";
import { members as membersTable } from "../db/schema/members-schema.js";
import { user as userTable } from "../db/schema/auth-schema.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMember } from "../lib/utils.js";
import { eq } from "drizzle-orm";
import { MemberRole } from "../sharedTypes.js";

import { updateMembersSchema } from "../db/schema/members-schema.js";

export const membersRoute = new Hono()
  .get("/", getSessionAndUser, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { workspaceId } = c.req.valid("query");

    const member = await getMember({
      db,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const members = await db.select().from(membersTable).where(eq(membersTable.workspaceId, workspaceId));

    const populatedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, member.userId))
          .then((res) => res[0]);
        return { ...member, name: user.name, email: user.email };
      })
    );

    return c.json({ members: populatedMembers });
  })
  .delete("/:memberId", getSessionAndUser, async (c) => {
    const user = c.var.user;
    if (!user) return c.body(null, 401);

    const { memberId } = c.req.param();

    const memberToDelete = (await db.select().from(membersTable).where(eq(membersTable.slug, memberId)))[0];

    const allMembersInWorkspace = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.workspaceId, memberToDelete.workspaceId));

    const member = await getMember({ db, userId: user.id, workspaceId: memberToDelete.workspaceId });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    if (member.id !== memberToDelete.id && member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized" }, 401);

    if (allMembersInWorkspace.length === 1) {
      return c.json({ error: "Cannot delete the last member in a workspace" }, 400);
    }

    await db.delete(membersTable).where(eq(membersTable.slug, memberId));

    return c.json({ member: { slug: memberId } });
  })
  .patch(
    "/:memberId",
    getSessionAndUser,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const user = c.var.user;
      if (!user) return c.body(null, 401);

      const { role } = c.req.valid("json");
      const { memberId } = c.req.param();

      const memberToUpdate = (await db.select().from(membersTable).where(eq(membersTable.slug, memberId)))[0];

      const allMembersInWorkspace = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.workspaceId, memberToUpdate.workspaceId));

      const member = await getMember({ db, userId: user.id, workspaceId: memberToUpdate.workspaceId });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      if (member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

      if (allMembersInWorkspace.length === 1) {
        return c.json({ error: "Cannot downgrade the only member" }, 400);
      }

      const validatedMemberUpdate = updateMembersSchema.parse({
        role: role,
      });

      await db.update(membersTable).set(validatedMemberUpdate).where(eq(membersTable.slug, memberId));

      return c.json({ member: { slug: memberToUpdate.slug } });
    }
  );
