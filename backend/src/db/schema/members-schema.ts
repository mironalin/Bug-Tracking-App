// import * as _1 from "../../../node_modules/drizzle-zod/schema.types.internal.mjs";

import { pgTable, text, integer, timestamp, index, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const rolesEnum = pgEnum("roles", ["admin", "member"]);

export const members = pgTable(
  "members",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar().$default(() => generateUniqueString(16)),
    userId: text("userId").notNull(),
    workspaceId: varchar().notNull(),
    role: rolesEnum(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (members) => [index("members_name_idx").on(members.userId)]
);

export const insertMembersSchema = createInsertSchema(members);

export const updateMembersSchema = createInsertSchema(members).pick({ role: true }).partial();

export const selectMembersSchema = createSelectSchema(members);

export function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}
