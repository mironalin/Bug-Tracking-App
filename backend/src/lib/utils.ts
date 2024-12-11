import type { db } from "../db/index.js";
import { members as membersTable, insertMembersSchema } from "../db/schema/members-schema.js";
import { and, eq } from "drizzle-orm";

interface GetMemberProps {
  db: typeof db;
  workspaceId: string;
  userId: string;
}

export const getMember = async ({ db, workspaceId, userId }: GetMemberProps) => {
  const member = await db
    .select()
    .from(membersTable)
    .where(and(eq(membersTable.workspaceId, workspaceId), eq(membersTable.userId, userId)));

  return member[0];
};
