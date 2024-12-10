import { pgTable, text, integer, timestamp, index, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const rolesEnum = pgEnum("roles", ["admin", "member"]);

export const members = pgTable(
  "members",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId").notNull(),
    workspaceId: varchar().notNull(),
    role: rolesEnum(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (members) => [index("members_name_idx").on(members.userId)]
);

export const insertMembersSchema = createInsertSchema(members);

export const selectMembersSchema = createSelectSchema(members);
