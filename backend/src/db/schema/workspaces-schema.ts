import { pgTable, text, integer, timestamp, index, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export const workspaces = pgTable(
  "workspaces",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar().$default(() => generateUniqueString(16)),
    name: text("name").notNull(),
    userId: text("userId").notNull(),
    imageUrl: text("imageUrl"),
    inviteCode: varchar().$default(() => generateUniqueString(10)),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (workspaces) => [index("workspaces_name_idx").on(workspaces.userId)]
);

export const insertWorkspacesSchema = createInsertSchema(workspaces, {
  slug: z.string().optional(),
  name: z.string().trim().min(1, "Required"),
  userId: z.string().trim().min(1, "Required"),
  imageUrl: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  inviteCode: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const selectWorkspacesSchema = createSelectSchema(workspaces);

function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}
