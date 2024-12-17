import { pgTable, text, integer, timestamp, index, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar().$default(() => generateUniqueString(16)),
  name: text("name").notNull(),
  workspaceId: varchar().notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertProjectsSchema = createInsertSchema(projects);

export const selectProjectsSchema = createSelectSchema(projects);

export function generateUniqueString(length: number = 12): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}
